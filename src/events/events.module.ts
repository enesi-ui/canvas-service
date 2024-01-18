import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ShapesModule } from '../shapes/shapes.module';

@Module({
  imports: [ShapesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
