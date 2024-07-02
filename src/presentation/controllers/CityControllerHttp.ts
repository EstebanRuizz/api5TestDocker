import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Options, Headers } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { City } from "src/infrastructure/persistence/api5TestDocker/configuration/City";
import { GetByIdDTO } from "src/core/application/DTO/queries/GetByIdDTO";
import { GetAllPaginatedDTO } from "src/core/application/DTO/queries/GetAllPaginatedDTO";
import { CreateActionDTOCity } from "src/core/application/DTO/http/City/CreateActionDTOCity";
import { UpdateActionDTOCity } from "src/core/application/DTO/http/City/UpdateActionDTOCity";
import { DeleteActionDTOCity } from "src/core/application/DTO/http/City/DeleteActionDTOCity";
import { ParamIdDtoValidatorCqrsService } from "param-id-validator";
import { ApiTags, OmitType } from "@nestjs/swagger";

export class CityControllerHttpOmitId extends OmitType(UpdateActionDTOCity, ['Id',] as const) {
}

@ApiTags('city')
@Controller('city')
export class CityControllerHttp {
    public constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus, private readonly paramIdDtoValidatorCqrs: ParamIdDtoValidatorCqrsService) {
    }

    @Get()
    public async Get(@Query() body: GetAllPaginatedDTO): Promise<City[]> {

                   return await this.queryBus.execute(body);
                
    }

    @Get(':id')
    public async GetById(@Param('id') id: string): Promise<City[]> {
        return await this.queryBus.execute(await this.paramIdDtoValidatorCqrs.validateIdDTO(GetByIdDTO, id));
    }

    @Post()
    public async Post(@Body() body: CreateActionDTOCity): Promise<City> {

                   return await this.commandBus.execute(body);
                
    }

    @Patch()
    public async Patch(@Body() body: UpdateActionDTOCity): Promise<City> {

                   return await this.commandBus.execute(body);
                
    }

    @Patch(':Id')
    public async patchById(@Param('Id') Id: string, @Body() body: CityControllerHttpOmitId): Promise<City> {

                await this.paramIdDtoValidatorCqrs.validateIdDTO(UpdateActionDTOCity, Id);
                const updateData: UpdateActionDTOCity = Object.assign(
                  new UpdateActionDTOCity(),
                  { Id, ...body },
                );
                await this.paramIdDtoValidatorCqrs.validateDto(updateData);
                return await this.commandBus.execute(updateData);
                
              
    }

    @Delete(':id')
    public async Delete(@Param('id') id: string): Promise<City> {
        return await this.commandBus.execute(await this.paramIdDtoValidatorCqrs.validateIdDTO(DeleteActionDTOCity, id));
    }
}
