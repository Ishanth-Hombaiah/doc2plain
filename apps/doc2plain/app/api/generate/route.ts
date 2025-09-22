export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();

    console.log('Groq API key length:', apiKey?.length);

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY is not set on the server.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', 
        messages: [
          {
            role: 'system',
            content: 'Translate the following input from medical terminology into the output of bullet points of everyday language, summarizing the contents of the input. Do not generate a prelude or any other additional content. Make each bullet as short as possible, but make it as detailed and thorough as possible, and explain it in very simple terms (like this person has never been to the doctor before)'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300, 
        temperature: 0.3, 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Groq API error:', data);
      return new Response(
        JSON.stringify({ error: data.error?.message || `Groq API error: ${response.status}` }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const text = data.choices?.[0]?.message?.content || 'No response generated';

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e: any) {
    console.error('API Route Error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
