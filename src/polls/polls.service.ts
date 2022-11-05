import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './polls.model';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll) private readonly pollRepository: typeof Poll,
  ) {}

  async create(createPollDto: CreatePollDto): Promise<Poll> {
    return await this.pollRepository.create(createPollDto);
  }

  async findAll(): Promise<Poll[]> {
    return await this.pollRepository.findAll();
  }

  async findById(id: number): Promise<Poll> {
    return await this.pollRepository.findByPk(id);
  }

  async update(id: number, updatePollDto: UpdatePollDto): Promise<void> {
    await this.pollRepository.update(updatePollDto, { where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.pollRepository.destroy({ where: { id } });
  }
}
