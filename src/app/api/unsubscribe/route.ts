import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const subscriptionFilePath = path.join(os.tmpdir(), 'subscription.json');

export async function POST() {
  try {
    console.log('Unsubscribing, deleting subscription file...');
    
    // Delete the subscription file using the correct path.
    await fs.rm(subscriptionFilePath, { force: true });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reset subscription' }, { status: 500 });
  }
}