
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// This is a trick to persist the subscription in memory during local development
// across Next.js hot reloads.
const globalForStore = global as typeof global & {
  subscription: PushSubscription | null;
};

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    console.log('Received subscription:', subscription);

    if (process.env.NODE_ENV === 'production') {
      // In production, save to Vercel KV
      await kv.set('push_subscription', JSON.stringify(subscription));
      console.log('Subscription saved to Vercel KV.');
    } else {
      // In development, save to our in-memory global store
      globalForStore.subscription = subscription;
      console.log('Subscription saved to in-memory store for local development.');
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}