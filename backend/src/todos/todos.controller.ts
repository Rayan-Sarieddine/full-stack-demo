import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { GetUser } from 'src/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createTodoDto: CreateTodoDto,
    @GetUser('userId') userId: number,
  ) {
    return this.todosService.create(createTodoDto, userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@GetUser('userId') userId: number) {
    return this.todosService.findAll(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.todosService.findOne(+id, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @GetUser('userId') userId: number,
  ) {
    return this.todosService.update(+id, userId, updateTodoDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @GetUser('userId') userId: number) {
    return this.todosService.remove(+id, userId);
  }
}
