import { IsString, IsEmail, MinLength, ValidateNested, IsOptional, IsArray, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

class PasswordDTO {
  @IsString()
  @MinLength(8)
  first: string = '';

  @IsString()
  @MinLength(8)
  second: string = '';
}

export class CreateUserRequest {
  @IsString()
  nomeUser: string = '';

  @IsEmail()
  emailUser: string = '';

  @ValidateNested()
  @Type(() => PasswordDTO)
  senhaUser: PasswordDTO = new PasswordDTO();

  @IsString()
  telUser: string = '';

  @IsString()
  @Max(16)
  @Min(11)
  cpforcnpjUser: string = '';

  @IsString()
  crpUser: string = '';

  @IsString()
  imgurlUser: string = '';

  @IsString()
  genUser: string = '';

  @IsString()
  rulesUser: string = '';

  @IsString()
  @Max(1)
  stsativoUser: string = '';

}