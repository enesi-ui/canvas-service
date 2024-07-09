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
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/ws-exception.filter';
import { CanvasService } from './canvas.service';
import { Canvas } from './canvas.schema';
import { CanvasDto } from './canvas.dto';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway(8082)
export class CanvasGateway {
  constructor(private readonly canvasService: CanvasService) {}

  @WebSocketServer()
  server: Server;
  @SubscribeMessage('canvases/get')
  onCanvases(): Observable<WsResponse<Canvas[]>> {
    const canvases = from(this.canvasService.findAll());
    return canvases.pipe(
      map((item) => ({ event: 'canvases/get', data: item })),
    );
  }

  @SubscribeMessage('canvases/:id/get')
  onCanvasById(@MessageBody() id: string): Observable<WsResponse<Canvas>> {
    const shape = from(this.canvasService.findOne(id));
    return shape.pipe(
      map((item) => ({ event: 'canvases/:id/get', data: item })),
    );
  }

  @SubscribeMessage('canvases/post')
  onCanvasPost(@MessageBody() data: CanvasDto): Observable<WsResponse<Canvas>> {
    const shape = from(this.canvasService.create(data));
    return shape.pipe(
      map((item) => ({ event: 'canvases/:id/post', data: item })),
    );
  }
}
