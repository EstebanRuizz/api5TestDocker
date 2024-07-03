import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { RoleService } from 'src/core/application/services/role/role.service';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public description: string;
}

@ApiTags('role')
@Controller('role')
export class RoleControllerHttp {
  public constructor(private readonly role: RoleService) {}

  @Get()
  public async get() {
    return await this.role.get();
  }

  @Post()
  public async post(@Body() role: CreateRoleDTO) {
    return this.role.createRole(role);
  }
}
