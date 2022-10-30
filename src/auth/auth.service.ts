import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload, AuthTokensData } from 'src/shared/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthTokensData> {
    const userExists = await this.userService.findByEmail(createUserDto.email);

    if (userExists) {
      throw new HttpException(
        'Пользователь с таким Email уже существует!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashData(createUserDto.password);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = await this.generateTokens(newUser.id, newUser.email);

    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signIn(authDto: AuthDto): Promise<AuthTokensData> {
    const user = await this.userService.findByEmail(authDto.email);

    if (!user) {
      throw new HttpException(
        'Пользователь с таким Email не найден!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );

    if (!passwordMatches) {
      throw new HttpException('Пароль не совпадает!', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    await this.userService.update(userId, { refreshToken: null });
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokensData> {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const tokenData = this.validateRefreshToken(refreshToken);
    const user = await this.userService.findById(tokenData.id);

    if (!tokenData || !user) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async generateTokens(userId: number, email: string): Promise<AuthTokensData> {
    const payload: AuthTokenPayload = { id: userId, email };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload),
      this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.EXPIRES_IN_REFRESH,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async hashData(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  validateAccessToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  validateRefreshToken(refreshToken: string): AuthTokenPayload {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
