import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe } from '@nestjs/common';

import { CreateOrderDto } from './dto/create-order.dto';
import { StatusDto } from './dto/status.dto';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { OrderPaginationDto } from './dto/order-pagination.dto';

@Controller('orders')
export class OrdersController {

  constructor(
      @Inject(NATS_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersClient.send(
      { cmd: 'create_order' }, 
      createOrderDto
    );
  }

  @Get()
  async findAll( @Query() orderPaginationDto: OrderPaginationDto ) {
    try {
      const orders = await firstValueFrom(
        this.ordersClient.send('find_all_orders', orderPaginationDto)
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.ordersClient.send({ cmd: 'find_one_order' }, { id })
      );
      return order;
    } catch (error) {
      ///throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    try {
      return this.ordersClient.send('find_all_orders', {
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      //throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    return this.ordersClient.send({ cmd: 'change_order_status' }, { id, ...statusDto });
  }
}
