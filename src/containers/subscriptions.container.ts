import { Subscription } from '../models';
export class SubscriptionsContainer extends Array<Subscription> {}
export const subscriptions = new SubscriptionsContainer();
