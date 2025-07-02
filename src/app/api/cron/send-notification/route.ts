
import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { kv } from '@vercel/kv';

// --- My Hand-Crafted Quotes ---
const myQuotes = [
  "A single chapter can be the anchor for your entire day. What story will you live today?",
  "The person you will be in five years depends on the books you read today. Time to invest in your future self.",
  "Don't just read to finish a book. Read to start a conversation with yourself.",
  "Every page you turn is a quiet act of rebellion against a noisy world. Find your focus.",
  "That book on your shelf isn't just paper and ink; it's a world waiting for you to visit. No passport required.",
  "You are one story away from a new perspective. Open a book and see the world differently.",
  "Learning is not a destination, but a journey. And every book is a new path to explore.",
  "The richest people in the world build libraries. The rest of us? We can build them in our minds, one book at a time.",
  "A 15-minute reading session is a 15-minute conversation with one of the greatest minds in history. Who will you talk to tonight?",
  "Don't let a busy day steal your growth. A few pages are all it takes to reclaim your mind.",
  "The magic of an audiobook is that you can explore new worlds while navigating your own. Press play on your next adventure.",
  "What problem are you trying to solve? The answer is likely waiting for you in a book you haven't read yet.",
  "Reading is to the mind what exercise is to the body. Time for your daily mental workout.",
  "The distance between your dreams and reality is called action. Reading is the first step.",
  "You don't find time to read, you make time to read. Let's make some time tonight.",
  "An audiobook can turn a mundane commute into an unforgettable journey. Where will you go today?",
  "Knowledge is the one treasure that no one can take from you. It's time to add to your vault.",
  "The characters in your book are waiting for you. Don't leave them hanging.",
  "A day without learning is a day wasted. A book is the fastest way to learn.",
  "That feeling of 'I don't have time' is a signal. It's a signal that you need to slow down and read.",
  "Close the tabs in your browser and open a book. Your mind will thank you.",
  "The cure for a noisy mind is a quiet page. Find your peace.",
  "Think about who you were before you read your last great book. You're about to change again.",
  "Success is not an accident. It's a habit. Reading is the cornerstone of that habit.",
  "Let the story you're reading be the last thing on your mind tonight, not the worries of the day.",
  "A book is a dream you can hold in your hand. What will you dream about tonight?",
  "The goal isn't to read a hundred books, but to let one book read you a hundred times.",
  "Every author has spent years crafting the words you can read in hours. It's the best deal in the world.",
  "Listening to a great story is like letting a friend tell you a secret. Time to listen in.",
  "Develop a passion for learning, because if you do, you will never cease to grow."
];

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

async function getMotivationalQuote(): Promise<string> {
  // --- Feature Flag Logic ---
  if (process.env.USE_CLAUDE_API === 'true') {
    console.log("Using Claude API to generate quote...");
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
    if (!CLAUDE_API_KEY) {
      console.error("Claude API key not found, using fallback.");
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
      return "The world belongs to those who read."; // Fallback
    }
  } else {
    // --- Use My Pre-written Quotes ---
    console.log("Using pre-written quote...");
    const randomIndex = Math.floor(Math.random() * myQuotes.length);
    return myQuotes[randomIndex];
  }
}

export async function GET() {
  // Retrieve the saved subscription from Vercel KV
  const subscriptionString = await kv.get<string>('push_subscription');

  if (!subscriptionString) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
  }
  const subscription = JSON.parse(subscriptionString);

  try {
    const quote = await getMotivationalQuote();
    const payload = JSON.stringify({
      title: 'Your 10 PM Reading Nudge ✨',
      body: quote,
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true, message: 'Notification sent!' });
  } catch (error) {
    console.error(error);
    // If a subscription is invalid, it should be deleted.
    if (error instanceof Error && 'statusCode' in error && error.statusCode === 410) {
      await kv.del('push_subscription');
    }
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
