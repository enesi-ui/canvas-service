import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainComponentsModule } from './main-components/main-components.module';
import { ShapesModule } from './shapes/shapes.module';
import { ComponentInstancesModule } from './component-instances/component-instances.module';
import { ComponentPropertiesModule } from './component-properties/component-properties.module';
import { DataResourcesModule } from './data-resources/data-resources.module';
import { DataResourcePropertiesModule } from './data-resource-properties/data-resource-properties.module';
import { VariantModule } from './variant/variant.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SelectionModule } from './selection/selection.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
    MainComponentsModule,
    ShapesModule,
    ComponentInstancesModule,
    ComponentPropertiesModule,
    DataResourcesModule,
    DataResourcePropertiesModule,
    VariantModule,
    SelectionModule,
    ObjectsModule,
  ],
})
export class AppModule {}
