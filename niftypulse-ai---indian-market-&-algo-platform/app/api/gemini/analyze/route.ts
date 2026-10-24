import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { symbol, name, ltp, changePercent, volumeRatio, signal, technicals, language } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the server environment." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const prompt = `
You are a senior Indian stock market quantitative analyst and mentor dedicated to helping beginners safely understand profitable intraday and options trades.
Explain the following live stock / option setup in clear, simple terms suitable for a beginner trader:

Asset: ${symbol} (${name})
Current Price: ₹${ltp} (${changePercent > 0 ? "+" : ""}${changePercent}%)
Volume Multiplier: ${volumeRatio || 2.5}x 10-day Average Volume
Algorithm Signal: ${signal || "Strong Buy"}
Technical Indicators:
- Supertrend (7, 3): ${technicals?.supertrend || "Bullish (Green)"}
- RSI (14): ${technicals?.rsi || "64.5 (Healthy Momentum)"}
- VWAP: ₹${technicals?.vwap || ltp * 0.99} (Trading above VWAP)
- EMA 9 / 21: ${technicals?.emaCross || "Golden Crossover"}
- Key Catalyst: ${technicals?.catalyst || "Pre-market 9:00 AM gap-up breakout & institutional buying"}

Language requested: ${language === "hinglish" ? "Hinglish (Conversational Hindi + English, familiar to Indian retail traders)" : "Simple Beginner English"}

Please structure your response with:
1. **Summary in 2 sentences**: What is happening right now and why this stock/option is growing today.
2. **Beginner Action Plan**: Exact recommended Entry Zone (₹), Stop Loss (₹), Target 1 (₹), and Target 2 (₹) maintaining a strict 1:2 risk-to-reward ratio.
3. **Why It's Moving (The Logic)**: Explain the volume spike, pre-market setup, and VWAP confirmation in plain words without heavy jargon.
4. **Rookie Trap Warning**: What common mistake (e.g., FOMO chasing, late entry, averaging down, forgetting stop-loss) should a beginner strictly avoid on this trade?
5. **Risk Rating**: One of [Low-Medium, Medium, High-Volatility] with 1 sentence rationale.

Keep the tone encouraging, educational, disciplined, and cautious. Format clearly with bullet points.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "Analysis generated successfully.",
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to analyze trade with AI" },
      { status: 500 }
    );
  }
}
