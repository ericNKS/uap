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
    SenhaUser?: PasswordDTO;

    @IsOptional()
    @IsString()
    NomeUser?: string;

    @IsOptional()
    @IsString()
    EmailUser?: string;

    @IsOptional()
    @IsString()
    TelUser?: string;

    @IsOptional()
    @IsString()
    GenUser?: string;

    @IsOptional()
    @IsString()
    PronomeUser?: string;

    @IsOptional()
    ImgUrlUser?: string;
}