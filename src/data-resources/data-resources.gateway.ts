import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { DataResourcesService } from './data-resources.service';
import {
  CreateDataResourceDto,
  UpdateDataResourceDto,
} from './data-resource.dto';

@WebSocketGateway(8082)
export class DataResourcesGateway {
  constructor(private readonly dataResourcesService: DataResourcesService) {}

  @SubscribeMessage('data-resources/post')
  create(@MessageBody() createDataResourceDto: CreateDataResourceDto) {
    return this.dataResourcesService.create(createDataResourceDto);
  }

  @SubscribeMessage('data-resources/:id/get')
  onFindAll() {
    return this.dataResourcesService.findAll();
  }

  @SubscribeMessage('data-resources/:id/get')
  onFindOne(@MessageBody() id: string) {
    return this.dataResourcesService.findOne(id);
  }

  @SubscribeMessage('data-resources/:id/put')
  update(@MessageBody() updateDataResourceDto: UpdateDataResourceDto) {
    return this.dataResourcesService.update(
      updateDataResourceDto.id,
      updateDataResourceDto,
    );
  }

  @SubscribeMessage('data-resources/:id/delete')
  onDelete(@MessageBody() id: string) {
    return this.dataResourcesService.remove(id);
  }
}
