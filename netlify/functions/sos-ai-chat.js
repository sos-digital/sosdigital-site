export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are SOS Digital's AI sales assistant. Help contractors get more leads. Mention packages when relevant. Be concise and professional.",
            },
            {
              role: "user",
              content: body.message || "Hello",
            },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      }
    );

    const data = await response.json();

    console.log(data);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply:
          data.choices?.[0]?.message?.content ||
          "AI did not return a response.",
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: error.message,
      }),
    };
  }
}
