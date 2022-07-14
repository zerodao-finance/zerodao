import { ethers } from "ethers";
import deployments from "zero-protocol/deployments/deployments.json";

export const test = {
  TEST_KEEPER_ADDRESS: "0x4A423AB37d70c00e8faA375fEcC4577e3b376aCa",
  SIGNALING_MULTIADDR: "/dns4/p2p.zerodao.com/tcp/443/wss/p2p-webrtc-star/",
};

// export const controller = getContract("ZeroController")

const contracts = [
  "ZeroController",
  "DelegateUnderwriter",
  "Convert",
  "BTCVault",
  "ArbitrumConvertQuick",
];

export const chainIdToNetworkName = (chainId) => {
  return {
    [42161]: [
      "arbitrum",
      [
        { BadgerBridgeZeroController: "ZeroController" },
        { BadgerBridgeZeroController: "DelegateUnderwriter" },
      ],
      [],
    ],
    [43114]: [
      "avalanche",
      [
        { BadgerBridgeZeroController: "ZeroController" },
        { BadgerBridgeZeroController: "DelegateUnderwriter" },
      ],
      [],
    ],
    [137]: [
      "matic",
      [
        { BadgerBridgeZeroController: "ZeroController" },
        { BadgerBridgeZeroController: "DelegateUnderwriter" },
      ],
      [],
    ],
    [1]: [
      "mainnet",
      [
        { BadgerBridgeZeroController: "ZeroController" },
        { BadgerBridgeZeroController: "DelegateUnderwriter" },
      ],
      [],
    ],
  }[chainId];
};

export const deploymentsFromSigner = async (signer) => {
  const { chainId } = await signer.provider.getNetwork();
  let [name, contractsToInclude, contractsToExclude] =
    chainIdToNetworkName(chainId);

  if (process.env.REACT_APP_TEST) {
    name = "localhost";
  }
  const contractsToSearch = contractsToInclude
    ? contractsToInclude
    : contracts.filter((d) => !contractsToExclude.includes(d));

  return contractsToSearch.reduce((contracts, _contract) => {
    const [deployName, contractName] =
      typeof _contract == "string"
        ? [_contract, _contract]
        : [Object.keys(_contract)[0], Object.values(_contract)[0]];
    const contract = deployments[chainId][name].contracts[deployName];
    return {
      ...contracts,
      [contractName]: new ethers.Contract(
        contract.address,
        contract.abi,
        signer
      ),
    };
  }, {});
};
