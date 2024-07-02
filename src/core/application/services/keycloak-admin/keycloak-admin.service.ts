import KeycloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KeycloakAdminService {
  protected _kcAdminClient: KeycloakAdminClient;

  constructor(private configService: ConfigService) {}

  private dynamicKeyCloakImport = async () =>
    new Function("return import('@keycloak/keycloak-admin-client')")();

  private async initAdmin() {
    const KCadmCli = (await this.dynamicKeyCloakImport()).default;
    this._kcAdminClient = new KCadmCli({
      baseUrl: 'http://localhost:8080',
      realmName: 'master',
    });
    await this._kcAdminClient.auth({
      username: 'admin',
      password: 'change_me',
      grantType: 'password',
      clientId: 'admin-cli',
    });
  }
  public async getUsers() {
    await this.initAdmin();
    return this._kcAdminClient.users.find();
  }
}
