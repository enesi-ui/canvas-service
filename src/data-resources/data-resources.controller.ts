import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DataResourcesService } from './data-resources.service';
import {
  CreateDataRessourceDto,
  UpdateDataRessourceDto,
} from './data-resource.dto';
@Controller('data-resources')
export class DataResourcesController {
  constructor(private readonly dataResourcesService: DataResourcesService) {}

  @Post()
  create(@Body() createDataRessourceDto: CreateDataRessourceDto) {
    return this.dataResourcesService.create(createDataRessourceDto);
  }

  @Get()
  findAll() {
    return this.dataResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dataResourcesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDataRessourceDto: UpdateDataRessourceDto,
  ) {
    return this.dataResourcesService.update(id, updateDataRessourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dataResourcesService.remove(id);
  }
}
