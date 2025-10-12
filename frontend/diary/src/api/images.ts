// 画像API関連の型定義とユーティリティ関数

import { ImageData } from '@/types';

// APIベースURL（環境変数から取得、デフォルトはローカルFastAPI）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * すべての画像を取得
 * @returns 画像データの配列
 */
export async function fetchAllImages(): Promise<ImageData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/all_images`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageData: ImageData[] = await response.json();
    
    // 削除されていないもののみ返す
    return imageData.filter(image => !image.is_deleted);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    throw error;
  }
}

/**
 * diary_idから画像を取得
 * @param images すべての画像データ
 * @param diaryId 日記ID
 * @returns 該当する画像データ、存在しない場合はundefined
 */
export function getImageByDiaryId(images: ImageData[], diaryId: string | number): ImageData | undefined {
  const id = typeof diaryId === 'string' ? parseInt(diaryId, 10) : diaryId;
  return images.find(image => image.diary_id === id);
}

/**
 * 複数のdiary_idから画像のマップを作成
 * @param images すべての画像データ
 * @returns diary_idをキーとした画像データのマップ
 */
export function createImageMapByDiaryId(images: ImageData[]): Map<number, ImageData> {
  const map = new Map<number, ImageData>();
  images.forEach(image => {
    map.set(image.diary_id, image);
  });
  return map;
}
