import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { ShapesService } from '../shapes/shapes.service';
import { Shape } from '../shapes/shape.schema';
import { CreateShapeDto } from '../shapes/shape.dto';
import { MainComponent } from '../main-components/main-component.schema';

@WebSocketGateway(8080)
export class EventsGateway {
  constructor(private readonly shapeService: ShapesService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('shapes/post')
  onShape(@MessageBody() data: CreateShapeDto): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.create(data));
    return shape.pipe(map((item) => ({ event: 'shapes/post', data: item })));
  }

  @SubscribeMessage('shapes/get')
  onShapes(): Observable<WsResponse<Shape[]>> {
    const shapes = from(this.shapeService.findAll());
    return shapes.pipe(map((item) => ({ event: 'shapes/get', data: item })));
  }

  @SubscribeMessage('shapes/get/:id')
  onShapeById(@MessageBody() id: string): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.findOne(id));
    return shape.pipe(map((item) => ({ event: 'shapes/get/:id', data: item })));
  }

  @SubscribeMessage('shapes/get/:id/main-component')
  onMainComponent(
    @MessageBody() id: string,
  ): Observable<WsResponse<MainComponent>> {
    const shape = from(this.shapeService.getMainComponent(id));
    return shape.pipe(
      map((item) => ({ event: 'shapes/get/:id/main-component', data: item })),
    );
  }
}
