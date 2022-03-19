import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsContainer, subscriptions } from './containers';
import { SubscriptionsController } from './controllers';
import { Subscription } from './models';
import { DaprClientService, DaprService } from './services';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [SubscriptionsContainer, DaprService, DaprClientService],
  exports: [DaprService],
})
export class DaprModule {
  static subscribe(subscription: Array<Subscription> | Subscription) {
    if (Array.isArray(subscription)) {
      subscriptions.push(...subscription);
    } else {
      subscriptions.push(subscription);
    }

    return {
      module: DaprModule,
      controllers: [SubscriptionsController()],
      providers: [
        {
          provide: SubscriptionsContainer,
          useValue: subscriptions,
        },
      ],
    };
  }
}
