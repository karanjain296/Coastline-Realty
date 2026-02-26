import React, { useState } from 'react';
import { Download, X, TrendingUp, Building2, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function LeadMagnet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    budget: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('lead_captures')
        .insert([{
          name: formData.name,
          whatsapp: formData.whatsapp,
          budget: formData.budget,
          lead_magnet: 'Silicon Beach Investment Report 2026'
        }]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ name: '', whatsapp: '', budget: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white">
                <div className="h-full flex flex-col justify-center">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 w-fit">
                    EXCLUSIVE INVESTMENT INTELLIGENCE
                  </div>
                  <h2 className="text-4xl font-bold mb-6 leading-tight">
                    Silicon Beach Investment Report 2026
                  </h2>
                  <p className="text-xl text-white/90 mb-8">
                    Discover why savvy investors are targeting Mangalore's 3km Derebail IT Park radius
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg mt-1">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">11,000 New Jobs</div>
                        <div className="text-white/80">Tech professionals relocating to Mangalore</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg mt-1">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">15% Projected Growth</div>
                        <div className="text-white/80">Property values by June 2026</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-white/20 p-2 rounded-lg mt-1">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">40% Construction Complete</div>
                        <div className="text-white/80">Best time to invest is NOW</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 bg-white">
                <div className="h-full flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    Get Your Free Report
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Join 2,000+ investors who've downloaded this exclusive market analysis
                  </p>

                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-5 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg"
                  >
                    <Download className="w-6 h-6" />
                    Download Investment Report
                  </button>

                  <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No spam. Your data is 100% secure.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl transform transition-all">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {!isSuccess ? (
              <>
                <div className="text-center mb-6">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Almost There!
                  </h3>
                  <p className="text-gray-600">
                    Enter your details to receive the Silicon Beach Investment Report
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Investment Budget *
                    </label>
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select your budget</option>
                      <option value="20-40 Lakhs">₹20-40 Lakhs</option>
                      <option value="40-60 Lakhs">₹40-60 Lakhs</option>
                      <option value="60 Lakhs - 1 Crore">₹60 Lakhs - 1 Crore</option>
                      <option value="1-2 Crores">₹1-2 Crores</option>
                      <option value="2 Crores+">₹2 Crores+</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get Instant Access'}
                  </button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    By submitting, you agree to receive market updates via WhatsApp
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600">
                  Your report has been sent to your WhatsApp. Our investment consultant will contact you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
