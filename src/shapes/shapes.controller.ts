import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ShapesService } from './shapes.service';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';

@Controller('shapes')
export class ShapesController {
  constructor(private readonly shapesService: ShapesService) {}

  @Post()
  create(@Body() createShapeDto: CreateShapeDto) {
    return this.shapesService.create(createShapeDto);
  }

  @Get()
  findAll() {
    return this.shapesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shapesService.findOne(id);
  }

  @Get(':id/main-component')
  getComponent(@Param('id') id: string) {
    return this.shapesService.getMainComponent(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShapeDto: UpdateShapeDto) {
    return this.shapesService.update(id, updateShapeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shapesService.remove(id);
  }
}
