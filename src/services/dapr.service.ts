import { Injectable } from '@nestjs/common';
import { HttpMethod } from 'dapr-client';
import { DaprClientService } from './dapr-client.service';

import { KeyValuePairType } from 'dapr-client/types/KeyValuePair.type';
import { StateQueryType } from 'dapr-client/types/state/StateQuery.type';
import { KeyValuePairMetadataType } from '../models';

@Injectable()
export class DaprService {
  constructor(private readonly client: DaprClientService) {}

  async getSecret(key: string, store = 'secretstore') {
    const secret = await this.client.secret.get(store, key);
    return secret[key];
  }

  async publish(topic: string, data?: any, pubsub = 'pubsub') {
    return this.client.pubsub.publish(pubsub, topic, data);
  }

  async stateSave(data: Array<KeyValuePairType>, store = 'statestore') {
    return this.client.state.save(store, data);
  }

  async stateSaveTTL(
    data: Array<KeyValuePairMetadataType>,
    store = 'statestore',
  ) {
    return this.client.stateSaveTTL(store, data);
  }

  async stateDelete(key: string, store = 'statestore') {
    return this.client.state.delete(store, key);
  }

  async stateGet<T>(key: string, store = 'statestore') {
    return ((await this.client.state.get(store, key)) as Promise<T>) || null;
  }

  async stateGetBulk<T>(keys: Array<string>, store = 'statestore') {
    return this.client.state
      .getBulk(store, keys)
      .then((result) => result || null)
      .then((result) => result?.map(({ data }) => data) as Array<T>);
  }

  async stateQuery<T>(query?: Partial<StateQueryType>, store = 'statestore') {
    return this.client.state
      .query(store, query as StateQueryType)
      .then(
        ({ results, token }) =>
          [results?.map((x) => x.data) || [], token] as [Array<T>, string],
      );
  }

  async invokeGet<T>(app: string, path: string) {
    const result = (await this.client.invoker.invoke(
      app,
      path,
      HttpMethod.GET,
    )) as unknown as Promise<T>;

    return result || null;
  }

  async invokePost<T>(app: string, path: string, data?: any) {
    const result = (await this.client.invoker.invoke(
      app,
      path,
      HttpMethod.POST,
      data,
    )) as unknown as Promise<T>;
    return result || null;
  }

  async invokePut<T>(app: string, path: string, data?: any) {
    const result = (await this.client.invoker.invoke(
      app,
      path,
      HttpMethod.PUT,
      data,
    )) as unknown as Promise<T>;
    return result || null;
  }

  async invokeDelete<T>(app: string, path: string) {
    const result = (await this.client.invoker.invoke(
      app,
      path,
      HttpMethod.DELETE,
    )) as unknown as Promise<T>;

    return result || null;
  }
}
