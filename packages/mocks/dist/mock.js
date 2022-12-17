"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enableGlobalMockRuntime =
  exports.createMockKeeper =
  exports.TEST_KEEPER_ADDRESS =
    void 0;
const zero_1 = require("../../../lib/zero");
const core_1 = require("../../../lib/p2p/core");
const ethers_1 = require("ethers");
const events_1 = require("events");
const UnderwriterRequest_1 = require("../../../lib/UnderwriterRequest");
const keepers = [];
exports.TEST_KEEPER_ADDRESS = "0xec5d65739c722a46cd79951e069753c2fc879b27";
let keeperSigner;
const pending = {};
async function waitForMint(trivial) {
  const mint = await trivial.submitToRenVM(true);
  await new Promise((resolve, reject) =>
    mint.on("deposit", async (deposit) => {
      await resolve(deposit);
      const hash = await deposit.txHash();
      console.log("hash", hash);
      console.log(await deposit);
      let confirmed = await deposit.confirmed();
      confirmed
        .on("target", (target) => {
          console.log(`0/${target} confirmations`);
        })
        .on("confirmation", async (confs, target) => {
          console.log(`${confs}/${target} confirmations`);
          if (confs == 6) {
            await new Promise((resolve, reject) => {
              setTimeout(resolve, 500);
            });
            const repayTx = await trivial.repay(keeperSigner);
            if (pending[trivial.signature])
              pending[trivial.signature].emit("update", {
                request: trivial.signature,
                data: repayTx,
              });
          }
        });
      let status = await deposit.signed();
      status.on("status", (status) => console.log("status", status));
    })
  );
  return mint;
}
const createMockKeeper = async (provider) => {
  const keeper = zero_1.createZeroKeeper({ on() {} });
  provider =
    provider ||
    new ethers_1.ethers.providers.JsonRpcProvider("http://localhost:8545");
  keeperSigner =
    keeperSigner || provider.getSigner(exports.TEST_KEEPER_ADDRESS);
  keepers.push(keeper);
  keeper.advertiseAsKeeper = async () => {};
  keeper.setTxDispatcher = async (fn) => {
    keeper._txDispatcher = fn;
  };
  keeper.setTxDispatcher(async (request, requestType = "TRANSFER") => {
    //@ts-ignore
    const { trivial, func } = (() => {
      console.log("requestType", requestType);
      switch (requestType) {
        case "META":
          return {
            trivial: new UnderwriterRequest_1.UnderwriterMetaRequest(request),
            func: "meta",
          };
        case "BURN":
          return {
            trivial: new UnderwriterRequest_1.UnderwriterBurnRequest(request),
            func: "burn",
          };
        default:
          return {
            trivial: new zero_1.UnderwriterTransferRequest(request),
            func: "loan",
          };
      }
    })();
    try {
      console.log("dry");
      const loan_result = await trivial.dry(keeperSigner);
      console.log("Loan Result", loan_result);
    } catch (err) {
      console.log("ERROR", err);
    }
    if (requestType == "TRANSFER") await waitForMint(trivial);
    console.log(trivial[func], trivial, func);
    const tx = await trivial[func](keeperSigner);
    //@ts-ignore
    trivial.waitForSignature = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        amount:
          requestType == "TRANSFER" &&
          //@ts-ignore
          ethers_1.ethers.BigNumber.from(trivial.amount)
            .sub(ethers_1.ethers.utils.parseUnits("0.0015", 8))
            .toString(),
        nHash: ethers_1.ethers.utils.hexlify(
          ethers_1.ethers.utils.randomBytes(32)
        ),
        signature: ethers_1.ethers.utils.hexlify(
          ethers_1.ethers.utils.randomBytes(65)
        ),
      };
    };
    if (pending[trivial.signature])
      pending[trivial.signature].emit("update", {
        request: trivial.signature,
        data: tx,
      });
  });
};
exports.createMockKeeper = createMockKeeper;
const enableGlobalMockRuntime = () => {
  core_1.ZeroUser.prototype.subscribeKeepers = async function () {
    const me = this;
    if (!this.keepers.includes(exports.TEST_KEEPER_ADDRESS)) {
      setTimeout(function () {
        me.keepers.push(exports.TEST_KEEPER_ADDRESS);
        me.emit("keeper", exports.TEST_KEEPER_ADDRESS);
      }, 500);
    }
  };
  core_1.ZeroUser.prototype.publishTransferRequest = async function (
    transferRequest
  ) {
    setTimeout(() => {
      (async () => {
        try {
          Promise.all(
            keepers.map(
              async (v) => v._txDispatcher && v._txDispatcher(transferRequest)
            )
          ).catch(console.error);
        } catch (e) {
          console.error(e);
        }
      })();
    }, 500);
    return (pending[transferRequest.signature] = new events_1.EventEmitter());
  };
  core_1.ZeroUser.prototype.publishMetaRequest = async function (metaRequest) {
    try {
      await Promise.all(
        keepers.map(async (v) => {
          if (v._txDispatcher)
            return await v._txDispatcher(metaRequest, "META");
        })
      ).catch(console.error);
    } catch (e) {
      console.error(e);
    }
    return (pending[metaRequest.signature] = new events_1.EventEmitter());
  };
  core_1.ZeroUser.prototype.publishBurnRequest = async function (burnRequest) {
    try {
      await Promise.all(
        keepers.map(async (v) => {
          if (v._txDispatcher)
            return await v._txDispatcher(burnRequest, "BURN");
        })
      ).catch(console.error);
    } catch (e) {
      console.error(e);
    }
    return (pending[burnRequest.signature] = new events_1.EventEmitter());
  };
  zero_1.UnderwriterTransferRequest.prototype.submitToRenVM =
    async function () {
      const confirmed = new events_1.EventEmitter();
      const gatewayAddress = "39WeCoGbNNk5gVNPx9j4mSrw3tvf1WfRz7";
      let _signed;
      confirmed.on("deposit", (count) => {
        if (count === target) _signed = true;
      });
      const target = 6;
      const timeout = (n) => new Promise((resolve) => setTimeout(resolve, n));
      setTimeout(async () => {
        confirmed.emit("target", target);
        confirmed.emit("confirmation", 0);
        for (let i = 1; i <= 6; i++) {
          await timeout(2000);
          confirmed.emit("confirmation", i, target);
        }
      }, 100);
      const txHash = ethers_1.ethers.utils.randomBytes(32).toString("base64");
      const mint = new events_1.EventEmitter();
      const deposit = {
        async txHash() {
          return txHash;
        },
        async confirmed() {
          return confirmed;
        },
        async signed() {
          const ee = new events_1.EventEmitter();
          setTimeout(async () => {
            const result = await new Promise((resolve) => {
              if (_signed) return resolve("signed");
              confirmed.on("confirmation", (count) => {
                if (count === target) resolve("signed");
              });
            });
            ee.emit("status", result);
          }, 100);
          return ee;
        },
      };
      setTimeout(() => {
        mint.emit("deposit", deposit);
      }, 5000);
      mint.gatewayAddress = gatewayAddress;
      return mint;
    };
  /*
      (ReleaseRequest as any).prototype.submitReleaseRequest = async function (flag) {
          // TODO implement confirmed event listener
          const _confirm = new EventEmitter();
          const target = 6
          const timeout = (n) => new Promise((resolve) => setTimeout(resolve, n))
          const txHash = (ethers.utils.randomBytes(32).toString as any)('base64');
  
          setTimeout(async () => {
              _confirm.emit("target", target)
              _confirm.emit("confirmation", 0)
              _confirm.emit("transactionHash", txHash)
  
              for (let i = 1; 1 <= target; i++) {
                  await timeout(500);
                  _confirm.emit('confirmation', i, target);
              }
          }, 3000)
  
          const _burnAndRelease = {
              async burn(){
                  return _confirm
              },
  
              async release(){
                  const _release = new EventEmitter();
                  _confirm.on("confirmation", (confs, target) => {
                      setTimeout(async () => {
                          const result = await new Promise((resolve) => {
                              if (confs === target) resolve("done")
                              if (confs > 0) resolve("confirming")
                              else resolve("pending")
                          })
                          _release.emit("status", result)
                      }, 100)
                  })
                  _confirm.on("transactionHash", (txHash) => {
                      setTimeout(async () => {
                          _release.emit("txHash", txHash)
                      }, 100)
                  })
                  return _release
              }
          }
  
          return _burnAndRelease
      }
  
      (ReleaseRequest as any).prototype.sign = async function () {
          this.signature = ethers.utils.hexlify(ethers.utils.randomBytes(65))
          return this.signature
      }
  
  
      (ZeroUser as any).prototype.publishReleaseRequest = async function (_releaseRequest) {
          setTimeout(() => {
              (async () => {
                  try {
                      Promise.all(keepers.map(async (v) => v._txDispatch && v._txDispatcher(_releaseRequest))).catch(
                          console.error
                      )
                  } catch (e) {
                      console.error(e)
                  }
              })();
          }, 500)
      }
  
  
      ZeroUser.prototype.publishTransferRequest = async function (transferRequest) {
          setTimeout(() => {
              (async () => {
                  try {
                      Promise.all(keepers.map(async (v) => v._txDispatcher && v._txDispatcher(transferRequest))).catch(
                          console.error,
                      );
                  } catch (e) {
                      console.error(e);
                  }
              })();
          }, 3000);
      };
   */
};
exports.enableGlobalMockRuntime = enableGlobalMockRuntime;
//# sourceMappingURL=mock.js.map
