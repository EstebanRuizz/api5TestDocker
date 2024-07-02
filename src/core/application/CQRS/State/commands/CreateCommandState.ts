import { ConfigService } from "@nestjs/config";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectModel } from "@nestjs/sequelize";
import { State } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/State";
import { CreateActionDTOState } from "../../../DTO/http/State/CreateActionDTOState";

@CommandHandler(CreateActionDTOState)
export class CreateCommandState implements ICommandHandler<CreateActionDTOState> {
    constructor(@InjectModel(State, new ConfigService().get<string>('database_database_name')) private readonly state: typeof State, private readonly elasticsearch: ElasticsearchService) {
    }

    public async execute(command: CreateActionDTOState): Promise<State> {

        const created = await this.state.create(command);
        await this.elasticsearch.index({
            index: 'state',
            id: created.Id,
            body: { ...created.toJSON() },
        });
        return created;

    }
}
