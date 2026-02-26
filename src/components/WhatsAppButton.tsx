import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '919876543210';
  const message = encodeURIComponent('Hi, I\'m interested in investing in Mangalore real estate. Can you help me?');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 group"
    >
      <div className="relative">
        {isHovered && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg whitespace-nowrap shadow-xl animate-fade-in">
            <div className="font-bold text-sm">Speak to an Expert</div>
            <div className="text-xs text-gray-300">Get instant WhatsApp support</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div className="border-8 border-transparent border-l-gray-900" />
            </div>
          </div>
        )}

        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-2xl transition-all transform hover:scale-110 flex items-center gap-3 pr-5">
          <MessageCircle className="w-7 h-7" />
          <span className="font-bold text-lg">Chat Now</span>
        </div>

        <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white" />
      </div>
    </a>
  );
}
