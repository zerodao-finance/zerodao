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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const grpc_js_1 = __importDefault(require("@grpc/grpc-js"));
const proto_loader_1 = __importDefault(require("@grpc/proto-loader"));
class Client {
    constructor({ port, server } = {}) {
        this.service = undefined;
        const packageDefinition = proto_loader_1.default.loadSync(Client.PROTO_PATH, {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });
        let pkg = grpc_js_1.default.loadPackageDefinition(packageDefinition);
        this.service = new pkg.RpcService(`${server || Client.SERVER}:${port || Client.PORT}`, grpc_js_1.default.credentials.createInsecure());
    }
    handleTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const reply = this.service.handleTransaction(data, (err, response) => {
                if (err)
                    throw err;
                return response;
            });
            return reply;
        });
    }
}
exports.Client = Client;
Client.PROTO_PATH = __dirname + '/../proto/ZeroProtocol.proto';
Client.PORT = "50051";
Client.SERVER = '0.0.0.0';
//# sourceMappingURL=client.js.map