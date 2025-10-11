// 共通で使用する型定義をまとめたファイル

export interface DiaryEntry {
  id: string;
  date: string; // YYYY-MM-DD 形式
  title: string;
  content: string;
  createdAt: string;
}

export interface CalendarProps {
  diaryDates: string[];
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export interface DiaryListProps {
  diaries: DiaryEntry[];
  selectedDate: string | null;
}

// API レスポンスの型定義（将来的に使用）
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface DiaryApiResponse extends ApiResponse<DiaryEntry[]> {}

// フォーム関連の型定義
export interface DiaryFormData {
  title: string;
  content: string;
  date: string;
}

// フィルター・ソート関連の型定義
export type SortOrder = 'asc' | 'desc';
export type SortField = 'date' | 'title' | 'createdAt';

export interface FilterOptions {
  dateRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
}