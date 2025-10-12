export const devUserImage = "/dev/user_image.png";

export interface Diary {
  id: number;
  date: string;
  body: string;
};

export interface HomePageProps {
  diary: Diary;
  isEdit: boolean;
}