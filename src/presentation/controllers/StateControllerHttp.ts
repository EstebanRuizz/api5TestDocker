import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Options,
  Headers,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { State } from 'src/infrastructure/persistence/api5TestDocker/configuration/State';
import { GetByIdDTO } from 'src/core/application/DTO/queries/GetByIdDTO';
import { GetAllPaginatedDTO } from 'src/core/application/DTO/queries/GetAllPaginatedDTO';
import { CreateActionDTOState } from 'src/core/application/DTO/http/State/CreateActionDTOState';
import { UpdateActionDTOState } from 'src/core/application/DTO/http/State/UpdateActionDTOState';
import { DeleteActionDTOState } from 'src/core/application/DTO/http/State/DeleteActionDTOState';
import { ParamIdDtoValidatorCqrsService } from 'param-id-validator';
import { ApiTags, OmitType } from '@nestjs/swagger';
import { KeycloakAdminService } from 'src/core/application/services/keycloak-admin/keycloak-admin.service';

export class StateControllerHttpOmitId extends OmitType(UpdateActionDTOState, [
  'Id',
] as const) {}

@ApiTags('state')
@Controller('state')
export class StateControllerHttp {
  public constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly paramIdDtoValidatorCqrs: ParamIdDtoValidatorCqrsService,
    private readonly keycloakAdminService: KeycloakAdminService,
  ) {}

  @Get()
  public async Get(@Query() body: GetAllPaginatedDTO): Promise<State[]> {
    return await this.queryBus.execute(body);
  }

  @Get(':id')
  public async GetById(@Param('id') id: string): Promise<State[]> {
    return await this.queryBus.execute(
      await this.paramIdDtoValidatorCqrs.validateIdDTO(GetByIdDTO, id),
    );
  }

  @Post()
  public async Post(@Body() body: CreateActionDTOState): Promise<State> {
    return await this.commandBus.execute(body);
  }

  @Patch()
  public async Patch(@Body() body: UpdateActionDTOState): Promise<State> {
    return await this.commandBus.execute(body);
  }

  @Patch(':Id')
  public async patchById(
    @Param('Id') Id: string,
    @Body() body: StateControllerHttpOmitId,
  ): Promise<State> {
    await this.paramIdDtoValidatorCqrs.validateIdDTO(UpdateActionDTOState, Id);
    const updateData: UpdateActionDTOState = Object.assign(
      new UpdateActionDTOState(),
      { Id, ...body },
    );
    await this.paramIdDtoValidatorCqrs.validateDto(updateData);
    return await this.commandBus.execute(updateData);
  }

  @Delete(':id')
  public async Delete(@Param('id') id: string): Promise<State> {
    return await this.commandBus.execute(
      await this.paramIdDtoValidatorCqrs.validateIdDTO(
        DeleteActionDTOState,
        id,
      ),
    );
  }

  @Get('users')
  public async user(): Promise<object[]> {
    const users = await this.keycloakAdminService.getUsers();
    console.log(users);

    return users;
  }
}
