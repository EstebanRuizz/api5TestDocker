import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { City } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/City";
import { GetBySearchDTO } from "../../../DTO/queries/GetBySearchDTO";

@QueryHandler(GetBySearchDTO)
export class GetBySearchCity implements IQueryHandler<GetBySearchDTO> {
    constructor(@InjectModel(City, new ConfigService().get<string>('database_database_name')) private readonly city: typeof City) {
    }

    public async execute(query: GetBySearchDTO): Promise<City[]> {

        const { propertyName, searchExpression } = query;
        return await this.city.findAll({
            where: {
                [propertyName]: {
                    [Op.like]: searchExpression
                }
            }
        });

    }
}
