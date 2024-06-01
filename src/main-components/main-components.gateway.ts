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

import { MainComponentsService } from './main-components.service';
import {
  CreateMainComponentDto,
  UpdateMainComponentDto,
} from './main-component.dto';
import { MainComponent } from './main-component.schema';

@WebSocketGateway(8082)
export class MainComponentsGateway {
  constructor(private readonly mainComponentService: MainComponentsService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('main-components/get')
  onMainComponents(): Observable<WsResponse<MainComponent[]>> {
    const mainComponents = from(this.mainComponentService.findAll());
    return mainComponents.pipe(
      map((item) => ({ event: 'main-components/get', data: item })),
    );
  }

  @SubscribeMessage('main-components/post')
  onMainComponentPost(
    @MessageBody() data: CreateMainComponentDto,
  ): Observable<WsResponse<MainComponent>> {
    const mainComponent = from(this.mainComponentService.create(data));
    return mainComponent.pipe(
      map((item) => ({ event: 'main-components/post', data: item })),
    );
  }

  @SubscribeMessage('main-components/:id/put')
  onMainComponentPut(
    @MessageBody() data: UpdateMainComponentDto,
  ): Observable<WsResponse<MainComponent>> {
    const mainComponent = from(this.mainComponentService.update(data));
    return mainComponent.pipe(
      map((item) => ({ event: 'main-components/:id/put', data: item })),
    );
  }
}
