interface ImageDisplayProps {
  // 将来的に画像URLを受け取る予定
  imageUrl?: string;
}

export default function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center border-4 border-gray-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="日記の画像"
            className="w-full h-full object-cover rounded-lg"
          />
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
            <p className="text-gray-500 text-sm">画像エリア</p>
            <p className="text-gray-400 text-xs mt-2">
              ※後で日記と対応する画像を表示予定
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
