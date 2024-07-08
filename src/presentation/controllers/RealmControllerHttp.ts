import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';
import { RealmService } from 'src/core/application/services/realm/realm.service';

export class CreateRealmDTO {
  @MinLength(3)
  @IsString()
  @ApiProperty()
  public name: string;
}

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
    // return this._kcAdminClient.realms.findOne({ realm: 'api5' });
  }

  @Post()
  public async post(@Body() realm: CreateRealmDTO) {
    await this.initAdmin();
    return await this._kcAdminClient.realms.create({
      realm: realm.name,
      enabled: true,
    });
  }
}
