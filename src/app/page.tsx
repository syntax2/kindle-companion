
"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, BellOff, Zap } from 'lucide-react';

type NotificationStatus = 'default' | 'granted' | 'denied' | 'loading';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [status, setStatus] = useState<NotificationStatus>('loading');

  useEffect(() => {
    // Set theme
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    // Set initial notification status after component mounts
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setStatus(Notification.permission as NotificationStatus);
    }
  }, [isDarkMode]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      alert("Your browser doesn't support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission);

    if (permission === 'granted') {
      try {
        // Register the service worker
        await navigator.serviceWorker.register('/sw.js');
        // Get the service worker registration
        const registration = await navigator.serviceWorker.ready;
        // Get the push subscription
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
        // Send the subscription to our backend to save it
        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Service Worker Error:', error);
      }
    }
  };

  const StatusDisplay = () => {
    switch (status) {
      case 'granted':
        return (
          <div className="flex items-center justify-center space-x-2 text-green-500">
            <Bell size={20} />
            <span>Notifications are enabled. You're all set!</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <BellOff size={20} />
            <span>Notifications are blocked. Please enable them in your browser settings.</span>
          </div>
        );
      default:
        return (
          <button
            onClick={requestNotificationPermission}
            className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
          >
            <Zap className="mr-2" size={20} />
            Enable Reading Reminders
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="absolute top-6 right-6">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main className="bg-white dark:bg-gray-950/50 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Kindle Companion</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your personal AI agent to help you build a consistent reading habit.
          </p>
          <div className="mt-6">
            <StatusDisplay />
          </div>
        </main>
      </div>
    </div>
  );
}

