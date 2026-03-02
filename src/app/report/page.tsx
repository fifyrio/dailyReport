'use client';

import { useState, useEffect } from 'react';
import { getWeekRecords, getMonthRecords } from '@/lib/storage';
import { CATEGORIES, Category, DailyRecord } from '@/types';
import { categoryColors } from '@/lib/styles';

type ViewMode = 'week' | 'month';

export default function ReportPage() {
  const [mode, setMode] = useState<ViewMode>('week');
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (mode === 'week') {
      setRecords(getWeekRecords());
    } else {
      setRecords(getMonthRecords());
    }
  }, [mode]);

  const getTotalCount = (category: Category) => {
    return records.reduce((sum, r) => sum + r.entries[category].length, 0);
  };

  const getAllEntries = (category: Category) => {
    const entries: { date: string; text: string }[] = [];
    records.forEach((r) => {
      r.entries[category].forEach((text) => {
        entries.push({ date: r.date, text });
      });
    });
    return entries;
  };

  const handleCopy = () => {
    const text = generateTextReport();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateTextReport = () => {
    let text = `${mode === 'week' ? '本周' : '本月'}进度报告\n\n`;

    for (const cat of ['app_dev', 'tiktok', 'growth'] as Category[]) {
      const config = CATEGORIES[cat];
      const entries = getAllEntries(cat);
      text += `${config.emoji} ${config.label}: ${entries.length} 条\n`;
      entries.forEach((e) => {
        text += `  - ${e.text}\n`;
      });
      text += '\n';
    }

    return text;
  };

  const categories: Category[] = ['app_dev', 'tiktok', 'growth'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          进度报告
        </h1>

        {/* Segmented toggle */}
        <div className="flex bg-gray-200 rounded-md p-1">
          {(['week', 'month'] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-1.5 text-sm font-medium rounded-md transition-all ${
                mode === m
                  ? 'bg-white text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {m === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const config = CATEGORIES[cat];
          const catColors = categoryColors[cat];
          const count = getTotalCount(cat);
          const entries = getAllEntries(cat);

          return (
            <div
              key={cat}
              className="bg-white rounded-lg overflow-hidden flex"
            >
              {/* Colored left bar */}
              <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: catColors.bg }} />

              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{config.emoji}</span>
                  <h3 className="font-semibold text-lg text-gray-900">{config.label}</h3>
                  <span
                    className="ml-auto px-3 py-0.5 text-sm font-medium rounded-md text-white"
                    style={{ backgroundColor: catColors.bg }}
                  >
                    {count} 条
                  </span>
                </div>

                {entries.length > 0 ? (
                  <div className="space-y-2">
                    {entries.map((entry, idx) => (
                      <div
                        key={idx}
                        className="rounded-md p-3"
                        style={{ backgroundColor: catColors.lightBg }}
                      >
                        <p className="text-sm" style={{ color: catColors.darkText }}>{entry.text}</p>
                        <p className="text-xs mt-1 text-gray-400">{entry.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无记录</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleCopy}
        className="w-full mt-6 py-3 bg-blue-500 text-white rounded-md font-bold text-base transition-all hover:bg-blue-600 hover:scale-[1.01]"
      >
        {copied ? '✅ 已复制到剪贴板' : '📋 复制为文本'}
      </button>
    </div>
  );
}
