import * as React from "react";
import { useNotificationContext } from "../../api/notification";
import { useTimeout } from "../../api/notification/timeout";
import { v4 as uuidv4 } from "uuid";
// import { getCard } from "../molecules/notification.cards/error.card"
import { NotificationHelper } from "../../api/notification/helper";

export function successCard(_ref) {
  // const callback = React.useCallback(function removeThis(id) {
  //     _ref.dispatch({ type: "REMOVE", payload: { id: _ref.id }})
  // }, [_ref])
  // useTimeout(_ref.timeout)
  console.log(_ref);

  return (
    <div className="" onClick={_ref.callback}>
      {_ref.type}
    </div>
  );
}

const CreateToastButton = () => {
  const { card, cardDispatch } = useNotificationContext();
  const Helper = new NotificationHelper(card, cardDispatch);
  function remove(id, timeout) {
    setTimeout(() => {
      cardDispatch({ type: "REMOVE", payload: { id: id } });
    }, timeout);
  }

  function createToast(e) {
    if (e) {
      e.preventDefault();
    }
    var uuid = uuidv4();
    Helper.createCard(null, "message", {
      content: getCard,
      message: "Longer Message",
    });
    // cardDispatch({type: "ADD", payload: { id: uuid, content: getCard, type: "error", message: "An error occured here, please resolve, this is a longer message", timeout: 60000, callback: () => remove(uuid, 600000)}})
  }

  function createLengthToast(e) {
    if (e) {
      e.preventDefault();
    }
    var uuid = uuidv4();
    Helper.createCard(2000, "error", {
      content: getCard,
      message: "Logner Message",
    });
    // cardDispatch({type: "ADD", payload: { id: uuid, content: getCard, type: "error", message: "An error occured here, please resolve, this is a longer message", timeout: 60000, callback: () => remove(uuid, 600000)}})
  }

  function removeLast(e) {
    if (e) {
      e.preventDefault();
    }

    cardDispatch({ type: "REMOVE_LAST" });
  }

  window.createToast = createToast;
  window.removeLast = removeLast;
  return (
    <>
      <button onClick={createToast}>Create Card</button>
      <br />
      <button onClick={createLengthToast}>Create Lasting Card</button>
    </>
  );
};

export const TestComponent = () => {
  return (
    <>
      <CreateToastButton />
    </>
  );
};
