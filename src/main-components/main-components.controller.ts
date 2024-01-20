import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MainComponent } from './main-component.schema';
import {
  CreateMainComponentDto,
  UpdateMainComponentDto,
} from './main-component.dto';
import { MainComponentsService } from './main-components.service';

@Controller('main-components')
export class MainComponentsController {
  constructor(private readonly mainComponentsService: MainComponentsService) {}

  @Post()
  async create(@Body() createMainComponentDto: CreateMainComponentDto) {
    await this.mainComponentsService.create(createMainComponentDto);
  }

  @Get()
  async findAll(): Promise<MainComponent[]> {
    return this.mainComponentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MainComponent> {
    return this.mainComponentsService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.mainComponentsService.delete(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMainComponentDto: Omit<UpdateMainComponentDto, 'id'>,
  ) {
    return this.mainComponentsService.update({ ...updateMainComponentDto, id });
  }
}
