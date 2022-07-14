import { useContext } from "react";
import { storeContext } from "../global";
import { useNotificationContext } from "../notification";
import { NotificationHelper } from "../notification/helper";
import { TransactionContext } from "../transaction";
import { TransactionHelper } from "../transaction/helper";
import { GlobalStateHelper } from "../utils/global.utilities";
import { sdkBurn, sdkTransfer } from "../utils/sdk";
import async from "async";
import _ from "lodash";

export const useRequestHelper = () => {
  const { state, dispatch } = useContext(storeContext);
  const { transactions, txDispatch } = useContext(TransactionContext);
  const { card, cardDispatch } = useNotificationContext();
  const queue = async.queue(function (task, callback) {
    callback(null, task);
  });

  let Helper = new SDKHelper({
    globalState: [state, dispatch],
    tx: [transactions, txDispatch],
    notify: [card, cardDispatch],
    queue: queue,
  });

  return {
    state,
    Helper,
  };
};

class SDKHelper {
  static create(params) {
    return new SDKHelper(params);
  }

  constructor(
    params = {
      globalState: [state, dispatch],
      tx: [transactions, txDispatch],
      notify: [card, cardDispatch],
      queue: queue,
    }
  ) {
    this.Global = new GlobalStateHelper(...params.globalState);
    this.Notify = new NotificationHelper(...params.notify);
    this.Transaction = new TransactionHelper(...params.tx);
    this.Queue = params.queue;
  }

  request(_type, request) {
    switch (_type) {
      case "transfer":
        this.handle(new sdkTransfer(...request), _type);
        break;
      case "burn":
        this.handle(new sdkBurn(...request), _type);
        break;
    }
  }

  handle(request, _type) {
    this.#listenForResponse(request.response, _type);
    request.call(this);
    this.#clean(request.response);
  }

  #listenForResponse(response, _type) {
    if (_type === "transfer") {
      // Transfer Requests
      response.on("signing", (data) => {
        this.Notify.createCard(data.timeout, "success", {
          message: data.message,
        });
        this.Global.update(_type, "mode", { mode: "showSigning" });
      });

      response.on("signed", (data) => {
        this.Global.update(_type, "mode", { mode: "waitingDry" });
      });

      response.on("published", async (data) => {
        this.Global.update(_type, "mode", {
          mode: "showGateway",
          gatewayData: { address: data.gateway, requestData: data.request },
        });
        this.Queue.push(
          {
            type: _type,
            mint: data.mintEmitter,
            request: data.request,
            transactionHash: data.hashData,
            this: this,
          },
          this.processTransferRequest
        );
      });
      //end transfer request conditions
    }

    if (_type === "burn") {
      response.on("signed", (data) => {
        this.Notify.createCard(3000, "success", {
          message: "successfully signed request",
        });
      });

      response.on("reset", () => {
        this.Global.reset(_type, "input");
      });

      response.on("hash", async (data) => {
        this.Queue.push(
          {
            type: _type,
            this: this,
            ...data,
          },
          this.processBurnRequest
        );
      });
    }

    response.on("error", (data) => {
      this.Notify.createCard(6000, "warning", { message: data.message });
    });
  }

  async processBurnRequest(error, task) {
    let data = task.this.Transaction.createRequest("burn", task.request);

    const { id, dispatch } = task.this.Notify.createBurnCard(task.type, {
      data: { hostTX: task.request.hostTX, txo: null },
    });

    try {
      task.request.txo.then((value) => {
        dispatch({
          type: "UPDATE",
          payload: {
            id: id,
            update: {
              data: { hostTX: task.request.hostTX, txo: value.txHash },
            },
          },
        });

        data.payload.data.complete();
      });
    } catch {
      task.this.Notify.createCard((timeout = 10000), "message", {
        message: "successfully " + value.txHash,
      });
    }
    //create card takes hostTX and displays that information
    //shows pending screen untill task.txo is fulfulled and displays transaction receipt

    if (error) {
      console.error(error);
    }
  }

  async processTransferRequest(error, task) {
    const deposit = await new Promise(async (resolve) =>
      task.mint.on("deposit", async (deposit) => {
        //recieve deposit object
        task.this.Global.reset(task.type, "input");
        task.this.Global.update(task.type, "mode", { mode: "input" });
        task.this.#tfRequestTransaction(deposit, task);
        resolve(deposit);
        //create a transaction in Transaction with data on deposit receieved
      })
    );
  }

  async #tfRequestTransaction(deposit, task) {
    let data = task.this.Transaction.createRequest("transfer", task.request);
    var forwarded = null;

    if (process.env.REACT_APP_TEST) {
      //testing

      const confirmed = await deposit.confirmed();
      function _initiate(target) {
        const { id, dispatch } = task.this.Notify.createTXCard(
          true,
          task.type,
          {
            hash: task.transactionHash,
            confirmed: true,
            data: task.request,
            mask: target,
            current: 0,
          }
        );
        forwarded = { id: id, dispatch: dispatch };
      }

      let initiate = _.once(_initiate);

      confirmed.on("confirmation", (confs, target) => {
        initiate(target);
        if (confs >= target) {
          data.payload.data.complete();
          forwarded.dispatch({ type: "REMOVE", payload: { id: forwarded.id } });
        } else {
          forwarded.dispatch({
            type: "UPDATE",
            payload: {
              id: forwarded.id,
              update: { max: target, current: confs + 1 },
            },
          });
        }
      });
    }

    //production code
    await deposit
      .confirmed()
      .on("target", (target) => {
        const { id, dispatch } = task.this.Notify.createTXCard(
          true,
          task.type,
          {
            hash: task.transactionHash,
            confirmed: true,
            data: task.request,
            max: target,
            current: 0,
          }
        );
        forwarded = { id: id, dispatch: dispatch };
      })
      .on("confirmation", (confs, target) => {
        if (confs >= target) {
          forwarded.dispatch({ type: "REMOVE", payload: { id: forwarded.id } });
          data.payload.data.complete();
        } else {
          forwarded.dispatch({
            type: "UPDATE",
            payload: {
              id: forwarded.id,
              update: { max: target, current: confs + 1 },
            },
          });
        }
      });
  }

  #clean(response) {
    response.removeAllListeners(["signed", "error"]);
  }
}
