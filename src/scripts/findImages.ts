import { GoogleGenAI } from "@google/genai";

async function findRealImages() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
    Find the official or most representative real image URLs for the following real estate projects in Mangalore. 
    Return a JSON object where the keys are the project names and the values are the image URLs.
    Projects:
    1. Altura by Land Trades
    2. Solitaire by Land Trades
    3. Rohan City by Rohan Corporation
    4. Inland Sunlight Moonlight
    5. Aarnava Heights Shakthinagar
    6. Pranaam Pearl Kadri
    7. Northern Sky City Pumpwell
    8. Prestige Valley Crest Bejai

    Ensure the URLs are direct image links (ending in .jpg, .png, etc.) and are publicly accessible.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
    },
  });

  console.log(response.text);
}

findRealImages();
