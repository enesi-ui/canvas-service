import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ComponentInstancesService } from './component-instances.service';
import {
  UpdateComponentInstanceDto,
  CreateComponentInstanceDto,
} from './component-instance.dto';

@Controller('component-instances')
export class ComponentInstancesController {
  constructor(
    private readonly componentInstancesService: ComponentInstancesService,
  ) {}

  @Post()
  create(@Body() createComponentInstanceDto: CreateComponentInstanceDto) {
    return this.componentInstancesService.create(createComponentInstanceDto);
  }

  @Get()
  findAll() {
    return this.componentInstancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentInstancesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateComponentInstanceDto: UpdateComponentInstanceDto,
  ) {
    return this.componentInstancesService.update(
      id,
      updateComponentInstanceDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.componentInstancesService.remove(id);
  }
}
