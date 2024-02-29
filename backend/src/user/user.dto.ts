// src/users/dto/update-user.dto.ts

import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserType)
  userType?: UserType;
}
