import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthJwtGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';

@Controller('v1/polls')
export class PollsController {
  constructor(private readonly pollService: PollsService) {}

  @Post()
  @UseGuards(AuthJwtGuard)
  @UsePipes(ValidationPipe)
  async create(@Body() createPollDto: CreatePollDto) {
    return getResponseForm(await this.pollService.create(createPollDto));
  }

  @Get()
  @UseGuards(AuthJwtGuard)
  async findAll() {
    return getResponseForm(await this.pollService.findAll());
  }

  @Patch(':id')
  @UseGuards(AuthJwtGuard)
  async update(@Param('id') id: number, @Body() updatePollDto: UpdatePollDto) {
    return getResponseForm(await this.pollService.update(id, updatePollDto));
  }

  @Delete(':id')
  @UseGuards(AuthJwtGuard)
  async remove(@Param('id') id: number) {
    return getResponseForm(await this.pollService.remove(id));
  }

  @Get(':id')
  @UseGuards(AuthJwtGuard)
  async findById(@Param('id') id: number) {
    return getResponseForm(await this.pollService.findById(id));
  }
}
