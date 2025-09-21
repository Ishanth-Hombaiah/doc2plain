'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); 
    setOut(''); 
    setErr(null);

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      
      // Check if we got a valid response
      if (!r.ok) {
        // Try to get error message from response
        const text = await r.text();
        let errorMsg;
        try {
          const data = JSON.parse(text);
          errorMsg = data?.error || `HTTP ${r.status}`;
        } catch {
          errorMsg = `HTTP ${r.status}: ${text}`;
        }
        setErr(errorMsg);
      } else {
        const data = await r.json();
        if (data?.error) {
          setErr(data.error);
        } else {
          setOut(data.text || '(no text)');
        }
      }
    } catch (fetchErr: any) {
      setErr(`Network error: ${fetchErr.message}`);
    }
    
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1>Inference Demo</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <textarea
          rows={6}
          placeholder="Ask the model…"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', padding: '8px' }}
        />
        <button disabled={loading || !input.trim()}>
          {loading ? 'Generating…' : 'Send'}
        </button>
        {err && <span style={{color:'crimson'}}>{err}</span>}
      </form>
      {out && (
        <div style={{ marginTop: 16 }}>
          <h3>Response:</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px' 
          }}>
            {out}
          </pre>
        </div>
      )}
    </main>
  );
}