import { apiModel } from "@/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { imageAnalysisPrompt } from "@/prompts";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const response = await openai.chat.completions.create({
      model: apiModel,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: imageAnalysisPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    return NextResponse.json({
      analysis: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
