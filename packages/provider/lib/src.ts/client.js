"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
class Client {
    constructor(url) {
        this.service = undefined;
        const packageDefinition = protoLoader.loadSync(Client.PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        let pkg = grpc.loadPackageDefinition(packageDefinition);
        this.service = new pkg.RpcService(`${url || Client.URL}`, grpc.credentials.createInsecure());
    }
    handleTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.service.handleTransaction(data, (err, response) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(response);
                    }
                });
            });
        });
    }
}
exports.Client = Client;
Client.PROTO_PATH = __dirname + '/../../proto/ZeroProtocol.proto';
Client.URL = '0.0.0.0:50051';
//# sourceMappingURL=client.js.map