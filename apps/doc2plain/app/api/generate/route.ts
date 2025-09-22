export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { prompt, type, followUpType, originalResponse }: {
      prompt: string;
      type: string;
      followUpType?: 'next-steps' | 'worried' | 'serious';
      originalResponse?: string;
    } = await req.json();
    
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

    let systemMessage = '';
    let userMessage = prompt;

    if (type === 'followup') {
      // Handle follow-up questions
      const followUpPrompts: Record<string, string> = {
        'next-steps': `Based on the original medical information "${prompt}" and the translation provided "${originalResponse}", please provide specific, actionable next steps the patient should take. Be practical and clear about what they should do, when they should do it, and who they should contact. Keep it simple and reassuring.`,
        
        'worried': `The patient is feeling worried about this medical information: "${prompt}". They received this translation: "${originalResponse}". Please provide comfort and reassurance while being honest. Help them understand what to expect, address common concerns, and give them emotional support. Use a warm, empathetic tone.`,
        
        'serious': `Based on this medical information "${prompt}" and translation "${originalResponse}", please help the patient understand the seriousness level of their condition. Explain in simple terms whether this is something urgent, routine, or somewhere in between. Be honest but not alarming, and help put things in perspective.`
      };

      systemMessage = 'You are a compassionate medical interpreter helping patients understand their health information. Provide clear, supportive, and accurate information in everyday language, in the form of only a few bullet points. Do not generate a prelude or any other additional content. Make each bullet as short as possible, and explain it in very simple terms (like this person has never been to the doctor before). Start each bullet point with this symbol: •';
      userMessage = followUpPrompts[followUpType ?? 'next-steps'];
      
    } else {
      // Original translation functionality
      systemMessage = 'Translate the following input from medical terminology into the output of bullet points of everyday language, summarizing the contents of the input. Do not generate a prelude or any other additional content. Make each bullet as short as possible, but make it as detailed and thorough as possible, and explain it in very simple terms (like this person has never been to the doctor before). Start each bullet point with this symbol: •';
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
            content: systemMessage
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: type === 'followup' ? 400 : 300, 
        temperature: type === 'followup' ? 0.5 : 0.3, 
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

  } catch (e: unknown) {
  const error = e as Error;
  console.error('API Route Error:', error);
  return new Response(JSON.stringify({ error: error?.message || 'Server error' }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}
}
