import KeyCloakAdminClient from '@keycloak/keycloak-admin-client';
import PolicyRepresentation from '@keycloak/keycloak-admin-client/lib/defs/policyRepresentation';
import RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Injectable } from '@nestjs/common';
import { BaseParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

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

  protected async createRealm(realmName: string) {
    await this.initAdmin();
    await this._kcAdminClient.realms.create({
      realm: realmName,
      enabled: true,
    });
  }

  protected async createClient(realmName: string, clientId: string) {
    await this.initAdmin();
    await this._kcAdminClient.clients.create({
      realm: realmName,
      clientId: clientId,
      enabled: true,
      directAccessGrantsEnabled: true,
      publicClient: true,
    });
  }

  protected async createResource(
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

  protected async createRole(realmName: string, roleName: string) {
    await this.initAdmin();
    await this._kcAdminClient.roles.create({
      realm: realmName,
      name: roleName,
    });
  }

  protected async createPolicy(
    realmName: string,
    clientId: string,
    policyName: string,
    roleId: string,
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
    ].authz.resourceServer.policy.role.create({
      name: policyName,
      roles: [{ id: roleId }],
    });
  }

  protected async createPermission(
    realmName: string,
    clientId: string,
    permissionName: string,
    resourceId: string,
    policyName: string,
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
    ].authz.resourceServer.permission.resource.create({
      name: permissionName,
      resources: [resourceId],
      policies: [policyName],
    });
  }
}
