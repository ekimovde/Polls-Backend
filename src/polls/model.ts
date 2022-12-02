import { User } from 'src/users/users.model';

export enum PollColor {
  purple = 'purple',
  orange = 'orange',
  green = 'green',
  red = 'red',
  pink = 'pink',
  pinkLight = 'pink-light',
  blue = 'blue',
  grey = 'grey',
}

export enum PollCategory {
  animals = 'Animals',
  art = 'Art',
  books = 'Books',
  colour = 'Colour',
  crypto = 'Crypto',
  days = 'Days',
  drink = 'Drink',
  food = 'Food',
  gaming = 'Gaming',
  healthcare = 'Healthcare',
  history = 'History',
  investment = 'Investment',
  mobileDevelopment = 'Mobile Development',
  movies = 'Movies',
  music = 'Music',
  news = 'News',
  politics = 'Politics',
  random = 'Random',
  science = 'Science',
  social = 'Social',
  startup = 'Startup',
  tv = 'Tv',
  webDesign = 'Web Design',
  webDevelopment = 'Web Development',
  week = 'Week',
}

export enum PollQuestionType {
  text = 'text',
  image = 'image',
  imageText = 'image-text',
  emoji = 'emoji',
}

export interface PollDate {
  month: number;
  day: number;
}

export interface PollTime {
  hour: number;
  minute: number;
}

export interface PollQuestion {
  name: string;
  type: PollQuestionType;
  answers: PollQuestionAnswer[];
  settings: PollQuestionSettings;
}

export interface PollQuestionAnswer {
  text: string;
  type: PollQuestionType;
  image: string;
  emoji: string;
  timestamp?: number;
}

export interface PollQuestionSettings {
  isMultipleAnswers: boolean;
  ownImage: string;
}

export type PollTimestamp = number;
export type PollQuantity = number;

export interface PollVoteResults {
  total: number;
  progress: PollVoteProgress;
  answers: PollQuestionAnswer[];
  users: User[];
  selectedAnswer: number;
}

export type PollVoteProgress = Record<number, number>;
