import { ConfigService } from "@nestjs/config";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { State } from "../../../../../infrastructure/persistence/api5TestDocker/configuration/State";
import { GetByIdDTO } from "../../../DTO/queries/GetByIdDTO";

@QueryHandler(GetByIdDTO)
export class GetByIdState implements IQueryHandler<GetByIdDTO> {
    constructor(@InjectModel(State, new ConfigService().get<string>('database_database_name')) private readonly state: typeof State) {
    }

    public async execute(query: GetByIdDTO): Promise<State> {

        return await this.state.findByPk(query.Id);

    }
}
