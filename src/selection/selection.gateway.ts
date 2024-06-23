import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { WebsocketExceptionsFilter } from '../filters/ws-exception.filter';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { UpdateSelectionDto } from './selection.dto';
import { map } from 'rxjs/operators';
import { Server } from 'ws';
import { SelectionService } from './selection.service';
import { Selection } from './selection.schema';

@UseFilters(new WebsocketExceptionsFilter())
@UsePipes(new ValidationPipe({ transform: true }))
@WebSocketGateway(8082)
export class SelectionGateway {
  constructor(private readonly selectionService: SelectionService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('selection/:canvasId/get')
  onSelection(
    @MessageBody() canvasId: string,
  ): Observable<WsResponse<{ canvasId: string; shapeIds: string[] }>> {
    const selections = from(this.selectionService.find(canvasId));
    return selections.pipe(
      map((item) => ({ event: 'selection/:canvasId/get', data: item })),
    );
  }

  @SubscribeMessage('selection/:canvasId/put')
  onSelectionPut(
    @MessageBody() data: UpdateSelectionDto,
  ): Observable<WsResponse<{ canvasId: string; shapeIds: string[] }>> {
    const selection = from(this.selectionService.update(data));
    return selection.pipe(
      map((item) => ({ event: 'selection/:canvasId/put', data: item })),
    );
  }
}
