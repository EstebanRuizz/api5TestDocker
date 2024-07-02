import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, ValidateNested, IsOptional, IsObject, IsArray, ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsBoolean, IsUUID, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class DeleteActionDTOState {

    @IsUUID()
    @ApiProperty()
    public Id: string;
}
