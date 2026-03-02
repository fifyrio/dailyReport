'use client';

import { useState, useEffect } from 'react';
import { getApiKey, saveApiKey, exportData, clearAllData } from '@/lib/storage';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setApiKey(key);
  }, []);

  const handleSaveApiKey = () => {
    saveApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearAllData();
    setShowClearConfirm(false);
    alert('数据已清空');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        设置
      </h1>

      {/* API Key Card */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          🔑 OpenAI API Key
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          用于语音转文字 (Whisper)。Key 只保存在本地浏览器中，不会上传到任何服务器。
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="flex-1 px-4 py-2 rounded-md border border-transparent bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-5 py-2 bg-blue-500 text-white rounded-md font-bold transition-all hover:bg-blue-600 hover:scale-105"
          >
            {saved ? '✅ 已保存' : '保存'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          获取 API Key:{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            openai.com/platform
          </a>
        </p>
      </div>

      {/* Data Management Card */}
      <div className="bg-white rounded-lg p-6 mb-4">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          💾 数据管理
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md font-medium transition-all hover:bg-gray-200 hover:scale-105"
          >
            📤 导出数据
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex-1 py-2 px-4 bg-red-50 text-red-500 rounded-md font-medium transition-all hover:bg-red-500 hover:text-white hover:scale-105"
          >
            🗑️ 清空数据
          </button>
        </div>
      </div>

      {/* About Card */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          ℹ️ 关于
        </h2>
        <p className="text-sm text-gray-500">
          进度追踪 v1.0<br />
          本地存储，无云端同步
        </p>
      </div>

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              确认清空？
            </h3>
            <p className="text-gray-500 mb-4">
              此操作不可恢复，所有记录将被永久删除。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-md font-medium transition-all hover:bg-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2 bg-red-500 text-white rounded-md font-medium transition-all hover:bg-red-600"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
