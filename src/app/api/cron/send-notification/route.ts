import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { promises as fs } from 'fs';
import path from 'path';
export const runtime = 'nodejs';
import { myQuotes } from '@/lib/qoutes';
// This is the single source of truth for our subscription file path.
const subscriptionFilePath = path.join('/tmp', 'subscription.json');



// Configure web-push with your VAPID keys from the .env.local file
webpush.setVapidDetails(
  'mailto:ashishkadian239@gmail.com', // Replace with your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

async function getMotivationalQuote(): Promise<string> {
  // --- Feature Flag Logic ---
  if (process.env.USE_CLAUDE_API === 'true') {
    console.log("Attempting to use Claude API to generate quote...");
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY || CLAUDE_API_KEY === "Your-5-Dollar-Claude-API-Key-Here") {
      console.error("Claude API key not found or is a placeholder, using fallback quote.");
      return myQuotes[Math.floor(Math.random() * myQuotes.length)];
    }
    
    const prompt = `\n\nHuman: Write a short, powerful, and inspiring quote about the transformative power of reading a book. Make it feel personal and motivational.\n\nAssistant:`;
    try {
      const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
          'x-api-key': CLAUDE_API_KEY,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          prompt: prompt,
          model: "claude-2.1",
          max_tokens_to_sample: 60,
          temperature: 0.8,
        }),
      });
      if (!response.ok) throw new Error(`Claude API Error: ${response.statusText}`);
      const result = await response.json();
      return result.completion.trim();
    } catch (error) {
      console.error(error);
      return "The world belongs to those who read."; // Fallback quote on API error
    }
  } else {
    // --- Use My Pre-written Quotes ---
    console.log("Using pre-written quote...");
    if (myQuotes.length === 0) {
        return "Don't forget to add your amazing quotes to the list!";
    }
    const randomIndex = Math.floor(Math.random() * myQuotes.length);
    return myQuotes[randomIndex];
  }
}

export async function GET() {
  let subscription;
  try {
    // Read the subscription from our file.
    const subscriptionString = await fs.readFile(subscriptionFilePath, 'utf-8');
    subscription = JSON.parse(subscriptionString);
  } catch {
    // This is expected if no one is subscribed. We log it and exit gracefully.
    console.log('No subscription file found. No notification will be sent.');
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }

  try {
    const quote = await getMotivationalQuote();
    const payload = JSON.stringify({
      title: 'Your 10 PM Reading Nudge ✨',
      body: quote,
    });

    // The 'subscription' object read from the file is already in the correct format.
    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true, message: 'Notification sent!' });
  } catch (error) {
    console.error('Push notification error:', error);
    
    // Type guard to safely access properties on the error object
    const isWebPushError = (err: unknown): err is { statusCode: number } => {
        return typeof err === 'object' && err !== null && 'statusCode' in err;
    };

    // If a subscription is invalid (410 Gone), delete the file so we don't try again.
    if (isWebPushError(error) && error.statusCode === 410) {
      console.log('Subscription is invalid (410), deleting file.');
      await fs.rm(subscriptionFilePath, { force: true });
      return NextResponse.json({ error: 'Subscription expired and removed' }, { status: 410 });
    }
    
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}