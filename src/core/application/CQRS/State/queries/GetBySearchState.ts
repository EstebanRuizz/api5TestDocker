import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { State } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/State";
import { GetBySearchDTO } from "../../../DTO/queries/GetBySearchDTO";

@QueryHandler(GetBySearchDTO)
export class GetBySearchState implements IQueryHandler<GetBySearchDTO> {
    constructor(@InjectModel(State, new ConfigService().get<string>('database_database_name')) private readonly state: typeof State) {
    }

    public async execute(query: GetBySearchDTO): Promise<State[]> {

        const { propertyName, searchExpression } = query;
        return await this.state.findAll({
            where: {
                [propertyName]: {
                    [Op.like]: searchExpression
                }
            }
        });

    }
}
