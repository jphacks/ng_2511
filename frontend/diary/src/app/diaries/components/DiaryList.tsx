'use client';

import Link from 'next/link';
import { DiaryEntry } from '../api';
import { redirect, RedirectType } from 'next/navigation';

interface DiaryListProps {
  diaries: DiaryEntry[];
  selectedDate: number | null;
  onDateSelect?: (date: number) => void;
  intToDateString: (dateInt: number) => string;
}

export default function DiaryList({ diaries, selectedDate, onDateSelect, intToDateString }: DiaryListProps) {
  // 日付を日本語形式でフォーマット（int型日付→YYYY-MM-DD→Date→日本語）
  const formatDate = (dateInt: number) => {
    const s = intToDateString(dateInt);
    const date = new Date(s);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  // 作成日時をフォーマット
  const formatCreatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 更新日時をフォーマット
  const formatUpdatedAt = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // コンテンツを省略表示
  // 個別日付選択時はmaxLengthを緩く（例: 100文字）、それ以外は30文字
  const truncateContent = (content: string) => {
    const maxLength = selectedDate ? 100 : 30;
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (diaries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">
          {selectedDate
            ? `${formatDate(selectedDate)}の日記はありません`
            : '日記がありません'}
        </p>
        {selectedDate && (
          <div className="mt-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新しい日記を作成
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedDate && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
          <p className="text-emerald-800 text-sm font-medium">
            {formatDate(selectedDate)}の日記を表示中
          </p>
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {diaries.map((diary) => (
          <div
            key={diary.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white cursor-pointer"
            onClick={() => onDateSelect && onDateSelect(diary.date)}
          >
            {/* ヘッダー部分 */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {diary.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(diary.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    更新: {formatUpdatedAt(diary.updatedAt)}
                  </span>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <button
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="削除"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* コンテンツ部分 */}
            <div className="text-gray-700">
              <p>{truncateContent(diary.content)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 一覧のフッター：特定日付選択時は非表示 */}
      {!selectedDate && (
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {diaries.length}件の日記
          </p>
        </div>
      )}
    </div>
  );
}