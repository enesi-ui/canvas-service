import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { VariantService } from './variant.service';
import { CreateVariantDto, UpdateVariantDto } from './variant.dto';

@WebSocketGateway()
export class VariantGateway {
  constructor(private readonly variantService: VariantService) {}

  @SubscribeMessage('createVariant')
  create(@MessageBody() createVariantDto: CreateVariantDto) {
    return this.variantService.create(createVariantDto);
  }

  @SubscribeMessage('findAllVariant')
  findAll() {
    return this.variantService.findAll();
  }

  @SubscribeMessage('findOneVariant')
  findOne(@MessageBody() id: string) {
    return this.variantService.findOne(id);
  }

  @SubscribeMessage('updateVariant')
  update(@MessageBody() updateVariantDto: UpdateVariantDto) {
    return this.variantService.update(updateVariantDto.id, updateVariantDto);
  }

  @SubscribeMessage('removeVariant')
  remove(@MessageBody() id: string) {
    return this.variantService.remove(id);
  }
}
