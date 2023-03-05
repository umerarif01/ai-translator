import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

const openai = new OpenAIApi(configuration);

type Data = {
  prompt?: string;
  success?: boolean;
  data?: string;
  error?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { prompt, currentModel } = req.body;

  try {
    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${prompt}`,
      max_tokens: 1000,
      temperature: 0.5,
    });

    res.status(200).json({
      success: true,
      data: response.data.choices[0].text,
    });
  } catch (error) {
    if (error) {
      console.log(error);
    }
    res.status(400).json({
      success: false,
      error: "Failed to translate",
    });
  }
}
