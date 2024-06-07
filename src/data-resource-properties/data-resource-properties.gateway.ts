import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { DataResourcePropertiesService } from './data-resource-properties.service';
import {
  CreateDataResourcePropertyDto,
  UpdateDataResourcePropertyDto,
} from './data-resource-property.dto';

@WebSocketGateway(8082)
export class DataResourcePropertiesGateway {
  constructor(
    private readonly dataResourcePropertiesService: DataResourcePropertiesService,
  ) {}

  @SubscribeMessage('data-resource/properties/post')
  create(
    @MessageBody() createDataResourcePropertyDto: CreateDataResourcePropertyDto,
  ) {
    return this.dataResourcePropertiesService.create(
      createDataResourcePropertyDto,
    );
  }

  @SubscribeMessage('data-resource/:id/properties/get')
  onFileAll(@MessageBody() id: string) {
    return this.dataResourcePropertiesService.findAllByDataResourceId(id);
  }

  @SubscribeMessage('data-resource/properties/:id/get')
  onFindOne(@MessageBody() id: string) {
    return this.dataResourcePropertiesService.findOne(id);
  }

  @SubscribeMessage('data-resource/properties/:id/put')
  update(
    @MessageBody() updateDataResourcePropertyDto: UpdateDataResourcePropertyDto,
  ) {
    return this.dataResourcePropertiesService.update(
      updateDataResourcePropertyDto,
    );
  }

  @SubscribeMessage('data-resource/properties/:id/delete')
  onDelete(@MessageBody() id: number) {
    return this.dataResourcePropertiesService.remove(id);
  }
}
