import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/sequelize';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { State } from '../../../../../infrastructure/persistence/api5TestDocker/configuration/State';
import { UpdateActionDTOState } from '../../../DTO/http/State/UpdateActionDTOState';

@CommandHandler(UpdateActionDTOState)
export class UpdateCommandState
  implements ICommandHandler<UpdateActionDTOState>
{
  constructor(
    @InjectModel(
      State,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly state: typeof State,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  public async execute(command: UpdateActionDTOState): Promise<State> {
    const stateExists = await this.state.findByPk(command.Id);
    if (!stateExists) {
      throw new Error('state not found');
    }
    Object.assign(stateExists, command);
    await stateExists.save();
    await this.elasticsearchService.update({
      index: 'state',
      id: command.Id,
      body: {
        doc: stateExists,
      },
    });
    return stateExists;
  }
}
