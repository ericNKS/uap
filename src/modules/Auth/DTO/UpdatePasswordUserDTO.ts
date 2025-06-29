import { Type } from "class-transformer";
import {IsString, MinLength, ValidateNested } from "class-validator";

class PasswordDTO {
    @IsString()
    @MinLength(8)
    old: string = '';

    @IsString()
    @MinLength(8)
    first: string = '';

    @IsString()
    @MinLength(8)
    second: string = '';
}

export default class UpdatePasswordUserDTO {
    @ValidateNested()
    @Type(() => PasswordDTO)
    SenhaUser?: PasswordDTO = undefined;
}