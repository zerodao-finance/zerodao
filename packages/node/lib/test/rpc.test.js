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
const rpc_1 = require("../lib/rpc");
const timeout = (time) => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => {
        setTimeout(resolve, time);
    });
});
describe("server", () => {
    let rpc = rpc_1.RPCServer.init();
    before(() => __awaiter(void 0, void 0, void 0, function* () {
        rpc.start();
        console.log("starting");
    }));
    it("should send a message to the rpc server", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(rpc);
        yield timeout(10000);
    }));
});
//# sourceMappingURL=rpc.test.js.map