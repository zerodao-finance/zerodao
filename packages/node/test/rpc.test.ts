import { RPCServer } from "../lib/rpc";

const timeout = async (time) => {
  await new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

describe("server", () => {
  let rpc: RPCServer = RPCServer.init();

  before(async () => {
    rpc.start();
    console.log("starting");
  });

  it("should send a message to the rpc server", async () => {
    console.log(rpc);
    await timeout(10000);
  });
});
