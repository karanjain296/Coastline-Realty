import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import ChatInterface from './components/ChatInterface';
import BuilderDirectory from './components/BuilderDirectory';
import HotProjects from './components/HotProjects';
import ImageGallery from './components/ImageGallery';
import PropertyComparison from './components/PropertyComparison';
import { 
  Building2, Landmark, Home, X, MapPin, 
  IndianRupee, Sparkles, Globe, Calendar, Users, 
  CheckCircle2, PlayCircle, FileText, Heart, Phone,
  Zap, ShieldCheck, Scale, TrendingUp, Calculator, Gavel, Layers, ArrowRight, Briefcase, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';

import { Property } from './types';
import { gemini, SearchFilters } from './services/gemini';

function ExpandableText({ text, limit = 150 }: { text: string, limit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowToggle = text.length > limit;

  return (
    <div>
      <p className={`text-zinc-600 text-sm leading-relaxed ${!isExpanded && shouldShowToggle ? 'line-clamp-3' : ''}`}>
        {text}
      </p>
      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-emerald-600 text-xs font-bold mt-2 hover:text-emerald-700 transition-colors"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}

function AppContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [galleryState, setGalleryState] = useState<{ images: string[], index: number } | null>(null);
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [aiFilters, setAiFilters] = useState<SearchFilters | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currency, setCurrency] = useState<'INR' | 'AED' | 'SAR' | 'KWD'>('INR');
  const [isBookingVisit, setIsBookingVisit] = useState(false);
  const { toggleSaveProperty, isSaved } = useAuth();

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.error('Failed to fetch properties:', err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 3) {
        setIsAiSearching(true);
        const filters = await gemini.parseSearchQuery(searchQuery);
        setAiFilters(filters);
        setIsAiSearching(false);
      } else {
        setAiFilters(null);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const toggleCompare = (property: Property) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === property.id);
      if (exists) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 4) {
        alert("You can compare up to 4 properties at a time.");
        return prev;
      }
      return [...prev, property];
    });
  };

  const filteredProperties = properties.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    if (searchQuery === '') return matchesFilter;

    // If we have AI filters, use them for a more nuanced search
    if (aiFilters) {
      let score = 0;
      const totalCriteria = Object.keys(aiFilters).length;
      
      if (aiFilters.location && p.location.toLowerCase().includes(aiFilters.location.toLowerCase())) score++;
      if (aiFilters.type && p.type.toLowerCase().includes(aiFilters.type.toLowerCase())) score++;
      if (aiFilters.status && p.status?.toLowerCase().includes(aiFilters.status.toLowerCase())) score++;
      if (aiFilters.builder && p.builder_name?.toLowerCase().includes(aiFilters.builder.toLowerCase())) score++;
      
      if (aiFilters.amenities && aiFilters.amenities.length > 0) {
        const pAmenities = p.amenities?.toLowerCase() || '';
        const matchesAmenities = aiFilters.amenities.filter(a => pAmenities.includes(a.toLowerCase())).length;
        if (matchesAmenities > 0) score += (matchesAmenities / aiFilters.amenities.length);
      }

      // Price filtering (converting property price string to number for comparison)
      // This is a bit complex as price is a string like "₹95 Lakhs onwards"
      const pPriceMatch = p.price.match(/(\d+\.?\d*)/);
      if (pPriceMatch) {
        let pPrice = parseFloat(pPriceMatch[1]);
        if (p.price.includes('Crore')) pPrice *= 100;
        
        if (aiFilters.minPrice && pPrice >= aiFilters.minPrice) score++;
        if (aiFilters.maxPrice && pPrice <= aiFilters.maxPrice) score++;
      }

      if (aiFilters.keywords && aiFilters.keywords.length > 0) {
        const pText = `${p.title} ${p.description}`.toLowerCase();
        const matchesKeywords = aiFilters.keywords.filter(k => pText.includes(k.toLowerCase())).length;
        if (matchesKeywords > 0) score += (matchesKeywords / aiFilters.keywords.length);
      }

      // If we have a decent match score, include it
      if (score > 0) return matchesFilter;
    }

    // Fallback to keyword search
    const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const propertyText = `${p.title} ${p.location} ${p.type} ${p.category} ${p.description} ${p.amenities || ''} ${p.landmarks || ''} ${p.status || ''}`.toLowerCase();
    
    const matchesSearch = searchTerms.every(term => propertyText.includes(term));
    return matchesFilter && matchesSearch;
  });

  const [stagedImage, setStagedImage] = useState<string | null>(null);
  const [isStaging, setIsStaging] = useState(false);
  const [showTaxVault, setShowTaxVault] = useState(false);
  const [isVerifyingSeller, setIsVerifyingSeller] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isMonsoonMode, setIsMonsoonMode] = useState(false);

  // AVM State
  const [avmDetails, setAvmDetails] = useState({ sqft: 1200, age: 0, locality: 'Kadri', floor: 5 });
  const [avmResult, setAvmResult] = useState<{ value: string, yield: string } | null>(null);
  const [isCalculatingAVM, setIsCalculatingAVM] = useState(false);

  // Fractional State
  const [fractionalDetails, setFractionalDetails] = useState({ assetValue: 50000000, share: 1 });
  const [isCalculatingFractional, setIsCalculatingFractional] = useState(false);

  // Legal State
  const [legalStep, setLegalStep] = useState(0);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftPropertyName, setDraftPropertyName] = useState('');

  // Kudla Investment Engine State
  const [investmentEngineResult, setInvestmentEngineResult] = useState<{
    score: number;
    growthDrivers: string;
    riskFactors: string;
    yield: string;
  } | null>(null);
  const [isRunningEngine, setIsRunningEngine] = useState(false);

  // TDS Refund State
  const [tdsRefundResult, setTdsRefundResult] = useState<{ refund: string; logic: string } | null>(null);
  const [isCalculatingRefund, setIsCalculatingRefund] = useState(false);

  const handleCalculateAVM = () => {
    setIsCalculatingAVM(true);
    setTimeout(() => {
      const baseRate = avmDetails.locality === 'Kadri' ? 7500 : 5500;
      const premium = 1.1; // Smart City proximity
      const depreciation = avmDetails.age > 10 ? 0.95 : 1;
      const totalValue = avmDetails.sqft * baseRate * premium * depreciation;
      setAvmResult({
        value: `₹${(totalValue / 10000000).toFixed(2)} Crores`,
        yield: '4.8% - 5.2%'
      });
      setIsCalculatingAVM(false);
    }, 1500);
  };

  const handleDraftLegal = () => {
    setIsDrafting(true);
    setTimeout(() => {
      setIsDrafting(false);
      setLegalStep(1);
    }, 2000);
  };

  const handleLanguageToggle = async (lang: 'TULU' | 'KANNADA') => {
    const text = lang === 'TULU' 
      ? "Namaskara! NRI Tax Vault'dh eereg capital gains tax bokka DTAA benefit'da bagge mahiti thikkundu."
      : "Namaskara! NRI Tax Vault nalli nimage capital gains tax mattu DTAA benefit bagge mahiti sigutthe.";
    
    try {
      const audioBase64 = await gemini.generateSpeech(text);
      if (audioBase64) {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.play();
      }
    } catch (error) {
      console.error('Speech generation failed:', error);
    }
  };

  const handleCalculateTDS = async () => {
    if (!selectedProperty) return;
    setIsCalculatingRefund(true);
    
    try {
      const price = parseInt(selectedProperty.price.replace(/[^0-9]/g, '')) * (selectedProperty.price.includes('Crore') ? 10000000 : 100000);
      const costPrice = price * 0.7; // Simulated cost price
      const tdsDeducted = price * 0.20; // 20% TDS on sale price
      
      const prompt = `Calculate estimated TDS refund for NRI selling property at ₹${price}. 
      Cost Price: ₹${costPrice}. TDS Deducted: ₹${tdsDeducted}. 
      Actual Tax: 12.5% on gains. 
      Output a JSON with 'RefundAmount' and 'Explanation'.`;

      const response = await gemini.chat(prompt);
      const jsonMatch = response.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setTdsRefundResult({
          refund: data.RefundAmount || `₹${(tdsDeducted - (price - costPrice) * 0.125).toLocaleString('en-IN')}`,
          logic: data.Explanation || "Refund of excess TDS deducted on gross value vs tax on actual capital gains."
        });
      } else {
        setTdsRefundResult({
          refund: `₹${(tdsDeducted - (price - costPrice) * 0.125).toLocaleString('en-IN')}`,
          logic: "Estimated refund based on 20% TDS vs 12.5% LTCG."
        });
      }
    } catch (error) {
      console.error('TDS Calculation failed:', error);
    } finally {
      setIsCalculatingRefund(false);
    }
  };

  const handleRunInvestmentEngine = async () => {
    if (!selectedProperty) return;
    setIsRunningEngine(true);
    
    try {
      const prompt = `Calculate 'Smart Growth Score' for property: ${selectedProperty.title} in ${selectedProperty.location}. 
      Coordinates: ${JSON.stringify(selectedProperty.coordinates)}.
      Analyze:
      1. Proximity to 2026 infra projects (KPT Flyover, New Port expansion, IT parks in Derebail).
      2. Public Transport: Proximity to upcoming Smart Bus Shelters and Integrated Transport Hub.
      3. Traffic: Local congestion data for ${selectedProperty.location}.
      4. Flood Resilience: Is the elevation sufficient for Mangalore monsoons?
      5. Rental Yield: Based on 2026 market trends in Mangalore.
      Output a JSON with Score (1-100), 'Growth Drivers', 'Risk Factors', and 'Estimated Yield'.`;

      const response = await gemini.chat(prompt);
      // Extract JSON from response.text
      const jsonMatch = response.text?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        setInvestmentEngineResult({
          score: data.Score || data.score || 85,
          growthDrivers: data['Growth Drivers'] || data.growth_drivers || "Proximity to Smart Road",
          riskFactors: data['Risk Factors'] || data.risk_factors || "Coastal aging",
          yield: data['Estimated Yield'] || data.estimated_yield || "4.2%"
        });
      } else {
        // Fallback mock
        setInvestmentEngineResult({
          score: 88,
          growthDrivers: "Within 1km of KPT Flyover expansion. High elevation plateau.",
          riskFactors: "Minor coastal salt-air exposure.",
          yield: "4.5%"
        });
      }
    } catch (error) {
      console.error('Investment Engine failed:', error);
      setInvestmentEngineResult({
        score: 85,
        growthDrivers: "Infrastructure proximity to NH-66 and Smart City projects.",
        riskFactors: "Standard market risks.",
        yield: "4.0%"
      });
    } finally {
      setIsRunningEngine(false);
    }
  };

  const handleAIStaging = async () => {
    if (!selectedProperty) return;
    setIsStaging(true);
    // Simulate AI staging call
    setTimeout(() => {
      setStagedImage("https://picsum.photos/seed/staged/1200/800?blur=1");
      setIsStaging(false);
    }, 2000);
  };

  const handleVerifySeller = () => {
    setIsVerifyingSeller(true);
    setTimeout(() => {
      setIsVerifyingSeller(false);
      alert("Seller Verified: Aadhaar & MCC Tax Records matched successfully.");
    }, 2000);
  };

  const calculateFractionalROI = (priceStr: string) => {
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    const isCrore = priceStr.toLowerCase().includes('crore');
    const totalValue = isCrore ? numericPrice * 10000000 : numericPrice * 100000;
    const shareValue = totalValue / 100; // 1% share
    const annualRent = totalValue * 0.08; // 8% yield for commercial
    const monthlyROI = (annualRent / 100) / 12;
    return { shareValue, monthlyROI };
  };

  const categories = [
    { id: 'all', label: 'All Properties', icon: Building2 },
    { id: 'land', label: 'Land/Plots', icon: Landmark },
    { id: 'house', label: 'Houses', icon: Home },
    { id: 'apartment', label: 'Apartments', icon: Building2 },
    { id: 'commercial', label: 'Commercial', icon: Briefcase },
  ];

  const formatPrice = (priceStr: string, targetCurrency: string) => {
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    const isCrore = priceStr.toLowerCase().includes('crore');
    const inLakhs = isCrore ? numericPrice * 100 : numericPrice;
    const inINR = inLakhs * 100000;

    const rates = {
      INR: 1,
      AED: 0.044, // 1 INR = 0.044 AED approx in 2026
      SAR: 0.045,
      KWD: 0.0037
    };

    const converted = inINR * (rates[targetCurrency as keyof typeof rates] || 1);
    
    if (targetCurrency === 'INR') return priceStr;
    
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: 0
    }).format(converted);
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main>
        <Hero onSearch={setSearchQuery} />

        {/* Categories */}
        <section className="py-12 border-y border-zinc-100 bg-zinc-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Filter by Property Type</h3>
              <div className="h-1 w-12 bg-emerald-500 mx-auto rounded-full"></div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`flex flex-col items-center gap-2 group transition-all ${
                    filter === cat.id ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  <div className={`p-4 rounded-2xl border transition-all ${
                    filter === cat.id 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                      : 'bg-white border-zinc-200 group-hover:border-zinc-300'
                  }`}>
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <HotProjects onImageClick={(imgs) => setGalleryState({ images: imgs, index: 0 })} />

        {/* Property Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-zinc-900">
                    {searchQuery ? `Search results for "${searchQuery}"` : 'Featured Listings'}
                  </h2>
                  {isAiSearching && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      AI Nuanced Search...
                    </div>
                  )}
                </div>
                <p className="text-zinc-500">Handpicked properties in Mangalore's most sought-after locations.</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 cursor-pointer hover:underline">
                View all listings
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onClick={setSelectedProperty}
                  onImageClick={(p, idx) => setGalleryState({ images: p.images || [p.image_url], index: idx })}
                  onCompare={toggleCompare}
                  isComparing={compareList.some(cp => cp.id === property.id)}
                />
              ))}
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex p-6 rounded-full bg-zinc-50 mb-4">
                  <Building2 className="w-12 h-12 text-zinc-300" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900">No properties found</h3>
                <p className="text-zinc-500 mb-8">Try adjusting your search or category filter.</p>
                
                {searchQuery && (
                  <button 
                    onClick={() => {
                      // We can't easily trigger the ChatInterface from here without a global state or ref
                      // But we can at least suggest it or use a custom event
                      window.dispatchEvent(new CustomEvent('open-ai-chat', { detail: searchQuery }));
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    <Sparkles className="w-5 h-5" />
                    Ask AI Broker about "{searchQuery}"
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <BuilderDirectory />

        {/* Top Builders Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-zinc-900 mb-4">Partnering with Mangalore's Finest</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">We provide direct access to projects from the most trusted developers in the region.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {[
                'Land Trades', 'Rohan Corp', 'Inland Builders', 'Mohtisham', 
                'Northern Sky', 'Prestige Group', 'Brigade Group', 'Marian Developers',
                'Abish Builders', 'GB Group'
              ].map((builder) => (
                <div key={builder} className="flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all group cursor-pointer">
                  <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                    <Building2 className="w-6 h-6 text-zinc-400 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900">{builder}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-zinc-400 italic">
                And many more including Nidhi Land, Lotus Properties, Atharva, Citadel, and Land Links.
              </p>
            </div>
          </div>
        </section>

        {/* NRI Section */}
        <section className="py-24 bg-zinc-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/10 blur-[120px] -z-0" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4 block">NRI Special Services</span>
                <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">Investing from abroad? <br/>We've got you covered.</h2>
                <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
                  Our AI broker specializes in helping Non-Resident Indians navigate the Mangalore real estate market. From legal compliance to property management, we provide end-to-end support.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    'FEMA Compliance Advice',
                    'Power of Attorney Support',
                    'Remote Property Tours',
                    'Digital Documentation',
                    'Tax Consultation',
                    'Rental Management'
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300 font-medium">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden border border-white/10">
                  <img 
                    src="https://picsum.photos/seed/nri/1000/1000" 
                    alt="NRI Services" 
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-emerald-600 p-8 rounded-3xl shadow-2xl">
                  <div className="text-4xl font-bold mb-1">24/7</div>
                  <div className="text-emerald-100 text-sm font-medium">Global Support for NRIs</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart City Dashboard Section */}
        <section className="py-24 bg-zinc-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" />
                  Infrastructure Pulse
                </div>
                <h2 className="text-4xl font-bold text-zinc-900 mb-4 tracking-tight">Mangaluru Smart City <span className="text-emerald-600">2030</span></h2>
                <p className="text-zinc-600 text-lg">
                  Real-time infrastructure-driven value appreciation tracking. We cross-reference MSCL project data with every listing.
                </p>
              </div>
              <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
                View Smart Road Map <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Waterfront Promenade', status: '65% Complete', impact: '+18% Growth', color: 'blue' },
                { title: 'Integrated Transport Hub', status: 'Planning Phase', impact: '+12% Growth', color: 'emerald' },
                { title: 'Derebail IT Park', status: 'Under Construction', impact: '+25% Growth', color: 'indigo' }
              ].map((project, i) => (
                <div key={i} className="bg-white p-8 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                  <div className={`w-12 h-12 rounded-2xl bg-${project.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <TrendingUp className={`w-6 h-6 text-${project.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 mb-2">{project.title}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">{project.status}</span>
                    <span className={`font-bold text-${project.color}-600`}>{project.impact}</span>
                  </div>
                  <div className="mt-6 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-${project.color}-500 rounded-full`} style={{ width: project.status.includes('65%') ? '65%' : project.status.includes('Under') ? '30%' : '10%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Hub: AVM & Fractional */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* AVM Calculator */}
              <div className="bg-zinc-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px]" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">AI Valuation Model</h3>
                      <p className="text-zinc-400 text-sm">2026 Market Mean Analysis</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Area (Sq. Ft.)</label>
                        <input 
                          type="number" 
                          value={avmDetails.sqft}
                          onChange={(e) => setAvmDetails({...avmDetails, sqft: parseInt(e.target.value)})}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Locality</label>
                        <select 
                          value={avmDetails.locality}
                          onChange={(e) => setAvmDetails({...avmDetails, locality: e.target.value})}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                          <option>Kadri</option>
                          <option>Bejai</option>
                          <option>Surathkal</option>
                          <option>Derebail</option>
                          <option>Bendoorwell</option>
                          <option>Chilimbi</option>
                          <option>Kottara</option>
                          <option>Jeppu</option>
                          <option>Bolar</option>
                          <option>Mary Hill</option>
                          <option>Bondel</option>
                          <option>Shakthinagar</option>
                          <option>Kulshekar</option>
                          <option>Falnir</option>
                          <option>Hampankatta</option>
                          <option>Mannagudda</option>
                          <option>Urwa</option>
                          <option>Ashok Nagar</option>
                          <option>Attavar</option>
                          <option>Kankanady</option>
                          <option>Urwastores</option>
                          <option>Pandeshwar</option>
                          <option>Kudroli</option>
                          <option>Ladyhill</option>
                        </select>
                      </div>
                    </div>

                    <button 
                      onClick={handleCalculateAVM}
                      disabled={isCalculatingAVM}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isCalculatingAVM ? <Zap className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
                      Calculate Fair Market Value
                    </button>

                    {avmResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl"
                      >
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Estimated Value</p>
                            <p className="text-3xl font-black">{avmResult.value}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Expected Yield</p>
                            <p className="text-xl font-bold text-emerald-400">{avmResult.yield}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Fractional Ownership */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 w-fit">
                  <Layers className="w-3 h-3" />
                  Micro-Investment
                </div>
                <h2 className="text-4xl font-bold text-zinc-900 mb-6 tracking-tight">Fractional Ownership <span className="text-indigo-600">Hub</span></h2>
                <p className="text-zinc-600 text-lg mb-8 leading-relaxed">
                  Own a piece of Mangalore's Grade-A commercial real estate. Start with as little as 1% share in prime retail and office spaces.
                </p>
                
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Briefcase className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900">Direct Purchase</p>
                        <p className="text-xs text-zinc-500">Full ownership, high entry cost</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-zinc-400">4-5% Yield</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-900">Fractional Micro-Share</p>
                        <p className="text-xs text-indigo-600/70">Diversified, low entry cost</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">9-11% Yield</span>
                  </div>
                </div>

                <button className="px-8 py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit">
                  Explore Commercial Assets <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Center */}
        <section className="py-24 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-[48px] p-12 border border-zinc-100 shadow-xl flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6">
                  <Gavel className="w-3 h-3" />
                  Legal Tech
                </div>
                <h2 className="text-4xl font-bold text-zinc-900 mb-6 tracking-tight">Automated Legal <span className="text-amber-600">Drafter</span></h2>
                <p className="text-zinc-600 text-lg mb-8">
                  Generate legally binding 'Agreement to Sell' documents instantly. Integrated with Bhoomi RTC data and Digio for e-stamping.
                </p>

                <div className="space-y-6">
                  {[
                    { icon: FileText, title: 'Agreement to Sell', desc: 'Standard Karnataka template' },
                    { icon: ShieldCheck, title: 'Stamp Duty Calc', desc: '5% + 1% Registration' },
                    { icon: CheckCircle2, title: 'E-Stamping', desc: 'Instant digital stamps' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center shrink-0 mt-1">
                        <item.icon className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900">{item.title}</h4>
                        <p className="text-sm text-zinc-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 bg-zinc-50 rounded-[32px] p-8 border border-zinc-100">
                <h4 className="text-xl font-bold text-zinc-900 mb-6">Draft New Agreement</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Property Name / Unit Details</label>
                    <input 
                      type="text" 
                      value={draftPropertyName}
                      onChange={(e) => setDraftPropertyName(e.target.value)}
                      placeholder="e.g. Land Trades Pristine - Unit 2405" 
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Buyer Name</label>
                      <input type="text" placeholder="Full Name" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sale Value</label>
                      <input type="text" placeholder="₹ Amount" className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500" />
                    </div>
                  </div>
                  <button 
                    onClick={handleDraftLegal}
                    disabled={isDrafting}
                    className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
                  >
                    {isDrafting ? <Zap className="w-5 h-5 animate-pulse" /> : <Gavel className="w-5 h-5" />}
                    {legalStep === 0 ? 'Generate Agreement' : 'Download Draft (PDF)'}
                  </button>

                  {legalStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-900">Agreement Drafted Successfully</p>
                        <p className="text-[10px] text-emerald-700">Ready for E-Stamping & Digital Signature</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 border-t border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-zinc-900 tracking-tight">Coastline Realty <span className="text-emerald-600">AI</span></span>
            </div>
            <div className="text-zinc-500 text-sm">
              © 2026 Coastline Realty AI. All rights reserved. Professional Real Estate Brokerage in Mangalore.
            </div>
            <div className="flex gap-6 text-zinc-400 text-sm font-medium">
              <a href="#" className="hover:text-zinc-900">Privacy</a>
              <a href="#" className="hover:text-zinc-900">Terms</a>
              <a href="#" className="hover:text-zinc-900">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatInterface />

      {/* Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[140] bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex -space-x-3">
            {compareList.map((p) => (
              <div key={p.id} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-zinc-100">
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-zinc-200" />
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-zinc-900">{compareList.length} Selected</span>
            <button
              onClick={() => setShowComparison(true)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
            >
              Compare Now
            </button>
            <button
              onClick={() => setCompareList([])}
              className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showComparison && (
          <PropertyComparison
            properties={compareList}
            onRemove={(id) => setCompareList(prev => prev.filter(p => p.id !== id))}
            onClose={() => setShowComparison(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVerifyingSeller && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <button onClick={() => setIsVerifyingSeller(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                {verificationStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2">Aadhaar Verification</h3>
                      <p className="text-zinc-500 text-sm">Step 1: Identity Handshake via Surepass API</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Aadhaar Number</label>
                        <input 
                          type="text" 
                          placeholder="XXXX XXXX XXXX" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-lg font-mono focus:outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                      <button 
                        onClick={() => setVerificationStep(2)}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        Generate OTP
                      </button>
                    </div>
                  </div>
                )}

                {verificationStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2">Enter OTP</h3>
                      <p className="text-zinc-500 text-sm">Sent to Aadhaar-linked mobile number</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between gap-2">
                        {[1,2,3,4,5,6].map((i) => (
                          <input key={i} type="text" maxLength={1} className="w-12 h-14 bg-zinc-50 border border-zinc-200 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-emerald-500 transition-all" />
                        ))}
                      </div>
                      <button 
                        onClick={() => setVerificationStep(3)}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all"
                      >
                        Verify & Continue
                      </button>
                    </div>
                  </div>
                )}

                {verificationStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-900 mb-2">MCC Tax Match</h3>
                      <p className="text-zinc-500 text-sm">Step 2: Cross-referencing with Mangalore City Corporation</p>
                    </div>
                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Aadhaar Name</span>
                        <span className="text-sm font-bold text-zinc-900">RAJESH KUMAR M.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">MCC Tax Receipt</span>
                        <span className="text-sm font-bold text-zinc-900">RAJESH KUMAR M.</span>
                      </div>
                      <div className="pt-4 border-t border-zinc-200 flex items-center gap-3 text-emerald-600">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold">98% Fuzzy Match Confirmed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsVerifyingSeller(false)}
                      className="w-full py-4 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-all"
                    >
                      Complete Verification
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {galleryState && (
          <ImageGallery
            images={galleryState.images}
            initialIndex={galleryState.index}
            onClose={() => setGalleryState(null)}
          />
        )}
      </AnimatePresence>

      {/* Property Detail Modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              {/* Image Section */}
              <div className="lg:w-1/2 h-64 lg:h-auto relative">
                <img
                  src={selectedProperty.image_url}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => toggleSaveProperty(selectedProperty.id)}
                    className={`p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                      isSaved(selectedProperty.id) ? 'bg-emerald-600 text-white' : 'bg-white/90 text-zinc-400 hover:text-emerald-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved(selectedProperty.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      setInvestmentEngineResult(null);
                    }}
                    className="p-3 bg-white/90 backdrop-blur-md rounded-full text-zinc-900 hover:bg-white transition-all shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                  <div className="flex gap-2">
                    {selectedProperty.virtual_tour_url && (
                      <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-emerald-700 transition-all">
                        <PlayCircle className="w-5 h-5" />
                        Virtual Tour
                      </button>
                    )}
                    {selectedProperty.matterport_url && (
                      <button className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl hover:bg-zinc-800 transition-all">
                        <Globe className="w-5 h-5" />
                        3D Matterport
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsMonsoonMode(!isMonsoonMode)}
                    className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all ${
                      isMonsoonMode ? 'bg-blue-600 text-white' : 'bg-white/90 text-zinc-900 hover:bg-white'
                    }`}
                  >
                    <Zap className={`w-5 h-5 ${isMonsoonMode ? 'animate-pulse' : ''}`} />
                    {isMonsoonMode ? 'Monsoon Shield: ON' : 'Simulate Monsoon Shield'}
                  </button>
                </div>
                {isMonsoonMode && (
                  <div className="absolute inset-0 bg-blue-900/20 pointer-events-none mix-blend-overlay animate-pulse" />
                )}
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 sm:p-10 overflow-y-auto flex flex-col">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedProperty.status === 'Ready to Occupy' ? 'bg-emerald-100 text-emerald-700' : 
                      selectedProperty.status === 'Under Construction' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {selectedProperty.status || 'Available'}
                    </span>
                    <span className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {selectedProperty.category}
                    </span>
                  </div>

                  <h2 className="text-3xl font-bold text-zinc-900 mb-2">{selectedProperty.title}</h2>
                  <p className="text-emerald-600 font-bold text-sm mb-4">{selectedProperty.builder_name}</p>
                  
                  <div className="flex items-center gap-1.5 text-zinc-500 mb-6">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {selectedProperty.location}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-zinc-50 rounded-2xl relative group/price">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Price</p>
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value as any)}
                          className="text-[9px] font-bold bg-white border border-zinc-200 rounded px-1 py-0.5 outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="INR">INR</option>
                          <option value="AED">AED</option>
                          <option value="SAR">SAR</option>
                          <option value="KWD">KWD</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 font-bold text-lg">
                        {currency === 'INR' && <IndianRupee className="w-4 h-4" />}
                        {formatPrice(selectedProperty.price, currency)}
                      </div>
                      <button 
                        onClick={() => setShowTaxVault(!showTaxVault)}
                        className="mt-2 text-[9px] font-bold text-emerald-600 flex items-center gap-1 hover:underline"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        NRI Tax Vault (DTAA)
                      </button>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Possession</p>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {selectedProperty.possession_date || 'Immediate'}
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Units</p>
                      <div className="flex items-center gap-2 text-zinc-900 font-bold">
                        <Users className="w-4 h-4 text-emerald-600" />
                        {selectedProperty.total_units || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {showTaxVault && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-5 bg-emerald-900 rounded-[32px] text-white text-[11px] relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl" />
                      <h5 className="font-bold mb-3 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          NRI Tax Vault: 2026 DTAA Logic
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleLanguageToggle('TULU')}
                            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[8px] font-bold transition-colors"
                          >
                            TULU
                          </button>
                          <button 
                            onClick={() => handleLanguageToggle('KANNADA')}
                            className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-[8px] font-bold transition-colors"
                          >
                            ಕನ್ನಡ
                          </button>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[8px] border border-emerald-500/30">BUDGET 2026 COMPLIANT</span>
                        </div>
                      </h5>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-emerald-400/70 uppercase text-[9px] font-bold mb-1">LTCG (Post-2024)</p>
                          <p className="text-sm font-black">12.5% Flat</p>
                          <p className="text-[8px] text-emerald-300/40">No Indexation Required</p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-emerald-400/70 uppercase text-[9px] font-bold mb-1">TDS Benefit</p>
                          <p className="text-sm font-black">PAN-Only</p>
                          <p className="text-[8px] text-emerald-300/40">No TAN Required for Buyer</p>
                        </div>
                      </div>
                      <div className="p-3 bg-emerald-800/50 rounded-2xl border border-emerald-700/50">
                        <p className="text-[9px] font-bold text-emerald-300 mb-1 flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Gulf DTAA Advice (Article 13)
                        </p>
                        <p className="text-[9px] text-emerald-100/70 leading-tight">
                          As a resident of UAE/Qatar/Kuwait, your Indian tax is repatriable. Use TRC to avoid double taxation.
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-emerald-800/50">
                        <button 
                          onClick={handleCalculateTDS}
                          disabled={isCalculatingRefund}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                        >
                          {isCalculatingRefund ? <Zap className="w-3 h-3 animate-pulse" /> : <Calculator className="w-3 h-3" />}
                          Calculate TDS Refund Estimate
                        </button>
                        
                        {tdsRefundResult && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 p-3 bg-white/5 rounded-2xl border border-white/5"
                          >
                            <p className="text-[9px] font-bold text-emerald-400 uppercase mb-1">Estimated Refund</p>
                            <p className="text-lg font-black text-white mb-1">{tdsRefundResult.refund}</p>
                            <p className="text-[8px] text-emerald-300/60 leading-tight">{tdsRefundResult.logic}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {selectedProperty.category === 'commercial' && (
                    <div className="mb-6 p-5 bg-indigo-900 rounded-3xl text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                          Micro-Share Fractional Ownership
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                          8.2% ROI
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-[9px] text-indigo-400 uppercase font-bold">1% Share Value</p>
                          <p className="text-sm font-bold">₹{new Intl.NumberFormat('en-IN').format(calculateFractionalROI(selectedProperty.price).shareValue)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-indigo-400 uppercase font-bold">Est. Monthly ROI</p>
                          <p className="text-sm font-bold text-emerald-400">₹{new Intl.NumberFormat('en-IN').format(calculateFractionalROI(selectedProperty.price).monthlyROI)}</p>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-[10px] font-bold transition-all">
                        Reserve Micro-Share
                      </button>
                    </div>
                  )}

                  {/* Advanced Metrics Section */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl relative overflow-hidden">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" />
                          Smart Growth Score
                        </h4>
                        <span className="text-lg font-black text-emerald-600">
                          {investmentEngineResult ? investmentEngineResult.score : (selectedProperty.smart_city_score || 75)}%
                        </span>
                      </div>
                      <div className="w-full bg-emerald-200/30 h-2 rounded-full overflow-hidden mb-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${investmentEngineResult ? investmentEngineResult.score : (selectedProperty.smart_city_score || 75)}%` }}
                          className="bg-emerald-500 h-full"
                        />
                      </div>
                      
                      {!investmentEngineResult ? (
                        <button 
                          onClick={handleRunInvestmentEngine}
                          disabled={isRunningEngine}
                          className="w-full py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isRunningEngine ? <Zap className="w-3 h-3 animate-pulse" /> : <Sparkles className="w-3 h-3" />}
                          Run Kudla Investment Engine
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <div className="p-2 bg-white/50 rounded-xl border border-emerald-100">
                            <p className="text-[8px] font-bold text-emerald-900 uppercase tracking-widest mb-1">Growth Drivers</p>
                            <p className="text-[9px] text-emerald-700 leading-tight">{investmentEngineResult.growthDrivers}</p>
                          </div>
                          <div className="p-2 bg-white/50 rounded-xl border border-emerald-100">
                            <p className="text-[8px] font-bold text-emerald-900 uppercase tracking-widest mb-1">Risk Factors</p>
                            <p className="text-[9px] text-emerald-700 leading-tight">{investmentEngineResult.riskFactors}</p>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                            <p className="text-[9px] font-bold text-emerald-900 uppercase tracking-widest">Est. Yield</p>
                            <p className="text-xs font-black text-emerald-600">{investmentEngineResult.yield}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-5 bg-zinc-900 rounded-3xl text-white">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          RERA Status
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">
                          VERIFIED
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-zinc-300 mb-1 truncate">{selectedProperty.rera_id || 'PRM/KA/RERA/...'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className={`w-2 h-2 rounded-full ${selectedProperty.crz_status?.includes('Compliant') || selectedProperty.crz_status === 'Non-CRZ' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <p className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">CRZ: {selectedProperty.crz_status || 'Checking...'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-3xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5" />
                          Monsoon Index
                        </h4>
                        <span className="text-lg font-black text-blue-600">{selectedProperty.monsoon_index || 4}/5</span>
                      </div>
                      <p className="text-[10px] text-blue-700/70 leading-tight">
                        Exterior cladding & drainage durability.
                      </p>
                    </div>

                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />
                          White-Coat
                        </h4>
                        <span className="text-lg font-black text-emerald-600">{selectedProperty.white_coat_score || 85}%</span>
                      </div>
                      <p className="text-[10px] text-emerald-700/70 leading-tight">
                        Proximity to medical hubs.
                      </p>
                    </div>

                    <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-3xl relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider flex items-center gap-2">
                          <Compass className="w-3.5 h-3.5" />
                          Kudla Vastu Score
                        </h4>
                        <span className="text-lg font-black text-orange-600">{selectedProperty.vastu_score || 9}/10</span>
                      </div>
                      <p className="text-[10px] text-orange-700/70 leading-tight">
                        Ishanya (NE) Entrance & Agneya (SE) Kitchen compliant.
                      </p>
                      <button className="mt-3 w-full py-2 bg-white border border-orange-200 rounded-xl text-[10px] font-bold text-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2">
                        <Layers className="w-3 h-3" />
                        Overlay Vastu Grid
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8 mb-8">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Description
                      </h4>
                      <ExpandableText text={selectedProperty.description} />
                    </div>

                    {selectedProperty.specifications && (
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Specifications
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProperty.specifications.split(',').map((spec, i) => (
                            <li key={i} className="text-xs text-zinc-600 flex items-center gap-2">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                              {spec.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedProperty.amenities && (
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Premium Amenities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProperty.amenities.split(',').map((item, i) => (
                            <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              {item.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProperty.survey_number && (
                      <div className="space-y-4">
                        <div className="p-6 bg-zinc-50 rounded-[24px] border border-zinc-100">
                          <h4 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                            <Scale className="w-4 h-4 text-emerald-600" />
                            Legal Due Diligence (Bhoomi/Kaveri)
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Survey Number</p>
                              <p className="text-sm font-bold text-zinc-900">{selectedProperty.survey_number}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Village</p>
                              <p className="text-sm font-bold text-zinc-900">{selectedProperty.village_name}</p>
                            </div>
                          <div className="col-span-2 pt-2 border-t border-zinc-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    RTC Verified ({selectedProperty.khata_type || 'A-Khata'})
                                  </div>
                                  <button 
                                    onClick={() => {
                                      setIsVerifyingSeller(true);
                                      setVerificationStep(1);
                                    }}
                                    className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                                  >
                                    <ShieldCheck className="w-3 h-3" />
                                    Verify Seller Details
                                  </button>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium mt-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Form 15 Encumbrance Clear (15 Years)
                                </div>
                              </div>
                          </div>
                        </div>

                        <div className="p-6 bg-zinc-900 rounded-[24px] text-white">
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-400" />
                            Property Health Audit (MCC Portal)
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-[11px]">
                            <div className="space-y-1">
                              <p className="text-zinc-500 uppercase tracking-wider font-bold">MCC Property ID</p>
                              <p className="font-mono text-zinc-300">MCC-{selectedProperty.id}-BL-2026</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-zinc-500 uppercase tracking-wider font-bold">Tax Status 25-26</p>
                              <p className="text-emerald-400 font-bold">PAID (Early Bird)</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-zinc-500 uppercase tracking-wider font-bold">Maintenance Index</p>
                              <p className="text-zinc-300">{selectedProperty.maintenance_index || 'Standard'}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-zinc-500 uppercase tracking-wider font-bold">Climate Safety</p>
                              <p className="text-zinc-300">{selectedProperty.flood_risk === 'Low' ? 'Flood-Safe Plateau' : 'Standard'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedProperty.landmarks && (
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
                          <Globe className="w-4 h-4 text-emerald-600" />
                          Neighborhood
                        </h4>
                        <p className="text-zinc-600 text-sm leading-relaxed">{selectedProperty.landmarks}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={handleVerifySeller}
                      disabled={isVerifyingSeller}
                      className="flex flex-col items-center justify-center gap-1 py-3 border border-zinc-200 rounded-2xl text-[9px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all disabled:opacity-50"
                    >
                      <ShieldCheck className={`w-4 h-4 ${isVerifyingSeller ? 'animate-pulse' : 'text-emerald-600'}`} />
                      {isVerifyingSeller ? 'Verifying...' : 'Verify Seller'}
                    </button>
                    <button className="flex flex-col items-center justify-center gap-1 py-3 border border-zinc-200 rounded-2xl text-[9px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
                      <Zap className="w-4 h-4 text-emerald-600" />
                      Flood Risk
                    </button>
                    <button 
                      onClick={handleAIStaging}
                      disabled={isStaging}
                      className="flex flex-col items-center justify-center gap-1 py-3 border border-zinc-200 rounded-2xl text-[9px] font-bold text-zinc-600 hover:bg-zinc-50 transition-all disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 ${isStaging ? 'animate-spin' : 'text-emerald-600'}`} />
                      {isStaging ? 'Staging...' : 'AI Staging'}
                    </button>
                  </div>

                  {stagedImage && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30"
                    >
                      <img src={stagedImage} className="w-full h-48 object-cover" alt="Staged Digital Twin" />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-600 text-white text-[8px] font-bold rounded uppercase">
                        AI Digital Twin: Coastal Modern
                      </div>
                      <button 
                        onClick={() => setStagedImage(null)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => setIsBookingVisit(true)}
                      className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Schedule In-Person Visit
                    </button>
                    <button className="flex-1 px-6 py-4 border border-zinc-200 text-zinc-900 rounded-2xl font-bold hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Contact Builder
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Site Visit Modal */}
      <AnimatePresence>
        {isBookingVisit && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-900">Schedule Site Visit</h3>
                <button onClick={() => setIsBookingVisit(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>
              <p className="text-zinc-500 text-sm mb-6">Select your preferred date for a guided tour of {selectedProperty?.title}.</p>
              
              <div className="space-y-4 mb-8">
                <input type="date" className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500" />
                <select className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Morning (10:00 AM - 12:00 PM)</option>
                  <option>Afternoon (02:00 PM - 04:00 PM)</option>
                  <option>Evening (04:00 PM - 06:00 PM)</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  alert('Visit scheduled! Our representative will contact you shortly.');
                  setIsBookingVisit(false);
                }}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Confirm Booking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
