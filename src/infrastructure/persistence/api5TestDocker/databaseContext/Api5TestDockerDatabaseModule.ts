import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule, SequelizeModuleOptions } from "@nestjs/sequelize";
import { Dialect } from "sequelize";
import { City } from "../configuration/City";
import { State } from "../configuration/State";

@Module({
    imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot(Api5TestDockerDatabaseModule.sequelizeModuleOptions()),
        ...Api5TestDockerDatabaseModule.sequelizeModels(),
    ],
    exports: [
        SequelizeModule.forRoot(Api5TestDockerDatabaseModule.sequelizeModuleOptions()),
        ...Api5TestDockerDatabaseModule.sequelizeModels(),
    ],
})
export class Api5TestDockerDatabaseModule {
    public static sequelizeModuleOptions(): SequelizeModuleOptions {

        const configService: ConfigService = new ConfigService();
        return {
            name: configService.get<string>('database_database_name'),
            dialect: configService.get<string>('database_dialect') as Dialect,
            host: configService.get<string>('database_host'),
            port: configService.get<number>('database_port'),
            database: configService.get<string>('database_database_name'),
            username: configService.get<string>('database_username'),
            password: configService.get<string>('database_password'),
            synchronize: configService.get<boolean>('database_synchronize'),
            autoLoadModels: configService.get<boolean>('database_autoLoadModels'),
            logging: console.log,
            models: [City, State],
        };

    }

    public static sequelizeModels() {

        const configService: ConfigService = new ConfigService();
        return [
            SequelizeModule.forFeature(
                [City, State],
                configService.get<string>('database_database_name'),
            ),
        ];

    }
}
