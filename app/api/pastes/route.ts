import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { v4 as uuidv4 } from 'uuid';

const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();
    
    // Create a random 8-character ID for the link
    const id = uuidv4().substring(0, 8); 

    const pasteData = {
      content,
      max_views: max_views || null,
      views: 0
    };

    // Save to Upstash with Expiration
    if (ttl_seconds) {
      await redis.set(`paste:${id}`, pasteData, { ex: ttl_seconds });
    } else {
      await redis.set(`paste:${id}`, pasteData);
    }

    return NextResponse.json({ id, url: `/pastes/${id}` }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}