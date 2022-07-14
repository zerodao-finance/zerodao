import { storeContext } from "../global";
import { useContext, useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import {
  createZeroUser,
  createZeroConnection,
} from "zero-protocol/dist/lib/zero.js";
import {
  enableGlobalMockRuntime,
  createMockKeeper,
} from "zero-protocol/dist/lib/mock";
import _ from "lodash";

export const useZero = () => {
  const { state, dispatch } = useContext(storeContext);
  const { zero } = state;
  const enableMocks = _.memoize(async () => {
    if (process.env.REACT_APP_TEST) {
      await createMockKeeper();
      await enableGlobalMockRuntime();
    }
  });

  useEffect(async () => {
    await enableMocks();
    if (!zero.zeroUser) {
      let user = createZeroUser(await createZeroConnection("mainnet"));
      await user.conn.start();
      await user.subscribeKeepers();
      user.on("keeper", (address) => {
        dispatch({
          type: "SUCCEED_REQUEST",
          effect: "zero",
          payload: { effect: "keepers", data: [address, ...zero.keepers] },
        });
        keeper = zero.keepers;
      });
      dispatch({
        type: "SUCCEED_REQUEST",
        effect: "zero",
        payload: { effect: "zeroUser", data: user },
      });
    }
  }, []);

  var keeper = zero.keepers;
  var zeroUser = zero.zeroUser;
  return { keeper, zeroUser };
};
