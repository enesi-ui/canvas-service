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
import { ComponentPropertiesService } from './component-properties.service';
import { ComponentProperty } from './component-property.schema';
import {
  CreateComponentPropertyDto,
  UpdateComponentPropertyDto,
} from './component-property.dto';

@WebSocketGateway(8082)
export class ComponentPropertiesGateway {
  constructor(
    private readonly componentPropertyService: ComponentPropertiesService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('main-components/:id/properties/get')
  onMainComponentProperties(
    @MessageBody() id: string,
  ): Observable<WsResponse<ComponentProperty[]>> {
    const mainComponent = from(
      this.componentPropertyService.findAllByMainComponent(id),
    );
    return mainComponent.pipe(
      map((item) => ({
        event: 'main-components/:id/properties/get',
        data: item,
      })),
    );
  }

  @SubscribeMessage('main-components/:id/properties/post')
  onMainComponentPropertiesPost(
    @MessageBody() data: CreateComponentPropertyDto,
  ): Observable<WsResponse<ComponentProperty>> {
    const componentInstance = from(this.componentPropertyService.create(data));
    return componentInstance.pipe(
      map((item) => ({
        event: 'main-components/:id/properties/post',
        data: item,
      })),
    );
  }

  @SubscribeMessage('properties/:id/get')
  onMainComponentPropertiesById(
    @MessageBody() id: string,
  ): Observable<WsResponse<ComponentProperty>> {
    const mainComponent = from(this.componentPropertyService.findOne(id));
    return mainComponent.pipe(
      map((item) => ({
        event: 'properties/:propertyId',
        data: item,
      })),
    );
  }

  @SubscribeMessage('properties/:id/put')
  onMainComponentPropertiesPut(
    @MessageBody() data: UpdateComponentPropertyDto,
  ): Observable<WsResponse<ComponentProperty>> {
    const mainComponent = from(this.componentPropertyService.update(data));
    return mainComponent.pipe(
      map((item) => ({
        event: 'properties/:propertyId/put',
        data: item,
      })),
    );
  }

  @SubscribeMessage('properties/:id/delete')
  onMainComponentPropertiesDelete(
    @MessageBody() id: string,
  ): Observable<WsResponse<ComponentProperty>> {
    const mainComponent = from(this.componentPropertyService.remove(id));
    return mainComponent.pipe(
      map((item) => ({
        event: 'properties/:id/delete',
        data: item,
      })),
    );
  }
}
