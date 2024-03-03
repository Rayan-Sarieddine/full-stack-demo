import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
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
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

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
