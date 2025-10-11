export async function getDiaryByDate(date: string): Promise<string> {
  try {
    const res = await fetch(`/diaries/${date}`, {
      method: 'GET',
    });

    if (!res.ok) {
    //   console.error(`Failed to fetch diary for ${date}:`, res.statusText);
      return "";
    }

    const data: { body: string } = await res.json();
    return data.body;
  } catch (error) {
    console.error(`Error fetching diary for ${date}:`, error);
    return "";
  }
}

export async function getDiaryMassage(date: string = new Date().toISOString().split("T")[0]): Promise<string> {
    const diary = await getDiaryByDate(date);
    if (diary) {
      return "日記の続きを書く";
    } else {
      return "新しい日記を書く";
    }
}