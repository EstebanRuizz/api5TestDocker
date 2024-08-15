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
import { State } from './State';

@Table({ tableName: 'City', timestamps: false })
export class City extends Model<City> {
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  @Index({ name: 'api5TestDocker_City_Id_Index', unique: true })
  public Id: string;

  @Column({ type: DataType.STRING() })
  @Index({ name: 'api5TestDocker_City_Name_Index', unique: true })
  public Name: string;

  @Column({ type: DataType.INTEGER() })
  @Index({ name: 'api5TestDocker_City_AmountOfPeople_Index', unique: true })
  public AmountOfPeople: number;

  @Column({ type: DataType.STRING() })
  @Index({ name: 'api5TestDocker_City_description_Index', unique: true })
  public description: string;

  @ForeignKey(() => State)
  @Column({ type: DataType.UUID })
  public StateId: string;

  @BelongsTo(() => State)
  public readonly State: string;
}
