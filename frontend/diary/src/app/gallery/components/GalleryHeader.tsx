import React from 'react';
import { formatDateToSimpleJapanese } from '@/utils/dateFormat';

interface GalleryHeaderProps {
  oldestDate: number | null;
  newestDate: number | null;
}

export default function GalleryHeader({ oldestDate, newestDate }: GalleryHeaderProps) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">これまでの思い出</h1>
      <p className="text-2xl text-gray-600">
        {oldestDate && newestDate 
          ? `${formatDateToSimpleJapanese(oldestDate)} 〜 ${formatDateToSimpleJapanese(newestDate)}`
          : ''}
      </p>
    </div>
  );
}
