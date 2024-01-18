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
import { MainComponentsService } from '../main-components/main-components.service';
import { ComponentInstancesService } from '../component-instances/component-instances.service';
import { CreateComponentInstanceDto } from '../component-instances/component-instance.dto';
import { ComponentInstance } from '../component-instances/component-instance.schema';
import { CreateMainComponentDto } from '../main-components/main-component.dto';

@WebSocketGateway(8080)
export class EventsGateway {
  constructor(
    private readonly shapeService: ShapesService,
    private readonly mainComponentService: MainComponentsService,
    private readonly componentInstanceService: ComponentInstancesService,
  ) {}

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
  onShapeMainComponent(
    @MessageBody() id: string,
  ): Observable<WsResponse<MainComponent>> {
    const shape = from(this.shapeService.getMainComponent(id));
    return shape.pipe(
      map((item) => ({ event: 'shapes/get/:id/main-component', data: item })),
    );
  }

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

  @SubscribeMessage('main-components/post')
  onMainComponentPost(
    @MessageBody() data: CreateMainComponentDto,
  ): Observable<WsResponse<MainComponent>> {
    const mainComponent = from(this.mainComponentService.create(data));
    return mainComponent.pipe(
      map((item) => ({ event: 'main-components/post', data: item })),
    );
  }

  @SubscribeMessage('main-components/get')
  onMainComponents(): Observable<WsResponse<MainComponent[]>> {
    const mainComponents = from(this.mainComponentService.findAll());
    return mainComponents.pipe(
      map((item) => ({ event: 'main-components/get', data: item })),
    );
  }
}
