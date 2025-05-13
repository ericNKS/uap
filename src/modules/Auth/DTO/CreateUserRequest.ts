import { IsString, IsEmail, MinLength, ValidateNested, IsOptional, IsArray, Max, Min, Length } from 'class-validator';
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
  @IsOptional()
  telUser?: string = '';

  @IsString()
  @Length(11, 16)
  cpfOrCnpjUser: string = '';

  @IsString()
  @IsOptional()
  crpUser?: string = '';

  @IsString()
  @IsOptional()
  imgurlUser?: string = '';

  @IsString()
  genUser: string = '';

  @IsString()
  @IsOptional()
  rulesUser?: string = 'RULE_USER';

  @IsString()
  userType: string = 'paciente'

}