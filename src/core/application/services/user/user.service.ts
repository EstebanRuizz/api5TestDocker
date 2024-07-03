import { Get, Injectable, Param } from '@nestjs/common';
import { KeycloakAdminService } from '../keycloak-admin/keycloak-admin.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { CreateUserDTO } from 'src/presentation/controllers/UserControllerHttp';

@Injectable()
export class UserService extends KeycloakAdminService {
  async getUsers() {
    return await super.getUsers();
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
