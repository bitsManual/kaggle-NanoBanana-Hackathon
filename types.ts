
export interface Moral {
  title: string;
  description: string;
  emoji: string;
}

export interface StoryPage {
  page: number;
  text: string;
  imagePrompt: string;
}

export interface GeneratedPage {
  page: number;
  text: string;
  imageUrl: string;
}

export enum AppState {
  Setup,
  Loading,
  Storybook,
  Error,
}
