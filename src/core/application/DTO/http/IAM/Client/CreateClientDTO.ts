import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateClientDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  public realmName: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public clientId: string;
}