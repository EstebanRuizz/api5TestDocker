import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectModel } from "@nestjs/sequelize";
import { City } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/City";
import { GetAllPaginatedDTO } from "../../../DTO/queries/GetAllPaginatedDTO";

@QueryHandler(GetAllPaginatedDTO)
export class GetAllQueryCity implements IQueryHandler<GetAllPaginatedDTO> {
    constructor(@InjectModel(City, new ConfigService().get<string>('database_database_name')) private readonly city: typeof City, private readonly elasticsearchService: ElasticsearchService) {
    }

    public async execute(command: GetAllPaginatedDTO): Promise<City[]> {

        const body = await this.elasticsearchService.search({
            index: 'city',
            body: {
                from: command.page - 1,
                size: command.limit,
            },
        });
        return body.hits.hits.map((data) =>
            Object.assign(new City(), data._source),
        );

    }
}
