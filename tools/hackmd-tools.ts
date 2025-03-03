import { ToolSet } from "ai";
import { z } from "zod";

const apiUrl = "https://hackmd.io/@cloCLQP3TvuF9hXh3g1xNA/SyxG4FPG1g";

const hackmdSchema = z.object({
  url: z.string().url().describe("HackMD 文檔的 URL"),
});

export const hackmdToolPrompt =
  "當用戶詢問行程、班機、飯店或其他旅行相關信息時，你應該使用 getHackmdContent 工具獲取已經已有的 HackMD 內容。" +
  "獲取內容後，不要馬上完整展示你得知的所有內容，簡單問用戶想要知道什麼即可。";

export const hackmdTools: ToolSet = {
  getHackmdContent: {
    description: "直接透過已經給定的 hackmd url 獲取內容",
    parameters: hackmdSchema,
    execute: async () => {
      const response = await fetch(`${apiUrl}/download`);

      if (!response.ok) {
        throw new Error(`HackMD error: ${response.statusText}`);
      }

      const content = await response.text();

      return {
        content,
        source: apiUrl,
      };
    },
  },
};
