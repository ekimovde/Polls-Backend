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
import { CreatePollDto } from './dto/create-poll-dto';
import { Poll } from './polls.model';
import { PollsService } from './polls.service';

@Controller('api/polls')
export class PollsController {
  constructor(private readonly pollService: PollsService) {}

  @Get()
  @UseGuards(AuthJwtGuard)
  async getPolls(): Promise<ApiWrapper<Poll[]>> {
    return this.pollService.getPolls();
  }

  @Post()
  @UseGuards(AuthJwtGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreatePollDto): Promise<ApiWrapper<Poll>> {
    return this.pollService.create(dto);
  }
}
