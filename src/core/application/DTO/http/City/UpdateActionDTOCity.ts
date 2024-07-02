import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, ValidateNested, IsOptional, IsObject, IsArray, ArrayMaxSize, ArrayMinSize, ArrayNotEmpty, IsBoolean, IsUUID, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateActionDTOCity {

    @IsUUID()
    @ApiProperty()
    public Id: string;

    @IsString()
    @ApiProperty()
    public Name: string;

    @IsString()
    @ApiProperty()
    public description: string;

    @IsUUID()
    @ApiProperty()
    public StateId: string;
}
