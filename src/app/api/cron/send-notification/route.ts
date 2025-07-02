import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { promises as fs } from 'fs';
import path from 'path';
export const runtime = 'nodejs';
// This is the single source of truth for our subscription file path.
const subscriptionFilePath = path.join('/tmp', 'subscription.json');

// As requested, this is a placeholder for your brilliant quotes.
// --- My Hand-Crafted Quotes ---
export const myQuotes: string[] = [
  // Original 30
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
  "Develop a passion for learning, because if you do, you will never cease to grow.",
  // New 30
  "The ink on the page is a bridge to another soul. Walk across it.",
  "Your future self is begging you to read that book you keep putting off. Don't let them down.",
  "A book is a time machine. Where will you travel tonight? To the past, the future, or a world that never was?",
  "Ten minutes of reading is a small deposit in the bank of your knowledge. The compound interest is extraordinary.",
  "The world is loud. A book is a sanctuary. Step inside and find your quiet.",
  "An audiobook in your ears is a private university where you are the only student.",
  "The most successful people have one thing in common: they are voracious learners. Their primary tool? Books.",
  "Don't let the day end without planting a new idea in your mind. A book is the most fertile ground.",
  "That story you're in the middle of? Its world has been paused, waiting for you to press play.",
  "To read is to empower your mind. To not read is to leave it defenseless.",
  "The quality of your thoughts is determined by the quality of your inputs. Choose a great book.",
  "A single sentence can change your life. There are thousands of them waiting for you in the book you're reading.",
  "The heroes of your story are facing their challenges. It's time for you to join them.",
  "Reading a book is a silent conversation with the author. What questions will you ask tonight?",
  "Escape the algorithm. A book is a curated experience, chosen by you, for you.",
  "The beautiful thing about learning is that no one can take it away from you. Let's learn something new.",
  "Your mind is a garden. Reading is the water. Don't let it go thirsty.",
  "An hour spent reading is an hour invested directly in your own evolution.",
  "The day is done. Let go of its demands and fall into a story.",
  "You can't buy more time, but you can live a thousand lives by reading books.",
  "That audiobook isn't just a file on your phone; it's a mentor whispering in your ear.",
  "The solutions to your biggest challenges are often hidden in the pages of a book.",
  "Reading is the ultimate act of self-care. It's time to take care of yourself.",
  "A story is the shortest path between a human being and the truth. Let's find some truth tonight.",
  "The world's greatest wisdom is available to you for the price of a book and a little of your time.",
  "Don't just be a consumer of information. Be a student of knowledge. Open your book.",
  "The end of a chapter is the perfect place to end the day.",
  "Let a story be the bridge from your busy day to a peaceful night's sleep.",
  "Every book you finish is a new lens through which you can see the world.",
  "The journey is long, but the next page is close. Take the next step.",
  // Final 30
  "The answer to the toughest interview question you'll ever face is hidden in a chapter you haven't read yet. Prepare for your future tonight.",
  "Your resume lists your skills, but your conversation reveals your knowledge. Every book you read is a direct upgrade to your ability to impress.",
  "That job you want, that promotion you're aiming for? The person who gets it will be the one who knows more. The library is open.",
  "Don't just work hard. Work smart. The smartest people in the world have written down their secrets for you. All you have to do is read them.",
  "An audiobook on your commute is a private lecture from a world-class expert. Arrive at work smarter than when you left home.",
  "Every book on business, technology, or psychology is a cheat code for your career. It's time to level up.",
  "The confidence you need in the boardroom is built during the quiet hours you spend with a book.",
  "Being 'well-read' isn't an old-fashioned idea. It's a secret weapon that makes you more interesting, more articulate, and more hireable.",
  "The market changes, but the principles of success do not. Learn them from the masters who wrote them down.",
  "That technical problem at work? Someone, somewhere, has already solved it and written a book about it. Find their solution.",
  "A habit is built in moments of decision. The moment is now. The decision is one page.",
  "Don't break the chain. A single chapter tonight keeps the momentum alive for tomorrow.",
  "Your mind is a muscle. This is its daily training. Don't skip leg day, and don't skip page day.",
  "The version of you that is disciplined, focused, and wise is not born, it is built. The building material is books.",
  "Willpower is finite, but a habit is automatic. Do it now, and make it easier for your future self.",
  "The book doesn't care if you're tired. It will wait. But your growth depends on you showing up.",
  "Treat this like a promise to yourself. A promise to be a little calmer and a little smarter than you were yesterday.",
  "The resistance you feel is the sign that this is important. Push through it. The reward is on the other side.",
  "One page is a victory. Ten pages is a triumph. A chapter is a conquest. Choose your victory for tonight.",
  "The story is paused. The characters are waiting. The world you left behind is ready for your return.",
  "You cannot live all the lives, but through books, you can learn from them all. It's the ultimate shortcut to wisdom.",
  "Reading is the practice of empathy. By understanding the lives of others, you become better at living your own.",
  "Every book is a new tool for your mind. The more tools you have, the better you can build your life.",
  "The problems you face are not unique. The greatest minds in history have faced them too. Their advice is waiting for you.",
  "A library is not a luxury, but one of the necessities of life. Your personal library is in your mind.",
  "To be interesting, be interested. Reading is the fastest way to become interested in everything.",
  "The quality of your decisions is a reflection of your knowledge. Read widely, and decide wisely.",
  "Don't just read for answers. Read to find better questions.",
  "A mind expanded by a new idea never returns to its original dimensions. It's time to expand.",
  "The conversation you have with yourself is the most important one. Reading gives you better things to talk about."
];

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