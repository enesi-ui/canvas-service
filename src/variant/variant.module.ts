import { Module } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantGateway } from './variant.gateway';
import {
  MainComponent,
  MainComponentSchema,
} from '../main-components/main-component.schema';
import { Variant, VariantSchema } from './variant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [VariantGateway, VariantService],
  imports: [
    MongooseModule.forFeature([
      { name: Variant.name, schema: VariantSchema },
      { name: MainComponent.name, schema: MainComponentSchema },
    ]),
  ],
})
export class VariantModule {}
