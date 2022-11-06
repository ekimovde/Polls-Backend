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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthJwtGuard } from 'src/common/guards/auth.guard';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { AuthTokenPayload } from 'src/shared/constants';
import { getResponseForm } from 'src/shared/utils/get-response-form';
import { CreatePollDto } from './dto/create-poll.dto';
import { SendInvitePollDto } from './dto/send-invite-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';

@Controller('v1/polls')
export class PollsController {
  constructor(private readonly pollService: PollsService) {}

  @Post()
  @UseGuards(AuthJwtGuard)
  @UsePipes(ValidationPipe)
  async create(@Req() request: Request, @Body() createPollDto: CreatePollDto) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(
      await this.pollService.create({ ...createPollDto, userId: user.id }),
    );
  }

  @Get()
  @UseGuards(AuthJwtGuard)
  async findAll() {
    return getResponseForm(await this.pollService.findAll());
  }

  @Get('my')
  @UseGuards(AuthJwtGuard)
  async findAllMy(@Req() request: Request) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(await this.pollService.findAllMy(user.id));
  }

  @Patch(':id')
  @UseGuards(AuthJwtGuard)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(
      await this.pollService.update(user.id, id, updatePollDto),
    );
  }

  @Delete(':id')
  @UseGuards(AuthJwtGuard)
  async remove(@Req() request: Request, @Param('id') id: number) {
    const user = request['user'] as Partial<AuthTokenPayload>;
    return getResponseForm(await this.pollService.remove(user.id, id));
  }

  @Get(':id')
  @UseGuards(AuthJwtGuard)
  async findById(@Param('id') id: number) {
    return getResponseForm(await this.pollService.findById(id));
  }

  @Post('invite')
  @UseGuards(AuthJwtGuard)
  async sendInvite(@Body() sendInvitePollDto: SendInvitePollDto) {
    return getResponseForm(
      await this.pollService.sendInvite(sendInvitePollDto),
    );
  }
}
