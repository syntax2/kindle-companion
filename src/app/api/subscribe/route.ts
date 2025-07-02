
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv'; // Using Vercel's Key-Value store

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    // In production, we save the subscription to Vercel KV for persistence.
    await kv.set('push_subscription', JSON.stringify(subscription));
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

