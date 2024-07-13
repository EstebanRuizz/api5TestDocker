import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/presentation/controllers/UserControllerHttp';
import { KeycloakAdminService } from '../keycloak-admin/keycloak-admin.service';

@Injectable()
export class UserService extends KeycloakAdminService {
  public async getUsers() {
    await super.initAdmin();
    return this._kcAdminClient.users.find();
  }

  async createUser(user: CreateUserDTO) {
    try {
      await super.initAdmin();
      const newUser: UserRepresentation = user;
      return await this._kcAdminClient.users.create(newUser);
    } catch (error) {
      console.log(error);
    }
  }
}
