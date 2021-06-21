require('hardhat-deploy');
require('hardhat-deploy-ethers');
require('hardhat-gas-reporter');
require('@openzeppelin/hardhat-upgrades');


module.exports = {
  solidity: {
    compilers: [{
      version: '0.5.16'
    }, {
      version: '0.6.12'
    }, {
      version: '0.7.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }]
  },
  namedAccounts: { deployer: 0 },
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/Mqiya0B-TaJ1qWsUKuqBtwEyFIbKGWoX",
        blockNumber: 12555982
      }
    }
  }
}
