// 日付フォーマット用のユーティリティ関数

/**
 * int型日付をYYYY-MM-DD文字列に変換
 * @param dateInt - yyyymmdd形式のnumber (例: 20241215)
 * @returns YYYY-MM-DD形式の文字列 (例: "2024-12-15")
 */
export function intToDateString(dateInt: number): string {
  const s = dateInt.toString();
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/**
 * int型日付を日本語形式でフォーマット
 * @param dateInt - yyyymmdd形式のnumber (例: 20241215)
 * @returns 日本語形式の日付文字列 (例: "2024年12月15日 金曜日")
 */
export function formatDateToJapanese(dateInt: number): string {
  const s = intToDateString(dateInt);
  const date = new Date(s);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
}

/**
 * int型日付をシンプルな日本語形式でフォーマット (曜日なし)
 * @param dateInt - yyyymmdd形式のnumber (例: 20241215)
 * @returns 日本語形式の日付文字列 (例: "2024年12月15日")
 */
export function formatDateToSimpleJapanese(dateInt: number): string {
  const dateStr = dateInt.toString();
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  return `${year}年${month}月${day}日`;
}
