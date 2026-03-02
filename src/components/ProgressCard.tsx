'use client';

import { Category, CATEGORIES, DailyRecord } from '@/types';
import { categoryColors } from '@/lib/styles';

interface ProgressCardProps {
  category: Category;
  record: DailyRecord | null;
  index?: number;
}

export function ProgressCard({ category, record }: ProgressCardProps) {
  const config = CATEGORIES[category];
  const catColors = categoryColors[category];
  const entries = record?.entries[category] || [];
  const count = entries.length;
  const latestEntry = entries[entries.length - 1];

  return (
    <div
      className="relative rounded-lg p-5 transition-transform duration-200 hover:scale-[1.02] overflow-hidden"
      style={{ backgroundColor: catColors.bg }}
    >
      {/* Ghost count */}
      <div className="absolute top-3 right-4 text-7xl font-extrabold text-white/20 leading-none select-none">
        {count}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{config.emoji}</span>
          <h3 className="font-semibold text-lg text-white">{config.label}</h3>
        </div>

        <div className="text-4xl font-extrabold text-white mb-2">{count}</div>

        <div className="text-sm text-white/80">
          {latestEntry ? (
            <p className="line-clamp-2">{latestEntry}</p>
          ) : (
            <p className="italic">暂无记录</p>
          )}
        </div>
      </div>
    </div>
  );
}
