import KeyCloakAdminClient from '@keycloak/keycloak-admin-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeycloakAdminService {
  protected _kcAdminClient: KeyCloakAdminClient;

  private dynamicKeyCloakImport = async () =>
    new Function("return import('@keycloak/keycloak-admin-client')")();

  protected async initAdmin() {
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
  //https://github.com/keycloak/keycloak/blob/main/js/libs/keycloak-admin-client/test/clients.spec.ts
  // https://www.keycloak.org/docs/latest/server_admin/
}
