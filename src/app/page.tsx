'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecord } from '@/lib/storage';
import { ProgressCard } from '@/components/ProgressCard';
import { Category } from '@/types';

export default function HomePage() {
  const [record, setRecord] = useState<ReturnType<typeof getRecord> | null>(null);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDateStr(today);
    setRecord(getRecord(today));
  }, []);

  const today = new Date();
  const dateDisplay = today.toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const categories: Category[] = ['app_dev', 'tiktok', 'growth'];

  return (
    <div className="relative overflow-hidden">
      {/* Geometric circle decorations */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-500/5 pointer-events-none" />
      <div className="absolute top-40 -left-32 w-80 h-80 rounded-full bg-emerald-500/5 pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-48 h-48 rounded-full bg-amber-500/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            今日进度
          </h1>
          <p className="text-gray-500 text-lg">{dateDisplay}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((cat, i) => (
            <ProgressCard key={cat} category={cat} record={record} index={i} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/record"
            className="flex items-center gap-2 px-8 py-3 bg-blue-500 text-white rounded-md font-bold text-lg transition-all hover:bg-blue-600 hover:scale-105"
          >
            <span>🎙️</span>
            <span>语音记录</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
