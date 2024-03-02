import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users') // Note: changed to 'users' to follow REST conventions
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    UserDto: UserDto,
  ) {
    return this.userService.updateUser(+id, UserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    await this.userService.deleteUser(+id);
    return { message: 'User successfully deleted.' };
  }
}
