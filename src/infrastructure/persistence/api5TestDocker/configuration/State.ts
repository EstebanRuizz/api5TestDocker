import {
  Model,
  Index,
  Table,
  HasOne,
  Column,
  Default,
  HasMany,
  DataType,
  BelongsTo,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { City } from './City';

@Table({ tableName: 'State', timestamps: false })
export class State extends Model<State> {
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  @Index({ name: 'api5TestDocker_State_Id_Index', unique: true })
  public Id: string;

  @Column({ type: DataType.STRING() })
  @Index({ name: 'api5TestDocker_State_Name_Index', unique: true })
  public Name: string;

  @Column({ type: DataType.INTEGER() })
  public creationYear: number;

  @Column({ type: DataType.BOOLEAN() })
  public isOlderThanOneHundredYears: boolean;

  @HasMany(() => City)
  public readonly City: City[];
}
