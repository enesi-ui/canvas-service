import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class MongooseTestModule {
  mongodb: MongoMemoryServer | undefined;
  async forRoot(options: MongooseModuleOptions = {}) {
    return MongooseModule.forRootAsync({
      useFactory: async () => {
        this.mongodb = await MongoMemoryServer.create();
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
