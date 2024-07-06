import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

export class MongooseTestModule {
  mongodb: MongoMemoryReplSet | undefined;
  async forRoot(options: MongooseModuleOptions = {}) {
    return MongooseModule.forRootAsync({
      useFactory: async () => {
        this.mongodb = await MongoMemoryReplSet.create();
        const mongoUri = this.mongodb.getUri();
        return {
          uri: mongoUri,
          ...options,
        };
      },
    });
  }
  async stop() {
    if (this.mongodb) await this.mongodb.stop();
  }
}
