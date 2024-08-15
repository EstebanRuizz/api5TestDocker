import ResourceRepresentation from '@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation';
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateClientRoleDTO } from 'src/core/application/DTO/http/IAM/Client/CreateClientRoleDTO';
import { CreateResourceDTO } from 'src/core/application/DTO/http/IAM/Client/CreateResourceDTO';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';

@ApiTags('client')
@Controller('client')
export class ClientControllerHttp extends KeycloakAdminService {
  public constructor() {
    super();
  }

  @Post('role')
  public async rolePost(@Body() createClientRoleDTO: CreateClientRoleDTO) {
    try {
      await super.initAdmin();
      return await this._kcAdminClient.clients.createRole({
        realm: createClientRoleDTO.realmName,
        name: createClientRoleDTO.roleName,
        id: createClientRoleDTO.clientId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @ApiQuery({ name: 'realmName', required: true, description: 'realm Name' })
  @ApiQuery({ name: 'clientId', required: true, description: 'client Id' })
  @Get('role')
  public async roleGet(
    @Query('realmName') realmName: string,
    @Query('clientId') clientId: string,
  ) {
    try {
      await super.initAdmin();
      return await this._kcAdminClient.clients.listRoles({
        realm: realmName,
        id: clientId,
        // id: 'c6e4a1e1-45cc-4599-9e23-1e68bb757f38',
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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
      console.log(client);
      // this._kcAdminClient.clients.createPolicy()

      return await this._kcAdminClient.clients.listResources({
        id: client,
        realm: realm,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
