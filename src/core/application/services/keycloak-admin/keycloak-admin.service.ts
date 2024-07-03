import KeyCloakAdminClient from '@keycloak/keycloak-admin-client';
import PolicyRepresentation from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
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

  protected async getUsers() {
    await this.initAdmin();
    return this._kcAdminClient.users.find();
  }

  protected async getById(Id: string) {
    await this.initAdmin();
    return this._kcAdminClient.users.findOne({
      id: Id,
    });
  }

  protected async createUser(user: UserRepresentation) {
    await this.initAdmin();
    const newUser = await this._kcAdminClient.users.create(user);
    return newUser;
  }

  protected async createRole(role: RoleRepresentation): Promise<{
    roleName: string;
  }> {
    await this.initAdmin();
    return await this._kcAdminClient.roles.create(role);
  }

  protected async createResource(name: string, uri: string, type: string) {
    await this.initAdmin();
    // Assuming 'realm' is the default realm
    const resource = await this._kcAdminClient.clients.createPermission(
      {
        id: 'realm', // Replace with your client id or realm id
        type: 'resource',
      },
      {
        name,
        uri,
        type,
      } as PolicyRepresentation,
    );
    return resource;
  }

  protected async addPermissionToRole(
    roleId: string,
    resourceId: string,
    scope: string,
  ) {
    await this.initAdmin();

    // Retrieve role
    const role = await this._kcAdminClient.roles.findOneById({ id: roleId });
    if (!role) {
      throw new Error(`Role with id ${roleId} not found`);
    }

    // Retrieve resource
    const resource = await this._kcAdminClient.clients.findOne({
      id: resourceId,
    });
    this.validateResource(resource, resourceId);

    // Assign role to resource
    const policy: PolicyRepresentation = {
      name: role.name, // Assign role name as permission name
      type: 'resource',
      roles: [
        {
          id: role.id,
          required: true, // Optional: depending on your policy setup
        },
      ],
    };

    const createdPolicy = await this._kcAdminClient.clients.createPermission(
      {
        id: resource.id, // Replace with your resource id or name
        type: 'resource',
      },
      policy,
    );

    return createdPolicy;
  }

  private validateResource(resource, resourceId: string): void {
    if (!resource) {
      throw new Error(`Resource with id ${resourceId} not found`);
    }
  }
}
