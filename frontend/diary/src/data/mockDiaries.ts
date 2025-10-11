
// DiaryEntry型をここで定義（dateは8桁のint型）
export interface DiaryEntry {
  id: string;
  date: number; // yyyymmdd 形式
  title: string;
  content: string;
  createdAt: string;
}


// ダミー日記データ
export const mockDiaries: DiaryEntry[] = [
  {
    id: '1',
    date: 20241215,
    title: '今日の出来事',
    content: '今日はとても良い天気でした。散歩をして、新しいカフェを発見しました。コーヒーがとても美味しくて、また行きたいと思います。店員さんもとても親切で、居心地の良い場所でした。',
    createdAt: '2024-12-15T10:30:00+09:00'
  },
  {
    id: '2',
    date: 20241214,
    title: 'プロジェクトの進捗',
    content: 'Next.jsでの開発が順調に進んでいます。新機能の実装も完了しました。TypeScriptとTailwind CSSの組み合わせがとても開発しやすく、効率的にコーディングできています。',
    createdAt: '2024-12-14T18:45:00+09:00'
  },
  {
    id: '3',
    date: 20241212,
    title: '読書記録',
    content: '新しい技術書を読み始めました。ReactとTypeScriptについて詳しく学べそうです。特にHooksの使い方やパフォーマンス最適化について深く理解できそうで楽しみです。',
    createdAt: '2024-12-12T21:15:00+09:00'
  },
  {
    id: '4',
    date: 20241210,
    title: '友人との時間',
    content: '久しぶりに大学時代の友人と会いました。お互いの近況を報告し合い、懐かしい話で盛り上がりました。時間があっという間に過ぎて、また近いうちに会う約束をしました。',
    createdAt: '2024-12-10T20:30:00+09:00'
  },
  {
    id: '5',
    date: 20241208,
    title: '新しい趣味',
    content: '写真撮影を始めることにしました。カメラを購入して、まずは近所の公園で練習してみました。光の使い方や構図について学ぶことがたくさんあって、とても興味深いです。',
    createdAt: '2024-12-08T16:20:00+09:00'
  },
  {
    id: '6',
    date: 20241205,
    title: '料理の挑戦',
    content: '初めてパスタを一から作ってみました。生地作りから始めて、手こねで仕上げました。思ったより時間がかかりましたが、出来上がった時の達成感は格別でした。味も満足いく仕上がりでした。',
    createdAt: '2024-12-05T19:45:00+09:00'
  },
  {
    id: '7',
    date: 20241203,
    title: '映画鑑賞',
    content: '話題の映画を観に行きました。ストーリーが素晴らしく、最後まで飽きることなく楽しめました。映像美も印象的で、また映画館で観る価値がある作品でした。',
    createdAt: '2024-12-03T22:10:00+09:00'
  },
  {
    id: '8',
    date: 20241201,
    title: '12月のスタート',
    content: '今年も残り1ヶ月となりました。今月の目標を立てて、充実した時間を過ごしたいと思います。健康管理と新しいスキルの習得に重点を置いて頑張ります。',
    createdAt: '2024-12-01T09:15:00+09:00'
  },
  {
    id: '9',
    date: 20241128,
    title: 'ワークショップ参加',
    content: 'プログラミングのワークショップに参加しました。新しい技術について学ぶことができ、他の参加者との交流も有意義でした。学んだことを今後のプロジェクトに活かしていきたいです。',
    createdAt: '2024-11-28T17:30:00+09:00'
  },
  {
    id: '10',
    date: 20241125,
    title: '家族との時間',
    content: '実家に帰って家族と過ごしました。久しぶりに母の手料理を食べて、懐かしい味に心が温まりました。家族の大切さを改めて感じる一日でした。',
    createdAt: '2024-11-25T21:00:00+09:00'
  }
];

// 日記が存在する日付の配列を取得する関数
export const getDiaryDates = (): number[] => {
  return mockDiaries.map(diary => diary.date);
};

// 特定の日付の日記を取得する関数
export const getDiariesByDate = (date: number): DiaryEntry[] => {
  return mockDiaries.filter(diary => diary.date === date);
};

// IDで日記を取得する関数
export const getDiaryById = (id: string): DiaryEntry | undefined => {
  return mockDiaries.find(diary => diary.id === id);
};

// 日記を日付順（新しい順）でソートする関数
export const sortDiariesByDate = (diaries: DiaryEntry[], ascending: boolean = false): DiaryEntry[] => {
  return [...diaries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};