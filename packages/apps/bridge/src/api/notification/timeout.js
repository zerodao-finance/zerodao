import * as React from "react";
import _ from "lodash";
import async from "async";
export const useTimeout = (card) => {
  function getCardsWithTimeout(n) {
    if (n.timeout !== null) {
      return n.callback;
    } else {
      return null;
    }
  }
  React.useEffect(() => {
    if (!_.isEmpty(card)) {
      let callbacks = _.filter(_.map(card, getCardsWithTimeout), _.isFunction);
      async.race(callbacks, () => {
        console.log("done");
      });
    }
  }, [card]);
};
