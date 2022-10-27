import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.model';
import { AuthGenerateToken } from './model';
import { CreateUserDto } from 'src/users/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const data = await this.validateUser(loginUserDto);

    return this.createToken(data);
  }

  async registration(
    registrationUserDto: CreateUserDto,
  ): Promise<AuthGenerateToken> {
    const candidate = await this.userService.getUserByEmail(
      registrationUserDto.email,
    );

    if (candidate) {
      throw new HttpException(
        'Пользователь с таким Email уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(registrationUserDto.password, 5);
    const data = await this.userService.create({
      ...registrationUserDto,
      password: hashPassword,
    });

    return this.createToken(data.response);
  }

  async updateAccessToken(body) {
    //
  }

  private createToken(user: User): AuthGenerateToken {
    const { id, email } = user;

    const payload = { id, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.PRIVATE_KEY_REFRESH,
      expiresIn: process.env.EXPIRES_IN_REFRESH,
    });

    return {
      expiresIn: process.env.EXPIRES_IN_ACCESS,
      accessToken,
      refreshToken,
      expiresInRefresh: process.env.EXPIRES_IN_REFRESH,
    };
  }

  private async validateUser(userDto: LoginUserDto): Promise<User> {
    const data = await this.userService.getUserByEmail(userDto.email);

    const hasResponse = Boolean(data.response);
    const isPasswordEquals = await bcrypt.compare(
      userDto.password,
      data.response.password,
    );

    if (!hasResponse || !isPasswordEquals) {
      throw new UnauthorizedException({
        message: 'Некорректный Email или Пароль!',
      });
    }

    return data.response;
  }
}
