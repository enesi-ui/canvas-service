import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { ShapesService } from './shapes.service';
import { Shape } from './shape.schema';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';
import { MainComponent } from '../main-components/main-component.schema';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/ws-exception.filter';
import { WebSocket } from 'ws';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway(8082)
export class ShapesGateway {
  constructor(private readonly shapeService: ShapesService) {}

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('shapes/get')
  onShapes(@MessageBody() canvasId: string): Observable<WsResponse<Shape[]>> {
    const shapes = from(this.shapeService.findAll(canvasId));
    return shapes.pipe(map((item) => ({ event: 'shapes/get', data: item })));
  }

  @SubscribeMessage('shapes/post')
  onShape(@MessageBody() data: CreateShapeDto): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.create(data));
    return shape.pipe(
      map((item) => ({ event: 'shapes/:id/post', data: item })),
    );
  }

  @SubscribeMessage('shapes/:id/get')
  onShapeById(@MessageBody() id: string): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.findOne(id));
    return shape.pipe(map((item) => ({ event: 'shapes/:id/get', data: item })));
  }

  @SubscribeMessage('shapes/:id/main-component/get')
  onShapeMainComponent(
    @MessageBody() id: string,
  ): Observable<WsResponse<MainComponent>> {
    const shape = from(this.shapeService.getMainComponent(id));
    return shape.pipe(
      map((item) => ({ event: 'shapes/:id/main-component/get', data: item })),
    );
  }

  @SubscribeMessage('shapes/:id/patch')
  onShapePut(
    @MessageBody() data: UpdateShapeDto,
    @ConnectedSocket() client: WebSocket,
  ): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.update(data));
    return shape.pipe(
      map((item) => {
        this.server.clients.forEach((otherClient) => {
          if (
            client !== otherClient &&
            otherClient.readyState === WebSocket.OPEN
          ) {
            otherClient.send(
              JSON.stringify({ event: 'shapes/:id/patch', data: item }),
            );
          }
        });
        return item;
      }),
      map((item) => ({ event: 'shapes/:id/patch', data: item })),
    );
  }

  @SubscribeMessage('shapes/:id/delete')
  onShapeDelete(@MessageBody() id: string): Observable<WsResponse<Shape>> {
    const shape = from(this.shapeService.remove(id));
    return shape.pipe(
      map((item) => ({ event: 'shapes/:id/delete', data: item })),
    );
  }
}
