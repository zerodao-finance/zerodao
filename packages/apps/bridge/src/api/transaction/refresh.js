import { useEffect, useState } from "react";
import * as React from "react";
import { PersistanceStore } from "../storage/storage";
import _ from "lodash";
import async from "async";
import {
  UnderwriterTransferRequest,
  UnderwriterBurnRequest,
} from "zero-protocol/dist/lib/zero";

export function usePersistanceRefresh(dispatch) {
  let [initialState, setInitialState] = React.useState();
  let queue = async.queue(function (task, callback) {
    callback(null, task);
  });

  useEffect(async () => {
    let fetchedData = await PersistanceStore.get_all_data();
    let transformedData = _.chain(fetchedData)
      .groupBy((i) => i.status)
      .transform((result, value, key) => {
        let t = _.transform(
          value,
          (result, key) => {
            result.push(JSON.parse(key.data));
          },
          []
        );
        let tx = _.groupBy(t, (i) => (i.type ? i.type : i.requestType));
        result[key == "pending" ? key : "completed"] = tx;
      }, {})
      .value();

    if (!_.isEmpty(transformedData)) {
      let dataSettled = {
        pending: {
          burn: [],
          transfer: [],
        },
        completed: {
          burn: [],
          transfer: [],
        },
      };

      let merged = _.merge(dataSettled, transformedData);
      if (!_.isEmpty(merged.pending.transfer)) {
        getPendingRequestStatus(merged.pending.transfer, queue, dispatch);
      }
      dispatch({ type: "INIT", payload: merged });
    }
  }, []);
}

export async function getPendingRequestStatus(array, queue, dispatch) {
  for (const i of array) {
    queue.push(i, callback);
  }

  async function callback(error, task) {
    const req = new UnderwriterTransferRequest({
      ...task._data,
    });

    const mint = await req.submitToRenVM();

    if (process.env.REACT_APP_TEST) {
      mint.on("deposit", async (deposit) => {
        const confirmed = await deposit.confirmed();
        confirmed.on("status");
      });
    } else {
      mint.on("deposit", async (deposit) => {
        if (deposit.depositDetails.transaction.confirmations === 6) {
          dispatch({
            type: "COMPLETE",
            payload: {
              type: task.type,
              id: task.id,
              data: task._data,
            },
          });
          PersistanceStore.add_data(task.id, task, "completed");
        }
        await deposit.confirmed().on("confirmation", (confs, target) => {
          if (confs >= target) {
            //handle setting as confirmed
            dispatch({
              type: "COMPLETE",
              payload: {
                type: task.type,
                id: task.id,
                data: task._data,
              },
            });
          }
        });
        await deposit.signed();
      });
    }
  }
}
