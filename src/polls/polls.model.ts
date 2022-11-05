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
import { User } from 'src/users/users.model';
import { TABLE_NAME } from './polls.attributes';
import { PollCategory, PollColor } from './model';

interface PollCreationAttrs {
  id: number;
  name: string;
  color: PollColor;
  category: PollCategory;
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
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: true,
  })
  isPublic: boolean;

  @BelongsTo(() => User)
  author: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @CreatedAt
  created: Date;

  @UpdatedAt
  updated: Date;
}
