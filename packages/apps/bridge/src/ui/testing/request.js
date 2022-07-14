import { map } from "lodash";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { useTransactionContext } from "../../api/transaction";

export const RequestTestingEnv = () => {
  const { pending, completed, txDispatch } = useTransactionContext();
  function newTransferRequest() {
    //process
    txDispatch({
      type: "ADD",
      payload: {
        type: "transfer",
        data: { msg: "test string", id: uuidv4(), type: "transfer" },
      },
    });
  }

  function completeTransferRequest(data) {
    txDispatch({
      type: "COMPLETE",
      payload: { type: "transfer", id: data.id, data: data },
    });
  }

  return (
    <>
      <button
        onClick={() => {
          console.log(pending.transfer);
        }}
      >
        Print Transfers
      </button>
      <br />
      <button onClick={newTransferRequest}>Create Transfer</button>
      {pending.transfer.map((d) => {
        return (
          <div
            className="m-5 border border-black w-fit px-10 text-xs"
            key={d.id}
            onClick={() => completeTransferRequest(d)}
          >
            <p>Pending</p>
            <p>{d.id}</p>
            <br></br>
            <p>{d.type}</p>
          </div>
        );
      })}
      {completed.transfer.map((d) => {
        console.log(d);
        return (
          <div
            className="m-5 border border-black w-fit px-10 text-xs"
            key={d.id}
          >
            <p>Completed</p>
            <p>{d.id}</p>
            <br></br>
            <p>{d.type}</p>
          </div>
        );
      })}
    </>
  );
};
