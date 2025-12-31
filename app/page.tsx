'use client';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState(3600); // Default to 1 hour
  const [maxViews, setMaxViews] = useState(5);
  const [url, setUrl] = useState('');

  const savePaste = async () => {
    const res = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content, 
        ttl_seconds: ttl, 
        max_views: maxViews 
      }),
    });
    const data = await res.json();
    setUrl(window.location.origin + data.url);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1>Rajalakshmi Pastebin-Lite</h1>
      <textarea 
        style={{ width: '100%', height: '300px', padding: '15px', fontSize: '16px' }} 
        placeholder="Enter your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div>
          <label>Expires in: </label>
          <select onChange={(e) => setTtl(Number(e.target.value))} style={{ padding: '5px' }}>
            <option value={60}>1 Minute</option>
            <option value={3600}>1 Hour</option>
            <option value={86400}>1 Day</option>
          </select>
        </div>

        <div>
          <label>Max Views: </label>
          <input 
            type="number" 
            value={maxViews} 
            onChange={(e) => setMaxViews(Number(e.target.value))} 
            style={{ width: '60px', padding: '5px' }} 
          />
        </div>

        <button 
          onClick={savePaste}
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Generate Link
        </button>
      </div>

      {url && (
        <div style={{ marginTop: '30px', padding: '15px', background: '#f0f9ff', border: '1px solid #0070f3' }}>
          <strong>Your Paste Link:</strong><br />
          <a href={url} target="_blank" rel="noreferrer" style={{ color: '#0070f3', wordBreak: 'break-all' }}>
            {url}
          </a>
        </div>
      )}
    </div>
  );
}