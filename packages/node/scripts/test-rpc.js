const { RPCServer } from "../lib/rpc");

(async () => {
  let server = RPCServer.init();
  console.log(server.start());
})();
