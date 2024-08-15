import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiGatewayTimeoutResponse,
  ApiProperty,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';
import { UserService } from 'src/core/application/services/user/user.service';
import { AssignRoleToUserDTO } from './RoleControllerHttp';

export class CreateUserDTO implements UserRepresentation {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty()
  username: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty()
  realm: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(150)
  @ApiProperty()
  serviceAccountClientId: string;
}

export class RemoveRoleFromUserDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  public realmName: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public userId: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public roleName: string;
}

export class UpdateUserDTO {
  @IsString()
  @MinLength(1)
  @ApiProperty()
  public realmName: string;

  @IsString()
  @MinLength(1)
  @ApiProperty()
  public userId: string;

  @IsString()
  @ApiProperty()
  public username?: string;

  @IsString()
  @ApiProperty()
  public email?: string;

  @IsString()
  @ApiProperty()
  public firstName?: string;

  @IsString()
  @ApiProperty()
  public lastName?: string;
}

@ApiTags('user')
@Controller('user')
export class UserControllerHttp extends KeycloakAdminService {
  public constructor(private readonly userService: UserService) {
    super();
  }

  @Get()
  @ApiQuery({ name: 'realmName', required: true, description: 'realm name' })
  public async get(@Query('realmName') realmName: string) {
    await super.initAdmin();
    return this._kcAdminClient.users.find({
      realm: realmName,
    });
  }

  @Post()
  public async createUser(@Body() createUserDto: CreateUserDTO) {
    await super.initAdmin();
    return await this._kcAdminClient.users.create(createUserDto);
  }

  @Put()
  public async updateUser(@Body() updateUserDTO: UpdateUserDTO) {
    await this.initAdmin();
    const { realmName, userId, ...updateFields } = updateUserDTO;
    return await this._kcAdminClient.users.update(
      { id: userId, realm: realmName },
      updateFields,
    );
  }

  @Delete()
  @ApiQuery({ name: 'realmName', required: true, description: 'Realm name' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  public async deleteUser(
    @Query('realmName') realmName: string,
    @Query('userId') userId: string,
  ) {
    await this.initAdmin();
    return await this._kcAdminClient.users.del({
      id: userId,
      realm: realmName,
    });
  }

  @Post('assignRoleToUser')
  public async assignRoleToUser(@Body() roleToUserDTO: AssignRoleToUserDTO) {
    try {
      await super.initAdmin();
      const role = await this._kcAdminClient.clients.findRole({
        id: roleToUserDTO.clientId,
        roleName: roleToUserDTO.roleName,
        realm: roleToUserDTO.realmName,
      });
      console.log(role);

      if (!role) {
        throw new NotFoundException('Role not found');
      }
      // await super.initAdmin();
      // await this._kcAdminClient.users.addRealmRoleMappings({
      //   id: roleToUserDTO.userId,
      //   realm: roleToUserDTO.realmName,
      //   roles: [{ id: role.id, name: role.name }],
      // });

      await super.initAdmin();
      const userId = roleToUserDTO.userId;
      const realm = roleToUserDTO.realmName;

      const userCurrent = await this._kcAdminClient.users.findOne({
        id: roleToUserDTO.userId,
        realm: roleToUserDTO.realmName,
      });
      console.log('userCurrent: ', userCurrent);

      const currentRole = await this._kcAdminClient.roles.findOneById({
        id: roleToUserDTO.roleId,
        realm: roleToUserDTO.realmName,
      });
      // const roles = [{ id: currentRole.id, name: currentRole.name }];

      console.log('currentRole: ', currentRole);

      await this._kcAdminClient.users.addRealmRoleMappings({
        id: userId,
        realm: realm,
        roles: [{ id: currentRole.id, name: currentRole.name }],
      });

      return {
        message: 'ok',
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error);
    }
  }

  @Post('removeRoleFromUser')
  public async removeRoleFromUser(
    @Body() removeRoleFromUserDTO: RemoveRoleFromUserDTO,
  ) {
    await super.initAdmin();
    const role = await this._kcAdminClient.roles.findOneByName({
      realm: removeRoleFromUserDTO.realmName,
      name: removeRoleFromUserDTO.roleName,
    });
    if (!role) {
      throw new Error('Role not found');
    }
    await this._kcAdminClient.users.delRealmRoleMappings({
      id: removeRoleFromUserDTO.userId,
      realm: removeRoleFromUserDTO.realmName,
      roles: [{ id: role.id, name: role.name }],
    });
  }
}
