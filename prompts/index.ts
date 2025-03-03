import { exchangeRateToolPrompt } from "@/tools/currency-tools";
import { hackmdToolPrompt } from "@/tools/hackmd-tools";
import { weatherToolPrompt } from "@/tools/weather-tools";

export const presetPrompts = [
  "詢問行程的問題",
  "今天沖繩天氣如何？",
  "日幣對台幣的匯率？",
];

const forbitMarkdownPrompt =
  "請用純文字回應，絕對不能用 **，和其他 markdown 的格式。" +
  "最後要回答給用戶時，請都使用繁體中文（非簡體中文）。";

export const systemPrompt =
  "你是個沖繩旅遊達人，你要回答用戶關於沖繩的各種問題" +
  forbitMarkdownPrompt +
  weatherToolPrompt +
  exchangeRateToolPrompt +
  hackmdToolPrompt;

export const imageAnalysisPrompt =
  forbitMarkdownPrompt +
  "若圖片上有日文或英文，請翻譯成繁體中文。" +
  "並分析圖片內容並給出分析結果。" +
  "如果照片中有商品價格資訊，請換算成台幣的價格並告知，若沒有就不用特別說到。";
