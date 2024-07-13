import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ClientRepresentationDTO } from 'src/core/application/DTO/http/IAM/realm/ClientRepresentationDTO';
import { CreateRealmDTO } from 'src/core/application/DTO/http/IAM/realm/CreateRealmDTO';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';
import { RealmService } from 'src/core/application/services/realm/realm.service';

@ApiTags('realm')
@Controller('realm')
export class RealmControllerHttp extends KeycloakAdminService {
  public constructor(private readonly realmService: RealmService) {
    super();
  }

  @Get()
  async getRealms() {
    await super.initAdmin();
    return this._kcAdminClient.realms.find();
  }

  @Get('clients')
  @ApiQuery({ name: 'realm', required: true, description: 'realm name' })
  public async getClientsByRealm(@Query('realm') realm: string) {
    await super.initAdmin();
    // const secret = await this._kcAdminClient.clients.getClientSecret({
    //   id: 'client-2-swagger',
    // });
    // console.log(secret);
    return this._kcAdminClient.clients.find({ realm: realm });
  }

  @Post()
  public async post(@Body() realm: CreateRealmDTO) {
    await this.initAdmin();
    return await this._kcAdminClient.realms.create({
      realm: realm.name,
      enabled: true,
    });
  }

  @Post('client')
  public async postClient(
    @Body() createClientRealmDTO: ClientRepresentationDTO,
  ) {
    await this.initAdmin();
    return await this._kcAdminClient.clients.create(createClientRealmDTO);
  }
}
