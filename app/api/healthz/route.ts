import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// This connects to the database using the keys you put in .env.local
const redis = Redis.fromEnv();

export async function GET() {
  try {
    // Check if we can talk to the database
    await redis.ping();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    // If the database is down or keys are wrong
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}