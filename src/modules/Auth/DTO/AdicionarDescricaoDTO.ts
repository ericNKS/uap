import { Type } from "class-transformer";
import {IsString, MinLength, ValidateNested } from "class-validator";

export default class AdicionarDescricaoDTO {
    @IsString()
    DescricaoUser: string = '';
}