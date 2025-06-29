import { IsOptional, IsString, Length} from "class-validator";

export default class UpdateUserDTO {
    @IsOptional()
    @IsString()
    NomeUser?: string = undefined;

    @IsOptional()
    @Length(11, 11)
    @IsString()
    TelUser?: string = undefined;

    @IsOptional()
    @IsString()
    GenUser?: string = undefined;

    @IsOptional()
    @IsString()
    PronomeUser?: string = undefined;

    @IsOptional()
    ImgUrlUser?: string = undefined;
}