'use client';

import { useState, useEffect } from 'react';
import { DiaryEntry, fetchDiaries, sortDiariesByDate } from '@/api/diaries';
import GallerySlider from './components/GallerySlider';
import GalleryHeader from './components/GalleryHeader';
import GalleryImage from './components/GalleryImage';
import DiaryCard from './components/DiaryCard';
import { LoadingState, ErrorState, EmptyState } from './components/StatusDisplay';

export default function GalleryPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 現在表示している日記のインデックス
  const [currentIndex, setCurrentIndex] = useState(0);

  // APIから日記データを取得
  useEffect(() => {
    const loadDiaries = async () => {
      try {
        setLoading(true);
        const fetchedDiaries = await fetchDiaries();
        const sortedDiaries = sortDiariesByDate(fetchedDiaries, true); // 古い順にソート
        setDiaries(sortedDiaries);
        setError(null);
      } catch (err) {
        console.error('Error loading diaries:', err);
        setError('日記の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    loadDiaries();
  }, []);
  
  // 現在の日記（日記がない場合はnull）
  const currentDiary = diaries.length > 0 ? diaries[currentIndex] : null;

  // ローディング中の表示
  if (loading) return <LoadingState />;

  // エラー時の表示
  if (error) return <ErrorState error={error} />;

  // 日記がない場合の表示
  if (diaries.length === 0) return <EmptyState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <GalleryHeader 
          oldestDate={diaries.length > 0 ? diaries[0].date : null}
          newestDate={diaries.length > 0 ? diaries[diaries.length - 1].date : null}
        />

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* 左：画像 */}
          <GalleryImage />

          {/* 右：日記カード */}
          <DiaryCard diary={currentDiary} />
        </div>

        {/* 下：スクロールバー */}
        {/* dates配列を渡して、slider上のhoverで日付を表示できるようにする */}
        <GallerySlider
          currentIndex={currentIndex}
          totalCount={diaries.length}
          dates={diaries.map(d => d.date)}
          onChange={(idx) => setCurrentIndex(idx)}
        />
      </div>
    </div>
  );
}
