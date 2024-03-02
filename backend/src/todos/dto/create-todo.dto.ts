import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PriorityLevel {
  TOP = 'TOP',
  MEDIUM = 'MEDIUM',
  AVERAGE = 'AVERAGE',
}

export class CreateTodoDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PriorityLevel)
  priorityLevel: PriorityLevel;

  @IsOptional()
  @IsBoolean()
  completed?: boolean = false;

  @IsOptional()
  @IsBoolean()
  pinned?: boolean = false;
}
