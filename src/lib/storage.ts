import { DailyRecord, Category } from '@/types';

const STORAGE_KEY = 'progress_tracker_records';
const API_KEY_KEY = 'progress_tracker_api_key';

export function getRecords(): Record<string, DailyRecord> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveRecords(records: Record<string, DailyRecord>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getRecord(date: string): DailyRecord | null {
  const records = getRecords();
  return records[date] || null;
}

export function saveRecord(date: string, category: Category, text: string): DailyRecord {
  const records = getRecords();
  
  if (!records[date]) {
    records[date] = {
      date,
      entries: {
        app_dev: [],
        tiktok: [],
        growth: [],
      },
    };
  }
  
  records[date].entries[category].push(text);
  saveRecords(records);
  
  return records[date];
}

export function getWeekRecords(): DailyRecord[] {
  const records = getRecords();
  const today = new Date();
  const weekRecords: DailyRecord[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (records[dateStr]) {
      weekRecords.push(records[dateStr]);
    } else {
      weekRecords.push({ date: dateStr, entries: { app_dev: [], tiktok: [], growth: [] } });
    }
  }
  
  return weekRecords;
}

export function getMonthRecords(): DailyRecord[] {
  const records = getRecords();
  const today = new Date();
  const monthRecords: DailyRecord[] = [];
  
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  for (let i = daysInMonth - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    if (records[dateStr]) {
      monthRecords.push(records[dateStr]);
    } else {
      monthRecords.push({ date: dateStr, entries: { app_dev: [], tiktok: [], growth: [] } });
    }
  }
  
  return monthRecords;
}

export function saveApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_KEY, key);
}

export function getApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_KEY_KEY) || '';
}

export function exportData(): string {
  return JSON.stringify(getRecords(), null, 2);
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
