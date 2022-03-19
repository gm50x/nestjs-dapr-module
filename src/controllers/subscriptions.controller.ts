import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';

import { SubscriptionsContainer } from '../containers';
import { SubscriptionOutput } from '../models';

export interface ISubscriptionController {
  getSubscriptions(): Promise<Array<SubscriptionOutput>>;
}

export function SubscriptionsController(
  tags = ['Subscriptions'],
): new (...args) => ISubscriptionController {
  @Controller('dapr')
  @ApiTags(...tags)
  @ApiExcludeController()
  class InnerSubscriptionController implements ISubscriptionController {
    constructor(private readonly subscriptions: SubscriptionsContainer) {}

    @Get('subscribe')
    async getSubscriptions() {
      const output: Array<SubscriptionOutput> = [];
      for (const subscription of this.subscriptions) {
        const {
          pubsub = 'pubsub',
          topic,
          route,
          rawPayload = 'false',
        } = subscription;

        output.push({
          pubsubname: pubsub,
          topic,
          route,
          metadata: { rawPayload },
        });
      }

      return output;
    }
  }

  return InnerSubscriptionController;
}
