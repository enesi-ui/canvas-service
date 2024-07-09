import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Canvas, CanvasSchema } from './canvas.schema';
import { CanvasService } from './canvas.service';
import { CanvasGateway } from './canvas.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Canvas.name, schema: CanvasSchema }]),
  ],
  providers: [CanvasService, CanvasGateway],
})
export class CanvasModule {}
