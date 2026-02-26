import React, { useEffect, useState } from 'react';
import { TrendingUp, MapPin, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  message: string;
  location: string | null;
  notification_type: string;
  created_at: string;
}

export function FOMOTicker() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    if (notifications.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('fomo_notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  if (!isVisible || notifications.length === 0) return null;

  const currentNotification = notifications[currentIndex];
  const timeAgo = getTimeAgo(currentNotification.created_at);

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div
        className={`bg-white rounded-xl shadow-2xl border-2 border-orange-200 overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'translate-y-2 opacity-50' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="relative">
              <TrendingUp className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="font-bold text-sm">LIVE ACTIVITY</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-2 mt-1">
              {currentNotification.notification_type === 'sale' ? (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : currentNotification.notification_type === 'viewing' ? (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              )}
            </div>

            <div className="flex-1">
              <p className="text-gray-800 font-medium text-sm leading-relaxed">
                {currentNotification.message}
              </p>
              {currentNotification.location && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{currentNotification.location}</span>
                </div>
              )}
              <div className="text-xs text-gray-400 mt-1">{timeAgo}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">
              Showing {currentIndex + 1} of {notifications.length}
            </span>
            <div className="flex gap-1">
              {notifications.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
