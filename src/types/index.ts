export interface DailyRecord {
  date: string;
  entries: {
    app_dev: string[];
    tiktok: string[];
    growth: string[];
  };
}

export type Category = 'app_dev' | 'tiktok' | 'growth';

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string; accentBg: string; accentText: string }> = {
  app_dev: { label: 'App 开发', emoji: '📱', color: 'bg-blue-500 text-white', accentBg: 'bg-blue-50', accentText: 'text-blue-800' },
  tiktok: { label: 'TikTok 视频', emoji: '🎬', color: 'bg-emerald-500 text-white', accentBg: 'bg-emerald-50', accentText: 'text-emerald-800' },
  growth: { label: '自我成长', emoji: '🌱', color: 'bg-amber-500 text-white', accentBg: 'bg-amber-50', accentText: 'text-amber-800' },
};

export interface AppState {
  apiKey: string;
  records: Record<string, DailyRecord>;
}
