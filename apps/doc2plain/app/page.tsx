'use client';

import { useState } from 'react';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'explore'
  const [input, setInput] = useState('');
  const [out, setOut] = useState('');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true); 
    setOut(''); 
    setFollowUps([]);
    setErr(null);

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, type: 'initial' }),
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
    } catch (error: unknown) {
  const err = error as Error;
  setErr(err.message || 'An error occurred');
  }
    
    setLoading(false);
  }
  function handleFileUpload() {
    // todo
  }
  async function handleFollowUp(type: 'next-steps' | 'worried' | 'serious') {
    if (!input || !out) return;
    
    setFollowUpLoading(true);
    
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input, 
          type: 'followup',
          followUpType: type,
          originalResponse: out
        }),
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
          setFollowUps(prev => [...prev, data.text || '(no response)']);
        }
      }
    } catch (fetchErr: any) {
      setErr(`Network error: ${fetchErr.message}`);
    }
    
    setFollowUpLoading(false);
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F6FCFF',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid rgba(0,182,255,0.13)',
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
              color: '#307091',
              fontSize: '16px',
              fontWeight: '400',
              cursor: 'pointer'
            }}
          >
            
            Doc2Plain
          </div>
          <nav style={{ display: 'flex', gap: '52px' }}>
            <button
              onClick={() => setCurrentPage('explore')}
              style={{
                background: 'none',
                border: 'none',
                color: '#307091',
                textDecoration: 'none',
                textUnderlineOffset: '5px',
                fontSize: '16px',
                fontWeight: '400',
                cursor: 'pointer',
                textDecoration: currentPage === 'explore' ? 'underline' : 'none'
              }}
            >
              Explore
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              style={{
                background: 'none',
                border: 'none',
                color: '#307091',
                textDecoration: 'none',
                textUnderlineOffset: '5px',
                fontSize: '16px',
                fontWeight: '400',
                cursor: 'pointer',
                textDecoration: currentPage === 'about' ? 'underline' : 'none'
              }}
            >
              About
            </button>
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
          <div style={{ flex: '1', maxWidth: '600px' }}>
            <h1 style={{
              fontSize: '64px',
              fontWeight: '200',
              color: '#307091',
              margin: '0 0 32px 0',
              lineHeight: '1.1'
            }}>
              Get Health Clarity.
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#307091',
              lineHeight: '1.6',
              marginBottom: '48px',
              fontWeight: '300'
            }}>
              Translate medical jargon into plain English that you can understand.
            </p>
            
            <button
              onClick={() => setCurrentPage('explore')}
              style={{
                backgroundColor: 'rgba(0,182,255,0.13)',
                color: '#307091',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '8px',
                fontSize: '22px',
                fontWeight: '300',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s ease',
                transform: 'translateY(0px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#307091';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,182,255,0.13)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(0,182,255,0.13)';
                e.target.style.color = '#307091';
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Explore -{'>'}
            </button>
          </div>
          
          {/* Decorative hearts */}
          <div style={{
            flex: '1',
            position: 'relative',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Large background heart */}
            <img
              src="/doc2plain_heart.png"
              alt="Decorative heart"
              style={{
                position: 'absolute',
                width: '700px',
                height: '700px',
                top: '-150px',
                right: '-75px',
                opacity: 1.0,
                objectFit: 'contain',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            />
          </div>
        </main>
      )}

      {currentPage === 'about' && (
        <main style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '48px 24px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <h1 style={{
              color: '#307091',
              fontSize: '36px',
              fontWeight: '400',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              About Doc2Plain
            </h1>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: '#307091',
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '16px'
              }}>
                What We Do
              </h2>
              <p style={{
                color: '#307091',
                fontSize: '18px',
                fontWeight: '300',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                 Doc2Plain transforms dense medical descriptions into more common language that patients can easily comprehend. Our AI-powered tool breaks down medical reports, test results, and documentation into simple bullet points so providers can spend less time translating and more time saving lives.
              </p>
              <p style={{
                color: '#307091',
                fontSize: '18px',
                fontWeight: '300',
                lineHeight: '1.6'
              }}>
                From lab results to treatment recommendations, Doc2Plain provides instant translations along with follow-up support for common concerns like next steps, worries, and severity assessments.
              </p>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <h2 style={{
                color: '#307091',
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '20px'
              }}>
                Tech Stack
              </h2>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{
                  backgroundColor: 'rgba(0,182,255,0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,182,255,0.13)'
                }}>
                  <h3 style={{
                    color: '#307091',
                    fontSize: '20px',
                    fontWeight: '400',
                    marginBottom: '12px'
                  }}>
                    Frontend
                  </h3>
                  <ul style={{
                    color: '#307091',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '1.8',
                    paddingLeft: '20px'
                  }}>
                    <li>Next.js 14</li>
                    <li>React 18</li>
                    <li>TypeScript</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0,182,255,0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,182,255,0.13)'
                }}>
                  <h3 style={{
                    color: '#307091',
                    fontSize: '20px',
                    fontWeight: '400',
                    marginBottom: '12px'
                  }}>
                    Backend
                  </h3>
                  <ul style={{
                    color: '#307091',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '1.8',
                    paddingLeft: '20px'
                  }}>
                    <li>Next.js API Routes</li>
                    <li>Node.js Runtime</li>
                    <li>RESTful APIs</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0,182,255,0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,182,255,0.13)'
                }}>
                  <h3 style={{
                    color: '#307091',
                    fontSize: '20px',
                    fontWeight: '400',
                    marginBottom: '12px'
                  }}>
                    AI & ML
                  </h3>
                  <ul style={{
                    color: '#307091',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '1.8',
                    paddingLeft: '20px'
                  }}>
                    <li>Groq API</li>
                    <li>Llama 3.3 70B</li>
                    <li>Natural Language Processing</li>
                  </ul>
                </div>

                <div style={{
                  backgroundColor: 'rgba(0,182,255,0.03)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,182,255,0.13)'
                }}>
                  <h3 style={{
                    color: '#307091',
                    fontSize: '20px',
                    fontWeight: '400',
                    marginBottom: '12px'
                  }}>
                    Deployment
                  </h3>
                  <ul style={{
                    color: '#307091',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '1.8',
                    paddingLeft: '20px'
                  }}>
                    <li>Vercel</li>
                    <li>Edge Functions</li>
                    <li>Serverless</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* explore page */}
      {currentPage === 'explore' && (
        <main style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px'
        }}>
          {/* med info */}
          <div>
            <h2 style={{
              color: '#307091',
              fontSize: '24px',
              fontWeight: '300',
              marginBottom: '16px',
              margin: '0 0 32px 0'
            }}>
              Medical Text
            </h2>
            
            <div>
              <div style={{
                backgroundColor: 'rgba(0,182,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(0,182,255,0.13)',
                minHeight: '200px',
                position: 'relative',
                marginBottom: '16px'
              }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type here to translate..."
                  style={{
                    width: '100%',
                    height: '200px',
                    border: 'none',
                    outline: 'none',
                    padding: '20px',
                    fontSize: '16px',
                    fontWeight: '300',
                    color: '#307091',
                    backgroundColor: 'transparent',
                    resize: 'none',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    boxSizing: 'border-box'
                  }}
                />
                
                {/* file upload button */}
                <button
                  type="button"
                  onClick={handleFileUpload}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '14px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#307091',
                    fontSize: '32px',
                    fontWeight: '200',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
                
                {/* arrow translate button */}
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
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#307091',
                    fontSize: '24px',
                    fontWeight: '300',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: loading || !input.trim() ? 0.5 : 1
                  }}
                >
                  {loading ? '...' : "->"}
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

          {/* translation output section */}
          <div>
            <h2 style={{
              color: '#307091',
              fontSize: '24px',
              fontWeight: '300',
              marginBottom: '16px',
              margin: '0 0 32px 0'
            }}>
              Translation
            </h2>
            
            {out ? (
              <div>
                <div style={{
                        backgroundColor: 'rgba(0,182,255,0.03)',
                        border: '1px solid rgba(0,182,255,0.13)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '16px',
                        color: '#307091',
                        fontSize: '16px',
                        fontWeight: '300',
                        lineHeight: '1.6'
                      }}>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{out}</div>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <button 
                    onClick={() => handleFollowUp('next-steps')}
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: 'rgba(0,182,255,0.13)',
                      color: '#307091',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: followUpLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '300',
                      opacity: followUpLoading ? 0.6 : 1
                    }}
                  >
                    Next steps
                  </button>
                  <button 
                    onClick={() => handleFollowUp('worried')}
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: 'rgba(0,182,255,0.13)',
                      color: '#307091',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: followUpLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '300',
                      opacity: followUpLoading ? 0.6 : 1
                    }}
                  >
                    I&apos;m feeling worried...
                  </button>
                  <button 
                    onClick={() => handleFollowUp('serious')}
                    disabled={followUpLoading}
                    style={{
                      backgroundColor: 'rgba(0,182,255,0.13)',
                      color: '#307091',
                      border: 'none',
                      padding: '8px 20px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: followUpLoading ? 'not-allowed' : 'pointer',
                      fontWeight: '300',
                      opacity: followUpLoading ? 0.6 : 1
                    }}
                  >
                    Is this serious?
                  </button>
                </div>

                {/* follow up responses */}
                {followUps.length > 0 && (
                  <div style={{ marginTop: '32px' }}>
                    {followUps.map((followUp, index) => (
                      <div key = {index} style={{
                        backgroundColor: 'rgba(0,182,255,0.03)',
                        border: '1px solid rgba(0,182,255,0.13)',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '16px',
                        color: '#307091',
                        fontSize: '16px',
                        fontWeight: '300',
                        lineHeight: '1.6'
                      }}>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{followUp}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* indicator for follow ups */}
                {followUpLoading && (
                  <div style={{
                    marginTop: '20px',
                    color: '#307091',
                    fontWeight: '300',
                    fontSize: '16px',
                    textAlign: 'center'
                  }}>
                    Getting more info...
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                backgroundColor: 'rgba(0,182,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(0,182,255,0.13)',
                minHeight: '208px',
                position: 'relative',
                marginBottom: '16px',
                display: 'flex',
                padding: '16px'
              }}>
                <div style={{
                  color: '#307091',
                  opacity: '0.5',
                  fontSize: '16px',
                  fontWeight: '300'
                }}>
                  {loading ? 'Translating...' : 'Enter medical information to see translation'}
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
