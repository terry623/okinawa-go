import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWeatherIcon = (weather: string) => {
  const weatherLower = weather.toLowerCase();
  if (weatherLower.includes("sun") || weatherLower.includes("clear")) {
    return "☀️";
  } else if (weatherLower.includes("cloud")) {
    return "☁️";
  } else if (weatherLower.includes("rain")) {
    return "🌧️";
  } else if (weatherLower.includes("snow")) {
    return "❄️";
  } else if (
    weatherLower.includes("storm") ||
    weatherLower.includes("thunder")
  ) {
    return "⛈️";
  } else {
    return "🌤️";
  }
};
