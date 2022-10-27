import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user-dto';
import { AuthGenerateToken } from './model';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthGenerateToken> {
    return await this.authService.login(loginUserDto);
  }

  @Post('/registration')
  async registration(
    @Body() registrationUserDto: CreateUserDto,
  ): Promise<AuthGenerateToken> {
    return await this.authService.registration(registrationUserDto);
  }

  @Post('/update-access-token')
  async updateAccessToken(@Body() body) {
    return await this.authService.updateAccessToken(body);
  }

  @Get('/logout')
  async logout() {
    //
  }
}
