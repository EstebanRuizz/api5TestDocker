import { Injectable } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak-admin/keycloak-admin.service';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';

@Injectable()
export class RoleService extends KeycloakAdminService {
  constructor() {
    super();
  }

  public async get() {
    await super.initAdmin();
    return this._kcAdminClient.roles.find();
  }
}
