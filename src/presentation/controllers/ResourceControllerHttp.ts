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
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

@ApiTags('resource')
@Controller('resource')
export class ResourceControllerHttp extends KeycloakAdminService {
  public constructor() {
    super();
  }
  @Post()
  protected async post(
    realmName: string,
    clientId: string,
    resourceName: string,
  ) {
    await this.initAdmin();
    const clients = await this._kcAdminClient.clients.find({
      realm: realmName,
      clientId: clientId,
    });
    if (clients.length === 0) {
      throw new Error('Client not found');
    }
    const client = clients[0];
    await this._kcAdminClient.clients[
      client.id
    ].authz.resourceServer.resource.create({
      name: resourceName,
      uris: [`/${resourceName}/*`],
    });
  }

  //   @Get()
  //   @ApiQuery({ name: 'realm', required: true, description: 'realm name' })
  //   public async getResources(@Query('realm') realm: string) {
  //     try {
  //       await this.initAdmin();
  //       // Example: Assuming `this._kcAdminClient.resources.find({ realm })` is correct usage
  //       return await this._kcAdminClient.resources.find({ realm });
  //     } catch (error) {
  //       console.error('Error fetching resources:', error);
  //       throw new InternalServerErrorException('Failed to fetch resources');
  //     }
  //   }
  //   @Post()
  //   public async createResource(@Body() createResourceDTO: CreateResourceDTO) {
  //     try {
  //       await this.initAdmin();
  //       return await this._kcAdminClient.resources.create({
  //         realm: createResourceDTO.realm,
  //         resource: {
  //           name: createResourceDTO.name,
  //           type: createResourceDTO.type,
  //           uri: createResourceDTO.uri,
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error creating resource:', error);
  //       throw new InternalServerErrorException('Failed to create resource');
  //     }
  //   }
  //   @Put()
  //   public async updateResource(@Body() updateResourceDTO: UpdateResourceDTO) {
  //     try {
  //       await this.initAdmin();
  //       const resource = await this._kcAdminClient.resources.findOne({
  //         realm: updateResourceDTO.realm,
  //         id: updateResourceDTO.id,
  //       });
  //       if (!resource) {
  //         throw new Error('Resource not found');
  //       }
  //       return await this._kcAdminClient.resources.update({
  //         realm: updateResourceDTO.realm,
  //         resource: {
  //           id: updateResourceDTO.id,
  //           name: updateResourceDTO.name,
  //           type: updateResourceDTO.type,
  //           uri: updateResourceDTO.uri,
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error updating resource:', error);
  //       throw new InternalServerErrorException('Failed to update resource');
  //     }
  //   }
  //   @Delete()
  //   @ApiQuery({ name: 'realm', required: true, description: 'realm name' })
  //   @ApiQuery({ name: 'id', required: true, description: 'resource id' })
  //   public async deleteResource(
  //     @Query('realm') realm: string,
  //     @Query('id') id: string,
  //   ) {
  //     try {
  //       await this.initAdmin();
  //       const resource = await this._kcAdminClient.resources.findOne({
  //         realm: realm,
  //         id: id,
  //       });
  //       if (!resource) {
  //         throw new Error('Resource not found');
  //       }
  //       return await this._kcAdminClient.resources.delete({
  //         realm: realm,
  //         id: id,
  //       });
  //     } catch (error) {
  //       console.error('Error deleting resource:', error);
  //       throw new InternalServerErrorException('Failed to delete resource');
  //     }
  //   }
}
