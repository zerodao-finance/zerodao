import { grpc } from "grpc";
import { protoLoader } from "@grpc/proto-loader";
var PROTO_PATH = __dirname + "/../../proto/ZeroProtocol.proto";
/**
 *
 * Use
 *
 * import { getServer } from "<path-to>/rpc"
 *
 * let rpcServer = new getServer().init();
 *
 */


export function getServer() {
	this.server = new grpc.Server();
	this.running = false;
	this.routeServer = undefined;
}



getServer.prototype._addService = ({ routeguide }: any) => {
	this.server.addService(routeguide.RouteGuide.service, {
		broadcastTx: this._broadcastTx
	});
}

getServer.prototype.init = () => {	
	var packageDefs = protoLoader.loadSync(
		PROTO_PATH,
		{ keepCase: true,
			longs: String,
			enums: String, 
			defaults: true,
			oneofs: true
		});
	var protoDescriptor = grpc.loadPackageDefinitions(packageDefs);

	routeguide = protoDescriptor.routeguide;
	this._addService(routeguide);	
	this.routeServer = this.server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
		routeServer.start();
	});
}

getServer.prototype._handleTx = (tx) => {
	//TODO
	return 0 //return status;
} 


getServer.prototype._broadcastTx = (call, callback) => {
	callback(null, this._handleTx(call.request));
}



