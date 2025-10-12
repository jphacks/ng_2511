export const devUserImage = "/dev/user_image.png";

export interface Diary {
  id: number;
  date: string;
  body: string;
};

export interface InputDiaryProps {
  diary: Diary;
  isEdit: boolean;
  writeDiaryDate: number;
  onSuccess?: () => Promise<void> | void;
}