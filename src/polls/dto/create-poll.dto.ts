import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import {
  PollCategory,
  PollColor,
  PollDate,
  PollQuestion,
  PollTime,
} from '../model';

export class CreatePollDto {
  @IsString({ message: 'Должно быть строкой!' })
  readonly name: string;

  @IsString({ message: 'Должен быть строкой!' })
  readonly color: PollColor;

  @IsString({ message: 'Должна быть строкой!' })
  readonly category: PollCategory;

  @IsNotEmpty({ message: 'Должно быть заполнено!' })
  readonly date: PollDate;

  @IsNotEmpty({ message: 'Должно быть заполнено!' })
  readonly time: PollTime;

  @IsNotEmpty({ message: 'Должно быть заполнено!' })
  readonly question: PollQuestion;

  @IsBoolean({ message: 'Должен быть булевым значением!' })
  readonly isPublic: boolean;

  readonly isPollEnded?: boolean;

  readonly userId?: number;
}
