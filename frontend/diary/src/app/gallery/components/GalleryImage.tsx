import React from 'react';
import Image from 'next/image';
import { ImageData } from '@/types';

interface Props {
  imageData?: ImageData | null;
}

export default function GalleryImage({ imageData }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-4 border-gray-300 overflow-hidden">
        {imageData ? (
          <div className="relative w-full h-full">
            <Image
              src={imageData.uri}
              alt="日記の画像"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        ) : (
          <div className="text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">この日記に画像はまだありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
