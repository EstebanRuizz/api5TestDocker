import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
import ScopeRepresentation from '@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateClientDTO } from 'src/core/application/DTO/http/IAM/Client/CreateClientDTO';
import { CreateResourceDTO } from 'src/core/application/DTO/http/IAM/Client/CreateResourceDTO';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';

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

  @Post('resource')
  public async createResource(@Body() createResourceDTO: CreateResourceDTO) {
    try {
      await super.initAdmin();
      const clients = await this._kcAdminClient.clients.find({
        realm: createResourceDTO.realmName,
        clientId: createResourceDTO.clientId,
      });

      if (clients.length === 0) {
        throw new NotFoundException('Client not found');
      }

      const clientId = clients[0].id;

      const resourcePayload: ResourceRepresentation = {
        name: createResourceDTO.name,
        uris: createResourceDTO.uris,
        scopes: createResourceDTO.scopes,
      };
      console.log(clientId);
      console.log(createResourceDTO.realmName);

      // await this._kcAdminClient.clients.listResources

      return await this._kcAdminClient.clients.createResource(
        { id: clientId, realm: createResourceDTO.realmName },
        resourcePayload,
      );
    } catch (error) {
      console.log(error);
    }
  }

  @Get('resources')
  @ApiQuery({ name: 'realm', required: true, description: 'Realm name' })
  @ApiQuery({ name: 'clientId', required: true, description: 'Client ID' })
  public async getResources(
    @Query('realm') realm: string,
    @Query('clientId') clientId: string,
  ) {
    try {
      await super.initAdmin();
      const clients = await this._kcAdminClient.clients.find({
        realm: realm,
        clientId: clientId,
      });

      if (clients.length === 0) {
        throw new NotFoundException('Client not found');
      }
      const client = clients[0].id;

      return await this._kcAdminClient.clients.listResources({
        id: client,
        realm: realm,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
