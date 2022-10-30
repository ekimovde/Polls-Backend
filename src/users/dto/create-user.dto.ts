import { IsString, Length, IsEmail, Matches } from 'class-validator';

export const passwordMinLength = 4;
export const passwordMaxLength = 16;

export const regexForTelegramNickname = /^[A-Za-z\d_]{5,32}$/;

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой!' })
  readonly firstName: string;

  @IsString({ message: 'Должно быть строкой!' })
  readonly lastName: string;

  @IsString({ message: 'Должен быть строкой!' })
  @Matches(regexForTelegramNickname, {
    message: 'Никнейм не соответствует требованиям!',
  })
  readonly nickName: string;

  @IsString({ message: 'Должен быть строкой!' })
  @IsEmail({}, { message: 'Некорректный Email!' })
  readonly email: string;

  @IsString({ message: 'Должен быть строкой!' })
  @Length(passwordMinLength, passwordMaxLength, {
    message: `Должен быть не меньше ${passwordMinLength} и не больше ${passwordMaxLength}!`,
  })
  readonly password: string;

  @IsString({ message: 'Должен быть строкой!' })
  readonly refreshToken?: string;
}
