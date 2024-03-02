import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto, userId: number) {
    const newTodo = {
      ...createTodoDto,
      userId,
    };
    return await this.prisma.todo.create({
      data: newTodo,
    });
  }

  async findAll(userId: number) {
    return await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(id: number, userId: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID "${id}" not found`);
    }

    if (todo.userId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to access this todo',
      );
    }

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
