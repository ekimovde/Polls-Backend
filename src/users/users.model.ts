import {
  Model,
  Table,
  Column,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { Poll } from 'src/polls/polls.model';
import { TABLE_NAME } from './attributes';

interface UserCreationAttrs {
  firstName: string;
  lastName: string;
  fullName: string;
  nickName: string;
  email: string;
  password: string;
}

@Table({
  tableName: TABLE_NAME,
})
export class User extends Model<User, UserCreationAttrs> {
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
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: '',
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  nickName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @CreatedAt
  created: Date;

  @UpdatedAt
  updated: Date;

  @BeforeCreate
  @BeforeUpdate
  static setFullName(instance: User): void {
    instance.fullName = `${instance.firstName} ${instance.lastName}`;
  }

  @HasMany(() => Poll)
  polls: Poll[];
}
