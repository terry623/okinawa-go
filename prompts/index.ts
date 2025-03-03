import { exchangeRateToolPrompt } from "@/tools/currency-tools";
import { hackmdToolPrompt } from "@/tools/hackmd-tools";
import { weatherToolPrompt } from "@/tools/weather-tools";

export const presetPrompts = [
  "查看行程筆記",
  "班機幾點的？",
  "飯店在哪裡？",
  "今天沖繩天氣如何？",
  "現在日幣對台幣的匯率？",
];

const responseLanguagePrompt =
  "最後要回答給用戶時，請都使用繁體中文（非簡體中文）。";

export const systemPrompt =
  "你是個沖繩旅遊達人，你要回答用戶關於沖繩的各種問題" +
  weatherToolPrompt +
  exchangeRateToolPrompt +
  hackmdToolPrompt +
  responseLanguagePrompt;

export const imageAnalysisPrompt =
  "若圖片上有日文或英文，請翻譯成繁體中文。" +
  "並分析圖片內容並給出分析結果。" +
  "如果照片中有商品價格資訊，請換算成台幣的價格並告知，若沒有就不用特別說到。" +
  "請用純文字回應，不要有 markdown 的格式（例如 ** 表示粗體）。" +
  responseLanguagePrompt;
