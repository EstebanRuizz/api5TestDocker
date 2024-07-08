import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';

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

@ApiTags('client')
@Controller('client')
export class ClientControllerHttp extends KeycloakAdminService {
  public constructor() {
    super();
  }

  @Get()
  @ApiQuery({ name: 'realm', required: true, description: 'Realm name' })
  @ApiQuery({ name: 'clientId', required: true, description: 'Client ID' })
  public async getClients(
    @Query('realm') realm: string,
    @Query('clientId') clientId: string,
  ) {
    // {
    //   realm: "api5",
    //   clientId: "clientapi5"
    //   }
    await this.initAdmin();
    return await this._kcAdminClient.clients.find({
      realm: realm,
      clientId: clientId,
    });
  }

  @Post()
  public async post(@Body() createClientDTO: CreateClientDTO) {
    await this.initAdmin();
    return await this._kcAdminClient.clients.create({
      realm: createClientDTO.realmName,
      clientId: createClientDTO.clientId,
      enabled: true,
      directAccessGrantsEnabled: true,
      publicClient: true,
    });
  }
}
