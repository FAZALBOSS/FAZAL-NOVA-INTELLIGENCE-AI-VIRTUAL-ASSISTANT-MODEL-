export default async function handler(req, res) {
  const { prompt, engine } = req.body;

  let reply = '';

  if (engine === 'gpt') {
    // Dummy GPT response
    reply = "This is a GPT-4 response to: " + prompt;
  } else if (engine === 'gemini') {
    // Dummy Gemini response
    reply = "This is a Gemini Pro response to: " + prompt;
  }

  res.status(200).json({ reply });
}