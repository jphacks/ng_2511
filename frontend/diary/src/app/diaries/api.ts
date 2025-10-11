// API関連の型定義とユーティリティ関数

// APIベースURL（環境変数から取得、デフォルトはローカルFastAPI）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// APIレスポンスの日記エントリ型
export interface DiaryApiEntry {
  id: number;
  user_id: number;
  body: string;
  score: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  date: number;
}

// 表示用の日記エントリ型（APIレスポンスから変換後）
export interface DiaryEntry {
  id: string;
  date: number;
  title: string; // bodyから生成
  content: string; // body
  createdAt: string; // created_at
  updatedAt: string; // updated_at
}

// APIから日記一覧を取得
export async function fetchDiaries(): Promise<DiaryEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/diaries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiData: DiaryApiEntry[] = await response.json();
    
    // APIレスポンスを表示用の形式に変換
    return apiData
      .filter(item => !item.is_deleted) // 削除されていないもののみ
      .map(item => ({
        id: item.id.toString(),
        date: item.date,
        title: generateTitleFromBody(item.body),
        content: item.body,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
  } catch (error) {
    console.error('Failed to fetch diaries:', error);
    throw error;
  }
}

// bodyから簡潔なタイトルを生成
function generateTitleFromBody(body: string): string {
  // 最初の50文字を取得し、改行で区切られた最初の行を優先
  const firstLine = body.split('\n')[0];
  const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  return title || '無題の日記';
}

// 日記が存在する日付の配列を取得
export function getDiaryDates(diaries: DiaryEntry[]): number[] {
  return diaries.map(diary => diary.date);
}

// 特定の日付の日記を取得
export function getDiariesByDate(diaries: DiaryEntry[], date: number): DiaryEntry[] {
  return diaries.filter(diary => diary.date === date);
}

// 日記を日付順（新しい順）でソート
export function sortDiariesByDate(diaries: DiaryEntry[], ascending: boolean = false): DiaryEntry[] {
  return [...diaries].sort((a, b) => {
    return ascending ? a.date - b.date : b.date - a.date;
  });
}

// IDで日記を取得
export function getDiaryById(diaries: DiaryEntry[], id: string): DiaryEntry | undefined {
  return diaries.find(diary => diary.id === id);
}