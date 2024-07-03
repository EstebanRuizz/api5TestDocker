import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  ValidateNested,
  IsOptional,
  IsObject,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsBoolean,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionDTOCity {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public Name: string;

  @IsNumber()
  @ApiProperty()
  public AmountOfPeople: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(150)
  @ApiProperty()
  public description: string;

  @IsUUID()
  @ApiProperty()
  public StateId: string;
}
