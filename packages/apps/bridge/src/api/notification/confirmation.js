import * as React from "react";
import _ from "lodash";
import async from "async";

export const useConfirmations = (card) => {
  function getCardsWithConfirmationData(n) {
    if (n.confirmation !== null) {
      return n.callback;
    } else {
      return null;
    }
  }

  React.useEffect(() => {
    if (!_.isEmpty(card)) {
      let callbacks = _.filter(
        _.map(card, getCardsWithConfirmationData),
        _.isFunction
      );
      async.race(callbacks, () => {
        console.log("done");
      });
    }
  }, [card]);
};
