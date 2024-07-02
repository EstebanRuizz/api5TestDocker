import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { City } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/City";
import { UpdateActionDTOCity } from "../../../DTO/http/City/UpdateActionDTOCity";

@CommandHandler(UpdateActionDTOCity)
export class UpdateCommandCity implements ICommandHandler<UpdateActionDTOCity> {
    constructor(@InjectModel(City, new ConfigService().get<string>('database_database_name')) private readonly city: typeof City, private readonly elasticsearchService: ElasticsearchService) {
    }

    public async execute(command: UpdateActionDTOCity): Promise<City> {

        const cityExists = await this.city.findByPk(command.Id);
        if (!cityExists) {
            throw new Error('city not found');
        }
        Object.assign(cityExists, command);
        await cityExists.save();
        await this.elasticsearchService.update({
            index: 'city',
            id: command.Id,
            body: {
                doc: cityExists,
            },
        });
        return cityExists;

    }
}
