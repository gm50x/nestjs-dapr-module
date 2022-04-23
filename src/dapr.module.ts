import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionsContainer, subscriptions } from './containers';
import { SubscriptionsController } from './controllers';
import { Subscription } from './models';
import { DaprClientService, DaprService } from './services';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [SubscriptionsContainer, DaprClientService, DaprService],
  exports: [DaprService],
})
export class DaprModule {
  static subscribe(
    ...subscription: Array<Subscription | [string, string] | string>
  ) {
    const mapSubscription = (
      subs: string | [string, string] | Subscription,
    ): Subscription => {
      if (typeof subs === 'string') {
        return { topic: subs, route: subs };
      }

      if (Array.isArray(subs)) {
        const [topic, route] = subs;
        return { topic, route };
      }

      return { ...subs };
    };

    if (Array.isArray(subscription)) {
      subscriptions.push(...subscription.map(mapSubscription));
    } else {
      subscriptions.push(mapSubscription(subscription));
    }

    return {
      module: DaprModule,
      controllers: [SubscriptionsController],
      providers: [
        {
          useValue: subscriptions,
          provide: SubscriptionsContainer,
        },
      ],
    };
  }
}
