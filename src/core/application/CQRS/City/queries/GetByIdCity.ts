import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { City } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/City";
import { GetByIdDTO } from "../../../DTO/queries/GetByIdDTO";

@QueryHandler(GetByIdDTO)
export class GetByIdCity implements IQueryHandler<GetByIdDTO> {
    constructor(@InjectModel(City, new ConfigService().get<string>('database_database_name')) private readonly city: typeof City) {
    }

    public async execute(query: GetByIdDTO): Promise<City> {

        return await this.city.findByPk(query.Id);

    }
}
