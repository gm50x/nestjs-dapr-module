import { ApiHeader, ApiProperty } from '@nestjs/swagger';

export const CloudEventContentType = () =>
  ApiHeader({
    name: 'Content-Type',
    schema: {
      type: typeof String,
      default: 'application/cloudevents+json',
    },
  });

export interface ICloudEvent<T> {
  id: string;
  source: string;
  type: string;
  pubsubname: string;
  tracestate: string;
  specversion: string;
  datacontenttype: string;
  topic: string;
  traceid: string;
  data: T;
}

export function CloudEvent<T>(
  classRef: new (...args) => T,
): new (...args) => ICloudEvent<T> {
  class InnerCloudEvent<T> {
    @ApiProperty()
    id: string;

    @ApiProperty()
    source: string;

    @ApiProperty()
    type: string;

    @ApiProperty()
    pubsubname: string;

    @ApiProperty()
    tracestate: string;

    @ApiProperty()
    specversion: string;

    @ApiProperty()
    datacontenttype: string;

    @ApiProperty()
    topic: string;

    @ApiProperty()
    traceid: string;

    @ApiProperty({ type: classRef })
    data: T;
  }

  return InnerCloudEvent;
}
