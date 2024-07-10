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
import { Shape } from '../shapes/shape.schema';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/ws-exception.filter';
import { WebSocket } from 'ws';
import { UpdateObjectDto, UpdateZIndexObjectDto } from './objects.dto';
import { ObjectsService } from './objects.service';
import { EnesiObject } from './object';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway(8082)
export class ObjectsGateway {
  constructor(private readonly objectsService: ObjectsService) {}

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('objects/get')
  onObjects(
    @MessageBody() canvasId: string,
  ): Observable<WsResponse<EnesiObject[]>> {
    const objects = from(this.objectsService.findAll(canvasId));
    return objects.pipe(map((item) => ({ event: 'objects/get', data: item })));
  }

  @SubscribeMessage('objects/:id/get')
  onObjectById(@MessageBody() id: string): Observable<WsResponse<EnesiObject>> {
    const shape = from(this.objectsService.findOne(id));
    return shape.pipe(
      map((item) => ({ event: 'objects/:id/get', data: item })),
    );
  }

  @SubscribeMessage('objects/:id/patch')
  onObjectPut(
    @MessageBody() data: UpdateObjectDto,
    @ConnectedSocket() client: WebSocket,
  ): Observable<WsResponse<Shape>> {
    const shape = from(this.objectsService.update(data));
    return shape.pipe(
      map((item) => {
        this.server.clients.forEach((otherClient) => {
          if (
            client !== otherClient &&
            otherClient.readyState === WebSocket.OPEN
          ) {
            otherClient.send(
              JSON.stringify({ event: 'objects/:id/patch', data: item }),
            );
          }
        });
        return item;
      }),
      map((item) => ({ event: 'objects/:id/patch', data: item })),
    );
  }

  @SubscribeMessage('objects/:id/z-index/patch')
  onObjectZIndexPatch(
    @MessageBody() data: UpdateZIndexObjectDto,
    @ConnectedSocket() client: WebSocket,
  ): Observable<WsResponse<EnesiObject[]>> {
    const shapes = from(this.objectsService.updateZIndex(data));
    return shapes.pipe(
      map((item) => {
        this.server.clients.forEach((otherClient) => {
          if (
            client !== otherClient &&
            otherClient.readyState === WebSocket.OPEN
          ) {
            otherClient.send(
              JSON.stringify({
                event: 'objects/:id/z-index/patch',
                data: item,
              }),
            );
          }
        });
        return item;
      }),
      map((item) => ({ event: 'objects/:id/z-index/patch', data: item })),
    );
  }
}
