import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth-jwt-guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { ApiWrapper } from 'src/shared/constants';
import { CreateUserDto } from './dto/create-user-dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthJwtGuard)
  async getUsers(): Promise<ApiWrapper<User[]>> {
    return this.usersService.getUsers();
  }

  @Post()
  @UseGuards(AuthJwtGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() userDto: CreateUserDto): Promise<ApiWrapper<User>> {
    return this.usersService.create(userDto);
  }
}
