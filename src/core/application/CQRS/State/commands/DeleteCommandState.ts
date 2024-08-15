import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { InjectModel } from '@nestjs/sequelize';
import { State } from '../../../../../infrastructure/persistence/api5TestDocker/configuration/State';
import { DeleteActionDTOState } from '../../../DTO/http/State/DeleteActionDTOState';

@CommandHandler(DeleteActionDTOState)
export class DeleteCommandState
  implements ICommandHandler<DeleteActionDTOState>
{
  constructor(
    @InjectModel(
      State,
      new ConfigService().get<string>('database_database_name'),
    )
    private readonly state: typeof State,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  public async execute(command: DeleteActionDTOState): Promise<boolean> {
    const stateExists = await this.state.findByPk(command.Id);
    if (!stateExists) {
      throw new Error('state not found');
    }
    await this.state.destroy({
      where: {
        Id: command.Id,
      },
    });
    await this.elasticsearchService.delete({
      index: 'state',
      id: command.Id,
    });
    return true;
  }
}
