import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';

export class CreateRealmDTO {
  @MinLength(3)
  @IsString()
  @ApiProperty()
  public name: string;
}
