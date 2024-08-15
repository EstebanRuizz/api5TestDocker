import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Api5TestDockerDatabaseModule } from 'src/infrastructure/persistence/api5TestDocker/databaseContext/Api5TestDockerDatabaseModule';
import { CqrsModule } from '@nestjs/cqrs';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ParamIdDtoValidatorCqrsService } from 'param-id-validator';
import { CityControllerHttp } from 'src/presentation/controllers/CityControllerHttp';
import { CreateCommandCity } from 'src/core/application/CQRS/City/commands/CreateCommandCity';
import { StateControllerHttp } from 'src/presentation/controllers/StateControllerHttp';
import { GetByIdCity } from 'src/core/application/CQRS/City/queries/GetByIdCity';
import { UpdateCommandCity } from 'src/core/application/CQRS/City/commands/UpdateCommandCity';
import { GetAllQueryCity } from 'src/core/application/CQRS/City/queries/GetAllQueryCity';
import { GetBySearchCity } from 'src/core/application/CQRS/City/queries/GetBySearchCity';
import { DeleteCommandCity } from 'src/core/application/CQRS/City/commands/DeleteCommandCity';
import { DeleteCommandState } from 'src/core/application/CQRS/State/commands/DeleteCommandState';
import { CreateCommandState } from 'src/core/application/CQRS/State/commands/CreateCommandState';
import { GetAllQueryState } from 'src/core/application/CQRS/State/queries/GetAllQueryState';
import { UpdateCommandState } from 'src/core/application/CQRS/State/commands/UpdateCommandState';
import { GetByIdState } from 'src/core/application/CQRS/State/queries/GetByIdState';
import { GetBySearchState } from 'src/core/application/CQRS/State/queries/GetBySearchState';
import { KeycloakAdminService } from './core/application/services/keycloak-admin/keycloak-admin.service';
import { UserService } from './core/application/services/user/user.service';
import { RoleService } from './core/application/services/role/role.service';
import { RoleControllerHttp } from './presentation/controllers/RoleControllerHttp';
import { UserControllerHttp } from './presentation/controllers/UserControllerHttp';
import { RealmControllerHttp } from './presentation/controllers/RealmControllerHttp';
import { RealmService } from './core/application/services/realm/realm.service';
import { ClientControllerHttp } from './presentation/controllers/ClientControllerHttp';
import {
  KeycloakConnectModule,
  ResourceGuard,
  RoleGuard,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Api5TestDockerDatabaseModule,
    CqrsModule,
    ElasticsearchModule.register({
      node: new ConfigService().get<string>('elastic_search_end_point'),
    }),
    // KeycloakConnectModule.register({
    //   authServerUrl: 'http://localhost:8080/auth',
    //   realm: 'api5',
    //   clientId: 'client-1',
    //   secret: 'NOaLJRSlNJnZPjLyPQKnTt3K9VfRTYca',
    // }),
  ],
  providers: [
    ParamIdDtoValidatorCqrsService,
    CreateCommandCity,
    GetByIdCity,
    UpdateCommandCity,
    GetAllQueryCity,
    GetBySearchCity,
    DeleteCommandCity,
    DeleteCommandState,
    CreateCommandState,
    GetAllQueryState,
    UpdateCommandState,
    GetByIdState,
    GetBySearchState,
    KeycloakAdminService,
    UserService,
    RoleService,
    RealmService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ResourceGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
  controllers: [
    RoleControllerHttp,
    UserControllerHttp,
    RealmControllerHttp,
    ClientControllerHttp,
    CityControllerHttp,
    StateControllerHttp,
  ],
})
export class AppModule {}
