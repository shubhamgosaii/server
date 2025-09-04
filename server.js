import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const app = express();
app.use(cors());
app.use(express.json());

// Read API key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini";

    res.json({ reply });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ reply: "❌ Error talking to Gemini" });
  }
});

// Use PORT from Render or fallback to 5000 locally
const PORT = process.env.PORT || 1812;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
