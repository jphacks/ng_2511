import React from 'react';
import { formatDateToSimpleJapanese } from '@/utils/dateFormat';

interface GalleryHeaderProps {
  currentDate: number | null;
}

export default function GalleryHeader({ currentDate }: GalleryHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">ギャラリー</h1>
      <p className="text-2xl text-gray-600">{currentDate ? formatDateToSimpleJapanese(currentDate) : ''}</p>
    </div>
  );
}
