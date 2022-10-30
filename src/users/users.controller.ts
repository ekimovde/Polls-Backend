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

  @Patch(':id')
  @UseGuards(AuthJwtGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return getResponseForm(await this.usersService.update(id, updateUserDto));
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
}
