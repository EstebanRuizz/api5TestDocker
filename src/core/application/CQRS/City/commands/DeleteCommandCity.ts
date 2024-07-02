import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectModel } from "@nestjs/sequelize";
import { City } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/City";
import { DeleteActionDTOCity } from "../../../DTO/http/City/DeleteActionDTOCity";

@CommandHandler(DeleteActionDTOCity)
export class DeleteCommandCity implements ICommandHandler<DeleteActionDTOCity> {
    constructor(@InjectModel(City, new ConfigService().get<string>('database_database_name')) private readonly city: typeof City, private readonly elasticsearchService: ElasticsearchService) {
    }

    public async execute(command: DeleteActionDTOCity): Promise<boolean> {

        const cityExists = await this.city.findByPk(command.Id);
        if (!cityExists) {
            throw new Error('city not found');
        }
        await this.city.destroy({
            where: {
                Id: command.Id,
            },
        });
        await this.elasticsearchService.delete({
            index: 'city',
            id: command.Id,
        });
        return true;

    }
}
