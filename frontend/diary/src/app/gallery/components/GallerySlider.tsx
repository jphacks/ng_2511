import { useRef, useState, useEffect } from 'react';
import { formatDateToSimpleJapanese } from '@/utils/dateFormat';

interface GallerySliderProps {
  currentIndex: number;
  totalCount: number;
  dates: number[]; // array of yyyymmdd dates, length === totalCount
  onChange: (index: number) => void;
}

export default function GallerySlider({
  currentIndex,
  totalCount,
  dates,
  onChange
}: GallerySliderProps) {
  const sliderRef = useRef<HTMLInputElement | null>(null);
  const [labelLeftPercent, setLabelLeftPercent] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    const min = Number(sliderRef.current.min) || 0;
    const max = Number(sliderRef.current.max) || Math.max(1, totalCount - 1);
    const range = max - min;
    const value = Math.min(Math.max(currentIndex, min), max);
    const percent = range > 0 ? ((value - min) / range) * 100 : 0;
    setLabelLeftPercent(percent);
  }, [currentIndex, totalCount]);

  // hovered index when moving over the slider
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const computeIndexFromClientX = (clientX: number) => {
    const el = sliderRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left; // px from left
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    const idx = Math.round(pct * Math.max(0, totalCount - 1));
    return idx;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const idx = computeIndexFromClientX(e.clientX);
    if (idx === null) return;
    setHoveredIndex(idx);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const idx = computeIndexFromClientX(touch.clientX);
    if (idx === null) return;
    setHoveredIndex(idx);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          過去
        </span>
        <div className="flex-1 relative">
          <div className="relative">
            <input
              ref={sliderRef}
              type="range"
              min={0}
              max={Math.max(0, totalCount - 1)}
              value={currentIndex}
              onChange={handleChange}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => { setIsInteracting(false); setHoveredIndex(null); }}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => { setIsInteracting(false); setHoveredIndex(null); }}
              onTouchMove={handleTouchMove}
              className="w-full h-3 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                accentColor: '#3b82f6'
              }}
            />

            {/* current/hover date label that follows the thumb */}
            <div
              className="pointer-events-none absolute -top-10"
              style={{
                left: `${labelLeftPercent}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="text-xs text-gray-700 bg-white px-2 py-0.5 rounded whitespace-nowrap">
                {isInteracting && hoveredIndex !== null
                  ? (dates[hoveredIndex] ? formatDateToSimpleJapanese(dates[hoveredIndex]) : '')
                  : (dates[currentIndex] ? formatDateToSimpleJapanese(dates[currentIndex]) : '')}
              </span>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <span className="text-xs text-gray-500">
              {dates.length > 0 ? formatDateToSimpleJapanese(dates[0]) : ''}
            </span>
            <span className="text-xs text-gray-500">
              {dates.length > 0 ? formatDateToSimpleJapanese(dates[dates.length - 1]) : ''}
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
          現在
        </span>
      </div>

      {/* スタイル */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }

        .slider::-moz-range-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
