import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import RefreshTokenAuthDto from './dto/refresh-token-auth.dto';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { Request } from 'express';
import { AuthJwtGuard } from 'src/common/guards/auth.guard';
import { AuthTokenPayload } from 'src/shared/constants';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() authDto: AuthDto) {
    return getResponseForm(await this.authService.signIn(authDto));
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return getResponseForm(await this.authService.signUp(createUserDto));
  }

  @Get('/logout')
  @UseGuards(AuthJwtGuard)
  async logout(@Req() request: Request) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    await this.authService.logout(user.id);
  }

  @Post('/refresh')
  async refreshTokens(@Body() refreshDto: RefreshTokenAuthDto) {
    return getResponseForm(
      await this.authService.refreshTokens(refreshDto.refresh_token),
    );
  }
}
