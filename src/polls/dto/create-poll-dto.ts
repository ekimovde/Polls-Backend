import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { PollCategory, PollColor } from '../model';

export class CreatePollDto {
  @IsString({ message: 'Должно быть строкой!' })
  readonly name: string;

  @IsString({ message: 'Должен быть строкой!' })
  readonly color: PollColor;

  @IsString({ message: 'Должна быть строкой!' })
  readonly category: PollCategory;

  @IsBoolean({ message: 'Должен быть булевым значением!' })
  readonly isPublic: boolean;

  @IsNumber({}, { message: 'Должен быть числом!' })
  readonly userId: number;
}
