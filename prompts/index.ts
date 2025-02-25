import { exchangeRateToolPrompt } from "@/tools/currency-tools";
import { hackmdToolPrompt } from "@/tools/hackmd-tools";
import { weatherToolPrompt } from "@/tools/weather-tools";

export const presetPrompts = [
  "查看行程筆記",
  "班機幾點的？",
  "飯店在哪裡？",
  "今天沖繩天氣如何？",
  "現在日幣對台幣的匯率？",
  "拍照或上傳圖片",
];

const basePrompt = "你是個沖繩旅遊達人，你要回答用戶關於沖繩的各種問題";

const responseLanguagePrompt =
  "最後要回答給用戶時，請都使用繁體中文（非簡體中文）。";

export const systemPrompt =
  basePrompt +
  weatherToolPrompt +
  exchangeRateToolPrompt +
  hackmdToolPrompt +
  responseLanguagePrompt;
