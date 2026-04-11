import { Eye, Smartphone, Hand } from "lucide-react";

export const LABEL_MAP = ["Visual", "Auditori", "Kinestetik"];

export const CONFIG = {
  Visual: {
    icon: Eye,
    titleColor: "text-[#0ea5e9]",
    fillBg: "bg-[#0ea5e9]",
    barBg: "bg-[#e0f2fe]",
    textColor: "text-white",
    theme: "blue",
  },
  Auditori: {
    icon: Smartphone,
    titleColor: "text-[#3b82f6]",
    fillBg: "bg-[#3b82f6]",
    barBg: "bg-[#e0f2fe]",
    textColor: "text-white",
    theme: "blue",
  },
  Kinestetik: {
    icon: Hand,
    titleColor: "text-[#ea580c]",
    fillBg: "bg-[#ea580c]",
    barBg: "bg-[#ffedd5]",
    textColor: "text-white",
    theme: "orange",
  },
};

export function buildStyleList(predictionResult) {
  return LABEL_MAP.map((label) => {
    const prob = predictionResult.all_probabilities
      ? predictionResult.all_probabilities[label]
      : label === predictionResult.result
        ? parseFloat(predictionResult.percentage) / 100
        : 0;
    return {
      label,
      probability: prob ?? 0,
      percentage: ((prob ?? 0) * 100).toFixed(0),
    };
  });
}
