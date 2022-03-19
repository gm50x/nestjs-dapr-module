import { KeyValuePairType } from 'dapr-client/types/KeyValuePair.type';

export type KeyValuePairMetadataType = KeyValuePairType & {
  metadata?: {
    ttlInSeconds?: string;
  };
};
