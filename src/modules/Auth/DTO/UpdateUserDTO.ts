import { Type } from "class-transformer";
import { IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { MultipartFile } from "@fastify/multipart";

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

export default class UpdateUserDTO {
    

    @IsOptional()
    @ValidateNested()
    @Type(() => PasswordDTO)
    senhaUser?: PasswordDTO;

    @IsOptional()
    @IsString()
    nomeuser?: string;

    @IsOptional()
    @IsString()
    emailuser?: string;

    @IsOptional()
    @IsString()
    teluser?: string;

    @IsOptional()
    @IsString()
    genuser?: string;

    @IsOptional()
    imgurluser?: string;
}