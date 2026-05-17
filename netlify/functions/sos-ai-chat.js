export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "ERROR: OPENAI_API_KEY is missing in Netlify." }),
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are SOS Digital's AI sales assistant. Help contractors get more leads. Mention Local Starter 74.99$/mo, Contractor Scale 219.99$/mo, and Market Authority 379.99$/mo when relevant. Phone: (438) 927-3462. Email: info@sosdigital.ca.",
          },
          {
            role: "user",
            content: body.message || "Hello",
          },
        ],
        temperature: 0.7,
        max_tokens: 220,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: "OpenAI error: " + (data.error?.message || JSON.stringify(data)),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: data.choices?.[0]?.message?.content || "No answer from OpenAI response.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: "Function error: " + error.message,
      }),
    };
  }
}
