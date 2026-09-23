import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ORDER_SERVICE } from 'src/config/services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [OrdersController],
  imports: [NatsModule],
})
export class OrdersModule {}
