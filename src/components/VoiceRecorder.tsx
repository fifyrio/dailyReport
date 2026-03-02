'use client';

import { useState } from 'react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { transcribeAudio } from '@/lib/whisper';
import { classifyText } from '@/lib/classifier';
import { saveRecord, getApiKey } from '@/lib/storage';
import { Category, CATEGORIES } from '@/types';

interface VoiceRecorderProps {
  onComplete?: () => void;
}

export function VoiceRecorder({ onComplete }: VoiceRecorderProps) {
  const { state, startRecording, stopRecording, isRecording, isProcessing } = useVoiceRecorder();
  const [transcribedText, setTranscribedText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('growth');
  const [error, setError] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleStart = async () => {
    setError('');
    setTranscribedText('');
    setShowResult(false);
    try {
      await startRecording();
    } catch (err) {
      setError('无法访问麦克风，请检查权限');
    }
  };

  const handleStop = async () => {
    try {
      const blob = await stopRecording();

      const apiKey = getApiKey();
      if (!apiKey) {
        setError('请先在设置页面配置 OpenAI API Key');
        return;
      }

      const text = await transcribeAudio(blob, apiKey);
      setTranscribedText(text);

      // Auto-classify
      const category = classifyText(text);
      setSelectedCategory(category);
      setShowResult(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '转写失败');
    }
  };

  const handleSave = () => {
    const today = new Date().toISOString().split('T')[0];
    saveRecord(today, selectedCategory, transcribedText);
    setTranscribedText('');
    setShowResult(false);
    onComplete?.();
  };

  if (showResult) {
    return (
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-4 text-gray-900">
          识别结果
        </h3>

        <div className="bg-gray-50 rounded-md p-4 mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{transcribedText}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500 mb-2">
            选择分类
          </label>
          <div className="flex gap-2">
            {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all ${
                  selectedCategory === cat
                    ? `${CATEGORIES[cat].color}`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {CATEGORIES[cat].emoji} {CATEGORIES[cat].label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-500 text-white rounded-md font-bold text-base transition-all hover:bg-blue-600 hover:scale-105"
        >
          保存记录
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {error && (
        <div className="bg-red-50 text-red-500 px-4 py-3 mb-6 max-w-md rounded-md">
          {error}
        </div>
      )}

      <button
        onMouseDown={handleStart}
        onMouseUp={handleStop}
        onMouseLeave={isRecording ? handleStop : undefined}
        onTouchStart={handleStart}
        onTouchEnd={handleStop}
        disabled={isProcessing}
        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 scale-110'
            : isProcessing
            ? 'bg-gray-300 cursor-wait'
            : 'bg-blue-500 hover:scale-105'
        }`}
      >
        {isProcessing ? (
          <span className="text-white text-2xl">⏳</span>
        ) : (
          <span className="text-3xl">🎙️</span>
        )}
      </button>

      <p className="mt-6 text-gray-500 text-center text-lg">
        {isProcessing ? (
          '正在识别...'
        ) : isRecording ? (
          '松开结束录音'
        ) : (
          '按住说话'
        )}
      </p>
    </div>
  );
}
