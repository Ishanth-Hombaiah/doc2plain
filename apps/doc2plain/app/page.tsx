'use client';

import { useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'explore'
  const [input, setInput] = useState('');
  const [out, setOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true); 
    setOut(''); 
    setErr(null);

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      
      if (!r.ok) {
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e9ecef',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div 
            onClick={() => setCurrentPage('home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#6c9bd1',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <span>📖</span>
            Doc2Plain
          </div>
          <nav style={{ display: 'flex', gap: '32px' }}>
            <button
              onClick={() => setCurrentPage('explore')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6c9bd1',
                textDecoration: 'none',
                fontSize: '16px',
                cursor: 'pointer',
                textDecoration: currentPage === 'explore' ? 'underline' : 'none'
              }}
            >
              Explore
            </button>
            <a href="#" style={{
              color: '#6c9bd1',
              textDecoration: 'none',
              fontSize: '16px'
            }}>
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Home Page Content */}
      {currentPage === 'home' && (
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 'calc(100vh - 200px)'
        }}>
          <div style={{ flex: '1', maxWidth: '500px' }}>
            <h1 style={{
              fontSize: '64px',
              fontWeight: '300',
              color: '#6c9bd1',
              margin: '0 0 32px 0',
              lineHeight: '1.1'
            }}>
              Get Health Clarity.
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#6c9bd1',
              lineHeight: '1.6',
              marginBottom: '48px',
              fontWeight: '300'
            }}>
              Translate medical jargon into plain English that you can understand.
            </p>
            
            <button
              onClick={() => setCurrentPage('explore')}
              style={{
                backgroundColor: '#b8d4f0',
                color: '#6c9bd1',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Explore →
            </button>
          </div>
          
          {/* Decorative circles */}
          <div style={{
            flex: '1',
            position: 'relative',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Large background circle */}
            <div style={{
              position: 'absolute',
              width: '350px',
              height: '350px',
              backgroundColor: '#e8f4f8',
              borderRadius: '50%',
              top: '50px',
              right: '0px',
              opacity: 0.6
            }}></div>
            
            {/* Medium circle */}
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              backgroundColor: '#b8d4f0',
              borderRadius: '50%',
              bottom: '20px',
              right: '100px',
              opacity: 0.7
            }}></div>
            
            {/* Small circle */}
            <div style={{
              position: 'absolute',
              width: '120px',
              height: '120px',
              backgroundColor: '#6c9bd1',
              borderRadius: '50%',
              top: '0px',
              right: '200px',
              opacity: 0.3
            }}></div>
          </div>
        </main>
      )}

      {/* Explore Page Content */}
      {currentPage === 'explore' && (
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px'
        }}>
          {/* Medical Info Section */}
          <div>
            <h2 style={{
              color: '#6c9bd1',
              fontSize: '24px',
              fontWeight: '500',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>
              Medical Info
            </h2>
            
            <div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '2px solid #e9ecef',
                minHeight: '200px',
                position: 'relative',
                marginBottom: '16px'
              }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="CT scan indicates pulmonary nodule in the right upper lobe; follow-up imaging to rule out malignancy"
                  style={{
                    width: '100%',
                    height: '200px',
                    border: 'none',
                    outline: 'none',
                    padding: '20px',
                    fontSize: '16px',
                    color: '#6c9bd1',
                    backgroundColor: 'transparent',
                    resize: 'none',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
                
                {/* Plus button */}
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '20px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'transparent',
                    border: '2px solid #6c9bd1',
                    borderRadius: '6px',
                    color: '#6c9bd1',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
                
                {/* Arrow button */}
                <button
                  type="button"
                  disabled={loading || !input.trim()}
                  onClick={handleSubmit}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '20px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#6c9bd1',
                    border: 'none',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '16px',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loading || !input.trim() ? 0.5 : 1
                  }}
                >
                  {loading ? '...' : '→'}
                </button>
              </div>
              
              {err && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '14px',
                  marginTop: '8px'
                }}>
                  {err}
                </div>
              )}
            </div>
          </div>

          {/* Translation Section */}
          <div>
            <h2 style={{
              color: '#6c9bd1',
              fontSize: '24px',
              fontWeight: '500',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>
              Translation
            </h2>
            
            {out ? (
              <div>
                <p style={{
                  color: '#6c9bd1',
                  fontSize: '16px',
                  marginBottom: '24px',
                  fontWeight: '500'
                }}>
                  Here's what you need to know:
                </p>
                
                <div style={{
                  color: '#6c9bd1',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  marginBottom: '32px'
                }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{out}</div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <button style={{
                    backgroundColor: '#b8d4f0',
                    color: '#6c9bd1',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Next steps
                  </button>
                  <button style={{
                    backgroundColor: '#b8d4f0',
                    color: '#6c9bd1',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    I'm feeling worried
                  </button>
                  <button style={{
                    backgroundColor: '#b8d4f0',
                    color: '#6c9bd1',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    Is this serious?
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                color: '#a0a0a0',
                fontSize: '16px',
                fontStyle: 'italic'
              }}>
                {loading ? 'Translating...' : 'Enter medical information to see translation'}
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}