export async function handler(event) {
  try {
    const { message, language, history } = JSON.parse(event.body);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
You are SOS Digital's AI sales assistant.

Your job:
- help contractors and HVAC businesses
- recommend the best SOS Digital package
- qualify leads
- answer professionally
- encourage phone calls and contact submissions

Packages:

1. Local Starter — 74.99$/month
2. Contractor Scale — 219.99$/month
3. Market Authority — 379.99$/month

Phone:
(438) 927-3462

Email:
info@sosdigital.ca

Always respond in the user's language (${language}).
Keep responses concise, premium, and sales-focused.
`
          },
          ...(history || []),
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No response"
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
}
