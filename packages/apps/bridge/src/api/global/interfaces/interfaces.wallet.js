import { storeContext } from "../global";
import { useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import wallet_modal from "../../utils/walletModal";
import { NETWORK_ROUTER } from "../../utils/network";
import { CHAINS } from "../../utils/chains";
import { tokenMapping, available_chains } from "../../utils/tokenMapping";
import { useBridgeBurnInput } from "./interface.bridge.burn";
import { useBridgePage } from "./interface.bridge";

export const useWalletConnection = () => {
  const { state, dispatch } = useContext(storeContext);
  const { setChainId } = useBridgePage();
  const { wallet } = state;
  const { isLoading, chainId } = wallet;
  const { getweb3 } = wallet_modal();

  useEffect(async () => {
    const provider = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
    if (provider) {
      await connect();
    }
  }, []);

  useEffect(async () => {
    const web3Modal = await getweb3();
    const curChainId = await web3Modal.eth.getChainId();
    setChainId(
      available_chains.includes(curChainId) ? String(curChainId) : "1"
    );
  }, []);

  useEffect(() => {
    const call = async () => {
      try {
        // TODO: Make getweb3 dynamic and allow the app to define what chain we're on
        const web3Modal = await getweb3();
        try {
          await web3Modal.currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CHAINS[chainId].chainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902 || switchError.code === -32603) {
            try {
              await web3Modal.currentProvider.request({
                method: "wallet_addEthereumChain",
                params: [CHAINS[chainId]],
              });
            } catch (addError) {
              console.error(addError);
            }
          } else {
            console.error(switchError);
          }
        }
        let modalChainID = await web3Modal.eth.getChainId();
        await dispatch({
          type: "SUCCEED_BATCH_REQUEST",
          effect: "wallet",
          payload: {
            address: (await web3Modal.eth.getAccounts())[0],
            chainId: chainId,
            network: NETWORK_ROUTER[modalChainID],
            provider: new ethers.providers.Web3Provider(
              await web3Modal.currentProvider,
              "any"
            ),
          },
        });
        return;
      } catch (err) {
        console.error(err);
        dispatch({ type: "RESET_REQUEST", effect: "wallet" });
      }
    };

    if (isLoading && chainId) {
      call();
    }
  }, [isLoading, chainId]);

  const connect = async () => {
    dispatch({ type: "START_REQUEST", effect: "wallet" });
  };

  const disconnect = async () => {
    dispatch({ type: "RESET_REQUEST", effect: "wallet" });
    localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
  };

  return { connect, disconnect, wallet, isLoading };
};

export const useCheckWalletConnected = () => {
  const { state } = useContext(storeContext);
  const { address } = state.wallet;
  const [walletConnected, toggle] = useState(true);

  useEffect(() => {
    if (!address) {
      toggle(true);
    } else {
      toggle(false);
    }
  }, [address]);

  const getWalletConnectionProps = ({ ...otherProps } = {}) => ({
    wallet: walletConnected,
  });

  return {
    getWalletConnectionProps,
  };
};

export const useWalletBalances = () => {
  // Global Wallet State
  const { state } = useContext(storeContext);
  const { provider, address, chainId } = state.wallet;
  // User Selected Token
  const { getBridgeBurnInputProps } = useBridgeBurnInput();
  const { token } = getBridgeBurnInputProps();
  // Balance States
  const [balances, setBalances] = useState({
    ETH: 0,
    AVAX: 0,
    MATIC: 0,
    renBTC: 0,
    WBTC: 0,
    ibBTC: 0,
    USDC: 0,
  });

  useEffect(async () => {
    // OTHER TOKEN BALANCES
    getBalance(token).then(async (bal) => {
      let tokenAmount = "0";
      switch (token) {
        case "USDC":
          tokenAmount = ethers.utils.formatUnits(bal, 6);
          break;
        case "ETH":
          tokenAmount = ethers.utils.formatEther(bal);
          break;
        case "AVAX":
          tokenAmount = ethers.utils.formatEther(bal);
          break;
        case "MATIC":
          tokenAmount = ethers.utils.formatEther(bal);
          break;
        default:
          tokenAmount = ethers.utils.formatUnits(bal, 8);
      }
      setBalances({
        ...balances,
        [token]: tokenAmount,
      });
    });
  }, [token, provider, chainId]);

  const balanceOfABI = [
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "balance", type: "uint256" }],
      type: "function",
    },
  ];

  async function getBalance(tokenName) {
    if (!address) {
      return ethers.utils.parseUnits("0", 6);
    }
    if (["eth", "avax", "matic"].includes(tokenName.toLowerCase())) {
      const ethBalance = await provider.getBalance(address);
      return ethBalance;
    } else {
      const contract = new ethers.Contract(
        tokenMapping({ tokenName, chainId }),
        balanceOfABI,
        provider
      );
      try {
        const balance = await contract.balanceOf(address);
        return balance;
      } catch (error) {
        return ethers.utils.parseUnits("0", 6);
      }
    }
  }

  return {
    balances,
    getBalance,
  };
};
