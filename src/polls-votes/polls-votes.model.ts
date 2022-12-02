import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Poll } from 'src/polls/polls.model';
import { User } from 'src/users/users.model';
import { TABLE_NAME } from './polls-votes.attributes';

interface PollsVotesAttrs {
  pollId: number;
  userId: number;
}

@Table({
  tableName: TABLE_NAME,
})
export class PollsVotes extends Model<PollsVotes, PollsVotesAttrs> {
  @ForeignKey(() => Poll)
  @Column({ type: DataType.INTEGER })
  pollId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @Column({ type: DataType.STRING })
  text: string;

  @Column({ type: DataType.BIGINT })
  timestamp: number;

  @CreatedAt
  created: Date;

  @UpdatedAt
  updated: Date;
}
