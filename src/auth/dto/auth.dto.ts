import { IsString, Length, IsEmail } from 'class-validator';
import {
  passwordMaxLength,
  passwordMinLength,
} from 'src/users/dto/create-user.dto';

export class AuthDto {
  @IsString({ message: 'Должен быть строкой!' })
  @IsEmail({}, { message: 'Некорректный Email!' })
  readonly email: string;

  @IsString({ message: 'Должен быть строкой!' })
  @Length(passwordMinLength, passwordMaxLength, {
    message: `Должен быть не меньше ${passwordMinLength} и не больше ${passwordMaxLength}!`,
  })
  readonly password: string;
}
