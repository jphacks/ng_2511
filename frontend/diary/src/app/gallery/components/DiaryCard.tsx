import React from 'react';
import { DiaryEntry } from '@/api/diaries';
import { formatDateToSimpleJapanese } from '@/utils/dateFormat';

interface Props {
  diary?: DiaryEntry | null;
}

export default function DiaryCard({ diary }: Props) {
  if (!diary) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">日記が選択されていません。</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="h-full flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-emerald-500 pb-2">{diary.title}</h2>
        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{diary.content}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">日付: {formatDateToSimpleJapanese(diary.date)}</p>
        </div>
      </div>
    </div>
  );
}
