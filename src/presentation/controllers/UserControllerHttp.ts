import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { UserService } from 'src/core/application/services/user/user.service';

export class CreateUserDTO implements UserRepresentation {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  @ApiProperty()
  username: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  @ApiProperty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  @ApiProperty()
  lastName: string;
}

@ApiTags('user')
@Controller('user')
export class UserControllerHttp {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDTO) {
    return await this.userService.createUser(createUserDto);
  }
}
