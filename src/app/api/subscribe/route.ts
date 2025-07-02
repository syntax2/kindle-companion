// import { NextResponse } from 'next/server';
// import { promises as fs } from 'fs';
// import path from 'path';
// import os from 'os';
// import { sendPushNotification } from '@/lib/notification';// We will create this helper

// // This creates a reliable path to a temp file that works on Windows, Mac, and Linux.
// const subscriptionFilePath = path.join(os.tmpdir(), 'subscription.json');

// export async function POST(request: Request) {
//   try {
//     const subscription = await request.json();
//     console.log('Received subscription, saving to file...');
    
//     // Write the subscription object to the file.
//     await fs.writeFile(subscriptionFilePath, JSON.stringify(subscription));

//     // --- NEW FEATURE: Send an immediate welcome notification ---
//     console.log('Sending welcome notification...');
//     await sendPushNotification(subscription, "Welcome to Kindle Companion!", "You're all set! We'll send you inspiring nudges to help you read more.");

//     return NextResponse.json({ success: true }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { sendPushNotification } from '@/lib/notification'; // We will use our helper

// We need to import the quotes here as well
import { myQuotes } from '../cron/send-notification/route';

const subscriptionFilePath = path.join(os.tmpdir(), 'subscription.json');

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    console.log('Received subscription, saving to file...');
    
    await fs.writeFile(subscriptionFilePath, JSON.stringify(subscription));

    // --- THIS IS THE FIX ---
    // Instead of a generic message, we get a random quote.
    const welcomeQuote = myQuotes[Math.floor(Math.random() * myQuotes.length)];
    
    console.log('Sending welcome quote notification...');
    await sendPushNotification(
        subscription, 
        "Welcome to Your Companion! ✨", 
        welcomeQuote
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}