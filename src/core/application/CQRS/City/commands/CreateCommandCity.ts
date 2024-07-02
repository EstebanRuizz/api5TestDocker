import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/sequelize';
import { City } from '../../../../../infrastructure/persistence/api5TestDocker/configuration/City';
import { CreateActionDTOCity } from '../../../DTO/http/City/CreateActionDTOCity';

@CommandHandler(CreateActionDTOCity)
export class CreateCommandCity implements ICommandHandler<CreateActionDTOCity> {
  constructor(
    @InjectModel(
      City,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly city: typeof City,
    private readonly elasticsearch: ElasticsearchService,
  ) {}

  public async execute(command: CreateActionDTOCity): Promise<City> {
    const created = await this.city.create(command);
    await this.elasticsearch.index({
      index: 'city',
      id: created.Id,
      body: { ...created.toJSON() },
    });
    return created;
  }
}
