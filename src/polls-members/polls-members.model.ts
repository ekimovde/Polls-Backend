import {
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
import { TABLE_NAME } from './polls-members.attributes';

interface PollsMembersAttrs {
  pollId: number;
  userId: number;
}

@Table({
  tableName: TABLE_NAME,
})
export class PollsMembers extends Model<PollsMembers, PollsMembersAttrs> {
  @ForeignKey(() => Poll)
  @Column({ type: DataType.INTEGER })
  pollId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @CreatedAt
  created: Date;

  @UpdatedAt
  updated: Date;
}
