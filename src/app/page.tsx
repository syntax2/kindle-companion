"use client";

import { useState, useEffect } from 'react';
import { Sun, Moon, Bell, BellOff, Zap, RefreshCw } from 'lucide-react';

type NotificationStatus = 'default' | 'granted' | 'denied' | 'loading';

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [status, setStatus] = useState<NotificationStatus>('loading');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
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
        await navigator.serviceWorker.register('/sw.js');
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });
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

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/unsubscribe', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to unsubscribe on the server.');
      
      // This is the fix: We now manually update the state to show the subscribe button again.
      setStatus('default');

    } catch (error) {
      console.error('Failed to reset subscription:', error);
      alert('Could not reset subscription. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const StatusDisplay = () => {
    switch (status) {
      case 'granted':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-500">
              <Bell size={20} />
              <span>Notifications are enabled. Youre all set!</span>
            </div>
            <button
              onClick={handleReset}
              disabled={isResetting}
              className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 disabled:bg-gray-400"
            >
              <RefreshCw className={`mr-2 ${isResetting ? 'animate-spin' : ''}`} size={16} />
              {isResetting ? 'Resetting...' : 'Reset Subscription'}
            </button>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center justify-center space-x-2 text-red-500">
            <BellOff size={20} />
            <span>Notifications are blocked in browser settings.</span>
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