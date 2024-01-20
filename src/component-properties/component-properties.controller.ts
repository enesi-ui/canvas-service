import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComponentPropertiesService } from './component-properties.service';
import {
  UpdateComponentPropertyDto,
  CreateComponentPropertyDto,
} from './component-property.dto';

@Controller('component-properties')
export class ComponentPropertiesController {
  constructor(
    private readonly componentPropertiesService: ComponentPropertiesService,
  ) {}

  @Post()
  create(@Body() createComponentPropertyDto: CreateComponentPropertyDto) {
    return this.componentPropertiesService.create(createComponentPropertyDto);
  }

  @Get()
  findAll() {
    return this.componentPropertiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentPropertiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentPropertyDto: UpdateComponentPropertyDto,
  ) {
    return this.componentPropertiesService.update(updateComponentPropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentPropertiesService.remove(id);
  }
}
