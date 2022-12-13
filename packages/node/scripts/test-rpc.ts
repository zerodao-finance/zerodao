import { RPCServer } from "../lib/rpc";

(async () => {
	let server = RPCServer.init();
	server.start();
})();
