export function createService(handler: string, impl: any) {
  return [handler, function (call, callback) => {
    callback(null, (message) => {
      return impl();
    });
  }];
}


