import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Req,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthJwtGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthTokenPayload } from 'src/shared/constants';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreateUserDto } from './dto/create-user.dto';
import { PasswordUserDto } from './dto/password-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthJwtGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
    return getResponseForm(this.usersService.create(createUserDto));
  }

  @Get()
  @UseGuards(AuthJwtGuard)
  async findAll() {
    return getResponseForm(await this.usersService.findAll());
  }

  @Patch('set-user-info')
  @UseGuards(AuthJwtGuard)
  async update(@Req() request: Request, @Body() updateUserDto: UpdateUserDto) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(
      await this.usersService.update(user.id, updateUserDto),
    );
  }

  @Patch('set-user-password')
  @UseGuards(AuthJwtGuard)
  async setUserPassword(
    @Req() request: Request,
    @Body() passwordUserDto: PasswordUserDto,
  ) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(
      await this.usersService.setUserPassword(user.id, passwordUserDto),
    );
  }

  @Delete(':id')
  @UseGuards(AuthJwtGuard)
  async remove(@Param('id') id: number) {
    return getResponseForm(await this.usersService.remove(id));
  }

  @Get('/info')
  @UseGuards(AuthJwtGuard)
  async getSelfInfo(@Req() request: Request) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(await this.usersService.findById(user.id));
  }

  @Get('/progress')
  @UseGuards(AuthJwtGuard)
  async getUserProgress(@Req() request: Request) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(await this.usersService.getUserProgress(user.id));
  }
}
