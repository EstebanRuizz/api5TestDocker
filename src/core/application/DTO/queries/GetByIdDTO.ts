import { IsString, IsUUID } from "class-validator";

export class GetByIdDTO {

    @IsString()
    @IsUUID()
    public Id: string;
}
