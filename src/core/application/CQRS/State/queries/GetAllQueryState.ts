import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectModel } from "@nestjs/sequelize";
import { State } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/State";
import { GetAllPaginatedDTO } from "../../../DTO/queries/GetAllPaginatedDTO";

@QueryHandler(GetAllPaginatedDTO)
export class GetAllQueryState implements IQueryHandler<GetAllPaginatedDTO> {
    constructor(@InjectModel(State, new ConfigService().get<string>('database_database_name')) private readonly state: typeof State, private readonly elasticsearchService: ElasticsearchService) {
    }

    public async execute(command: GetAllPaginatedDTO): Promise<State[]> {

        const body = await this.elasticsearchService.search({
            index: 'state',
            body: {
                from: command.page - 1,
                size: command.limit,
            },
        });
        return body.hits.hits.map((data) =>
            Object.assign(new State(), data._source),
        );

    }
}
