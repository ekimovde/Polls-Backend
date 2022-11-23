import {
  BelongsTo,
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { TABLE_NAME } from './polls.attributes';
import {
  PollCategory,
  PollColor,
  PollDate,
  PollQuestion,
  PollTime,
} from './model';
import { PollsMembers } from 'src/polls-members/polls-members.model';

interface PollCreationAttrs {
  id: number;
  name: string;
  color: PollColor;
  category: PollCategory;
  date: PollDate;
  time: PollTime;
  question: PollQuestion;
  isPublic: boolean;
  userId: number;
}

@Table({
  tableName: TABLE_NAME,
})
export class Poll extends Model<Poll, PollCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  color: PollColor;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category: PollCategory;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  date: PollDate;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  time: PollTime;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  question: PollQuestion;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isPublic: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  author: User;

  @BelongsToMany(() => User, () => PollsMembers)
  members: User[];

  @CreatedAt
  created: Date;

  @UpdatedAt
  updated: Date;
}
