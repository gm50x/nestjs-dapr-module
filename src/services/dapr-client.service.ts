import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DaprClient } from 'dapr-client';
import { firstValueFrom } from 'rxjs';

import { KeyValuePairMetadataType } from '../models';

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
}
