import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DaprClient } from 'dapr-client';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

import { KeyValuePairMetadataType } from '../models';
import { InvokeArgs } from '../models/invoke.model';

@Injectable()
export class DaprClientService extends DaprClient {
  private readonly url: string;
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {
    super(config.get('DAPR_HOST', '0.0.0.0'), config.get('DAPR_PORT', '3500'));
    const daprHost = config.get('DAPR_HOST', '0.0.0.0');
    const daprPort = config.get('DAPR_PORT', '3500');
    this.url = `http://${daprHost}:${daprPort}`;
  }

  async stateSaveTTL(store: string, data: Array<KeyValuePairMetadataType>) {
    const { data: output } = await firstValueFrom(
      this.http.post(`${this.url}/v1.0/state/${store}`, data, {
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    return output;
  }

  async invoke<T = any>(args: InvokeArgs): Promise<AxiosResponse<T>> {
    const { method, app, path, authorization, data } = args;

    return firstValueFrom(
      this.http.request({
        method,
        url: `${this.url}/v1.0/invoke/${app}/method/${path.replace(
          /(^\/|\/$)/g,
          '',
        )}`,
        data,
        headers: {
          ...(authorization ? { authorization } : {}),
        },
      }),
    );
  }
}
