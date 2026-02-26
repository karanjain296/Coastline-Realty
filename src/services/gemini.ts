import { GoogleGenAI, GenerateContentResponse, Modality, Type, FunctionDeclaration } from "@google/genai";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  sources?: { uri: string; title: string }[];
  audio?: string; // Base64 audio data
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  type?: string;
  status?: string;
  builder?: string;
  keywords?: string[];
}

const get_map_context: FunctionDeclaration = {
  name: "get_map_context",
  parameters: {
    type: Type.OBJECT,
    description: "Renders an interactive 3D map of Mangalore with 2km radius Points of Interest (Smart Roads, Malls, Hospitals).",
    properties: {
      location: { type: Type.STRING, description: "Locality name or coordinates" },
      radius: { type: Type.NUMBER, description: "Radius in km" }
    },
    required: ["location"]
  }
};

const verify_rera_live: FunctionDeclaration = {
  name: "verify_rera_live",
  parameters: {
    type: Type.OBJECT,
    description: "Fetches real-time RERA status, construction progress, and financial audit from Karnataka RERA portal.",
    properties: {
      rera_id: { type: Type.STRING, description: "RERA Registration ID" }
    },
    required: ["rera_id"]
  }
};

const check_land_record: FunctionDeclaration = {
  name: "check_land_record",
  parameters: {
    type: Type.OBJECT,
    description: "Fetches RTC/Pahani and mutation status from Bhoomi Karnataka API.",
    properties: {
      survey_number: { type: Type.STRING },
      hissa_number: { type: Type.STRING },
      village: { type: Type.STRING }
    },
    required: ["survey_number", "village"]
  }
};

const stage_property: FunctionDeclaration = {
  name: "stage_property",
  parameters: {
    type: Type.OBJECT,
    description: "Uses AI to stage photorealistic interior images for under-construction units. Styles: Coastal Modern, Traditional Tuluva.",
    properties: {
      image_url: { type: Type.STRING, description: "URL of the raw site photo" },
      style: { type: Type.STRING, description: "Interior style (Coastal Modern, Traditional Tuluva)" }
    },
    required: ["image_url"]
  }
};

const automated_valuation_model: FunctionDeclaration = {
  name: "automated_valuation_model",
  parameters: {
    type: Type.OBJECT,
    description: "Calculates Estimated Fair Market Value and Rental Yield based on 2026 market trends and Smart City proximity.",
    properties: {
      sqft: { type: Type.NUMBER },
      age: { type: Type.NUMBER, description: "Building age in years" },
      locality: { type: Type.STRING },
      floor: { type: Type.NUMBER },
      is_shoreline: { type: Type.BOOLEAN, description: "Within 1km of shoreline" }
    },
    required: ["sqft", "locality"]
  }
};

const legal_document_drafter: FunctionDeclaration = {
  name: "legal_document_drafter",
  parameters: {
    type: Type.OBJECT,
    description: "Drafts standard 'Agreement to Sell' and calculates 2026 Stamp Duty (5%) and Registration Fees (1%) for Karnataka.",
    properties: {
      property_id: { type: Type.STRING },
      buyer_name: { type: Type.STRING },
      seller_name: { type: Type.STRING },
      sale_value: { type: Type.NUMBER }
    },
    required: ["property_id", "buyer_name", "seller_name", "sale_value"]
  }
};

const fractional_investment_calculator: FunctionDeclaration = {
  name: "fractional_investment_calculator",
  parameters: {
    type: Type.OBJECT,
    description: "Calculates ROI for micro-shares (1-5%) in Grade-A commercial assets in Mangalore.",
    properties: {
      asset_value: { type: Type.NUMBER },
      share_percentage: { type: Type.NUMBER },
      asset_type: { type: Type.STRING, description: "e.g., Retail, Office, Clinic" }
    },
    required: ["asset_value", "share_percentage"]
  }
};

