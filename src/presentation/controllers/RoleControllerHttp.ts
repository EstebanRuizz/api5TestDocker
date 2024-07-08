import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';
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

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public realm: string;
}

export class AssignRoleToUserDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public realmName: string;

  @IsUUID()
  @ApiProperty()
  public userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public roleName: string;
}

export class UpdateRoleDTO {
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

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  public realm: string;
}

@ApiTags('role')
@Controller('role')
export class RoleControllerHttp extends KeycloakAdminService {
  public constructor(private readonly role: RoleService) {
    super();
  }

  @Get()
  @ApiQuery({ name: 'realmName', required: true, description: 'realm name' })
  public async get(@Query('realmName') realmName: string) {
    try {
      await this.initAdmin();
      return await this._kcAdminClient.roles.find({
        realm: realmName,
      });
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  @Get('users')
  @ApiQuery({ name: 'realm', required: true, description: 'realm name' })
  @ApiQuery({ name: 'roleName', required: true, description: 'role name' })
  public async getUsersByRole(
    @Query('realm') realm: string,
    @Query('roleName') roleName: string,
  ) {
    try {
      await this.initAdmin();
      return await this._kcAdminClient.roles.findUsersWithRole({
        realm: realm,
        name: roleName,
      });
    } catch (error) {
      console.error('Error fetching users by role:', error);
      throw new InternalServerErrorException('Failed to fetch users by role');
    }
  }

  @Post()
  public async post(@Body() role: CreateRoleDTO) {
    await this.initAdmin();
    return this._kcAdminClient.roles.create({
      name: role.name,
      realm: role.realm,
    });
  }

  @Put()
  public async updateRole(@Body() updateRoleDTO: UpdateRoleDTO) {
    await this.initAdmin();
    const role = await this._kcAdminClient.roles.findOneByName({
      realm: updateRoleDTO.realm,
      name: updateRoleDTO.name,
    });
    if (!role) {
      throw new Error('Role not found');
    }
    await this._kcAdminClient.roles.updateById(
      {
        realm: updateRoleDTO.realm,
        id: role.id,
      },
      {
        name: updateRoleDTO.name,
        description: updateRoleDTO.description,
      },
    );
  }

  @Delete()
  @ApiQuery({ name: 'realm', required: true, description: 'realm name' })
  @ApiQuery({ name: 'roleName', required: true, description: 'role name' })
  public async deleteRole(
    @Query('realm') realm: string,
    @Query('roleName') roleName: string,
  ) {
    await this.initAdmin();
    const role = await this._kcAdminClient.roles.findOneByName({
      realm: realm,
      name: roleName,
    });
    if (!role) {
      throw new Error('Role not found');
    }
    await this._kcAdminClient.roles.delById({
      realm: realm,
      id: role.id,
    });
  }
}
