export class InvokeArgs {
  authorization?: string;
  method: 'POST' | 'PUT' | 'GET' | 'DELETE';
  app: string;
  path: string;
  data?: any;

  constructor(args?: InvokeArgs) {
    Object.assign(this, args || {});
  }
}