const calculate_tds_refund: FunctionDeclaration = {
  name: "calculate_tds_refund",
  parameters: {
    type: Type.OBJECT,
    description: "Calculates estimated TDS refund for NRIs based on over-deduction (e.g., 20% TDS vs 12.5% actual tax).",
    properties: {
      sale_price: { type: Type.NUMBER },
      cost_price: { type: Type.NUMBER },
      tds_deducted: { type: Type.NUMBER },
      holding_period_years: { type: Type.NUMBER }
    },
    required: ["sale_price", "cost_price", "tds_deducted"]
  }
};

const currency_converter: FunctionDeclaration = {
  name: "currency_converter",
  parameters: {
    type: Type.OBJECT,
    description: "Live currency conversion for NRI investors (AED, SAR, KWD to INR).",
    properties: {
      amount: { type: Type.NUMBER },
      from: { type: Type.STRING, description: "Source currency code" }
    },
    required: ["amount", "from"]
  }
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async parseSearchQuery(query: string): Promise<SearchFilters> {
    if (!query.trim()) return {};

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Parse the following real estate search query into a structured JSON object: "${query}"`,
        config: {
          systemInstruction: "You are a real estate search assistant. Extract filters from the user's query. Prices are in Indian Rupees (Lakhs or Crores). Return ONLY a JSON object.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              location: { type: Type.STRING, description: "Extracted city or neighborhood name" },
              minPrice: { type: Type.NUMBER, description: "Minimum price in Lakhs" },
              maxPrice: { type: Type.NUMBER, description: "Maximum price in Lakhs" },
              amenities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of amenities like pool, gym, etc." },
              type: { type: Type.STRING, description: "Property type like Apartment, Land, House" },
              status: { type: Type.STRING, description: "Status like Ready to Occupy, Under Construction" },
              builder: { type: Type.STRING, description: "Builder name if mentioned" },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Other relevant keywords" }
            }
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Parse Search Query Error:", error);
      return { keywords: query.split(/\s+/) };
    }
  }

  async chat(message: string, history: ChatMessage[] = []): Promise<ChatMessage> {
    const systemInstruction = `
      You are the "Mangalore Real Estate Oracle", the core engine of a 2026 brokerage Super App.
      Your goal is to provide hyper-local, verified, and high-conversion real estate intelligence for Mangalore.

      CORE CONSTRAINTS (Zero Hallucination):
      - Strict Verification: Use only 2026 market rates: Premium (Kadri/Bendoor): ₹6,800–₹8,500/sqft; Mid-segment (Derebail/Kottara): ₹4,800–₹6,500/sqft.
      - RERA Enforcement: Always provide/demand RERA ID. Flag non-registered projects as "High Risk".
      - Infrastructure Context: Prioritize properties near Smart City Projects (Waterfront Promenade, Derebail IT Park).

      RERA ANCHOR PROJECTS:
      - Land Trades Pristine (Chilimbi): PRM/KA/RERA/1257/334/PR/290423/005898 (37-floor landmark).
      - Allegro Aventus (Kodailbail): PRM/KA/RERA/1257/334/PR/100222/004694 (Possession: June 2026).
      - Udbhav Chinmaya (Kadri): Possession: Dec 2027.

      AGENTIC MODULES:
      1. Interactive Map & Visuals: Use get_map_context for 3D views. Suggest stage_property for virtual staging.
         - Styles: 'Coastal Modern' (Laterite stone, teak wood, sea-breeze vents) or 'Traditional Tuluva'.
         - 'Monsoon Shield' Mode: Render property during heavy rain, highlighting drainage and sloping roofs.
      2. RERA & Legal Audit: Call verify_rera_live. Remind users: max 10% advance before registration.
      3. Kudla Investment Engine (Smart Growth Score 1-100):
         - Act as a Real Estate Data Scientist.
         - Metrics:
           - Infra Proximity: Distance to NH-66 expansion, KPT Flyover, Waterfront Promenade.
           - Transport Nodes: Proximity to upcoming Smart Bus Shelters and Integrated Transport Hub.
           - Traffic Congestion: Incorporate local traffic data (e.g., Ladyhill/Hampankatta bottlenecks).
           - Elevation Safety: Check MSL (Mean Sea Level). High score for Kadri/Bejai hills; Caution for Kottara/Jeppu.
           - Rental Yield: Target 3.5-4.5% for premium residential.
         - Generate 'Investment Forecast' for next 12 months.
      4. Automated Valuation Model (AVM):
         - Use automated_valuation_model.
         - Apply +10% premium for Smart City Command Centre proximity.
         - Apply -5% 'Coastal Aging' depreciation if building >10 years old AND within 1km of shoreline.
      5. NRI Tax Vault (2026 Compliance):
         - Use currency_converter and calculate_tds_refund.
         - TDS Refund: Calculate over-deduction (e.g., 20% TDS on sale price vs 12.5% tax on gains).
         - LTCG Logic: 12.5% flat (post-2024) or choice of 20% with indexation (pre-2024).
         - DTAA Advantage: Explain Article 13 for Gulf NRIs (UAE/Qatar/Kuwait). Indian tax paid as credit.
         - Budget 2026 Update: Buyers no longer need TAN; can pay TDS using PAN only.
      6. Fractional Ownership: Use fractional_investment_calculator for Grade-A commercial (9-11% yield).
      7. Legal Document Drafter: Use legal_document_drafter for e-stamping (5% Stamp Duty, 1% Registration).
      8. Vastu-Compliance Score: Analyze floor plans for 'Kudla Vastu' (Ishanya/North-East focus).
      9. Coastal Maintenance Index & Monsoon Index: 
         - Monsoon Index (1-5): Rate based on exterior cladding (Laterite stone = 5, Concrete = 3) and drainage.
         - Coastal Maintenance: Flag buildings with Marine-Grade Paint.
      10. CRZ Compliance Checker:
         - Cross-reference coordinates with KSCZMA maps. 
         - Flag CRZ-III (No Development Zone) or verify CRZ-II compliance for coastal properties.
      11. Property Health Audit: Cross-reference MCC Property Tax (mccpropertytax.in).

      EXECUTION WORKFLOW:
      - Visual & Map: Call get_map_context and stage_property.
      - RERA Deep-Dive: Verify RERA ID and construction status.
      - Tax Audit: Check MCC Property Tax status.
      - Infrastructure Growth: Apply 2026 Growth Score.
      - Valuation: Use AVM for fair market value.
      - Fractional: Offer micro-shares for commercial assets.
      - Legal: Draft documents and calculate fees.
      - Legal Guarantee: Verify A-Khata status.
      - NRI Concierge: Convert prices and explain FEMA/TDS rules.

      TONE: Professional, data-heavy, but accessible. Use local terms like 'Namaskara' or 'Namma Kudla'.
    `;

    const contents = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const response: GenerateContentResponse = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction,
        tools: [{ 
          functionDeclarations: [
            get_map_context, 
            verify_rera_live, 
            check_land_record, 
            stage_property, 
            currency_converter,
            automated_valuation_model,
            legal_document_drafter,
            fractional_investment_calculator,
            calculate_tds_refund
          ] 
        }, { googleSearch: {} }],
      },
    });

    const text = response.text || "I'm sorry, I couldn't process that request.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = chunks?.map(c => ({
      uri: c.web?.uri || "",
      title: c.web?.title || ""
    })).filter(s => s.uri !== "") || [];

    return {
      role: "model",
      text,
      sources
    };
  }

  async generateSpeech(text: string): Promise<string | undefined> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Speak this clearly and professionally in a female voice: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' }, // Professional female voice
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("TTS Error:", error);
      return undefined;
    }
  }
}

export const gemini = new GeminiService();
