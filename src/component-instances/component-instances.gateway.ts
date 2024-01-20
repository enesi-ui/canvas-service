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
import { ComponentInstancesService } from './component-instances.service';
import { CreateComponentInstanceDto } from './component-instance.dto';
import { ComponentInstance } from './component-instance.schema';

@WebSocketGateway(8084)
export class ComponentInstancesGateway {
  constructor(
    private readonly componentInstanceService: ComponentInstancesService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('component-instances/post')
  onComponentInstancePost(
    @MessageBody() data: CreateComponentInstanceDto,
  ): Observable<WsResponse<ComponentInstance>> {
    const componentInstance = from(this.componentInstanceService.create(data));
    return componentInstance.pipe(
      map((item) => ({ event: 'component-instances/post', data: item })),
    );
  }

  @SubscribeMessage('component-instances/get')
  onComponentInstances(): Observable<WsResponse<ComponentInstance[]>> {
    const componentInstances = from(this.componentInstanceService.findAll());
    return componentInstances.pipe(
      map((item) => ({ event: 'component-instances/get', data: item })),
    );
  }
}
