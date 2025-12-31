import { Redis } from '@upstash/redis';
import { notFound } from 'next/navigation';

const redis = Redis.fromEnv();

export default async function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  // 1. Get the ID from the URL
  const { id } = await params;

  // 2. Fetch the data from Upstash
  const data: any = await redis.get(`paste:${id}`);

  // 3. If no data, show 404
  if (!data) return notFound();

  // 4. Update the View Count logic
  const currentViews = data.views || 0;
  const newViews = currentViews + 1;

  // Check if we hit the limit
  if (data.max_views && newViews > data.max_views) {
    await redis.del(`paste:${id}`); // Delete from database
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1>This link has expired (View limit reached).</h1>
      </div>
    );
  }

  // 5. SAVE the new view count back to the database
  await redis.set(`paste:${id}`, { ...data, views: newViews });

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial', backgroundColor: '#111', color: '#fff', minHeight: '100vh' }}>
      <h2>Paste Content:</h2>
      <pre style={{ background: '#222', padding: '20px', border: '1px solid #444', borderRadius: '5px' }}>
        {data.content}
      </pre>
      <p style={{ marginTop: '20px', color: '#aaa' }}>
        Views: <strong>{newViews}</strong> / {data.max_views || 'Unlimited'}
      </p>
    </div>
  );
}