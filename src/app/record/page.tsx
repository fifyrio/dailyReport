'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getApiKey } from '@/lib/storage';
import { VoiceRecorder } from '@/components/VoiceRecorder';

export default function RecordPage() {
  const router = useRouter();
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const apiKey = getApiKey();
    setHasApiKey(!!apiKey);
  }, []);

  const handleComplete = () => {
    router.push('/');
  };

  if (!hasApiKey) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🔑</div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900">需要配置 API Key</h2>
        <p className="text-gray-500 mb-6">
          请先在设置页面配置 OpenAI API Key 才能使用语音转写功能
        </p>
        <a
          href="/settings"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 hover:scale-105 transition-all"
        >
          去设置
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-center mb-6 text-gray-900">语音记录</h1>
      <VoiceRecorder onComplete={handleComplete} />
    </div>
  );
}
