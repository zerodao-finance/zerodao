const { expect } = require("chai");
const { ethers } = require("hardhat");
import { Buffer } from "buffer";
const BigInteger = require('bigi');
const schnorr = require('bip-schnorr');
const convert = schnorr.convert;
import { Signer, SignerAsync, ECPairInterface, ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
const abi = require('ethereumjs-abi');
const keccak256 = require('js-sha3').keccak256;
const ethUtil = require('ethereumjs-util');

describe("Control and ZAssetBase interaction", function () {
  it("Should call mint on ZAssetBase through execute in Control", async function () {
    const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
    const ECPair: ECPairAPI = ECPairFactory(tinysecp);
    const keyPair = ECPair.makeRandom();
    const publicKey = keyPair.publicKey; // Get the public key
        const xOnlyPublicKey = publicKey.subarray(1, 33); // Get the X coordinate (the first 32 bytes)
        const pHash = '0x' + xOnlyPublicKey.toString('hex'); //
    // Deploy the Control contract
    const Control = await ethers.getContractFactory("Control");
    const control = await Control.deploy(pHash);
    await control.deployed();

    // Deploy the ZBTC contract
    const ZBTC = await ethers.getContractFactory("ZBTC");
    const zBTC = await ZBTC.deploy();
    await zBTC.deployed();

    // Initialize ZBTC contract with Control as signer
    const sZERO = ethers.utils.getAddress("0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"); // Replace with the correct address
    const gateway = ethers.utils.getAddress("0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"); // Replace with the correct address
    await zBTC.initialize(sZERO, gateway, control.address);

    // Prepare parameters for the execute function
    const to = zBTC.address;
    const nonce = 1;
    const value = ethers.utils.parseEther("0"); // 0 ETH
    const account = ethers.utils.getAddress("0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef"); // Replace with the target account
    const amount = ethers.utils.parseEther("1"); // Mint 1 token
    const functionSignature = "mint(address,uint256)";
    const functionHash = ethers.utils.id(functionSignature);
    const functionSelector = functionHash.substring(0,10);
    // The data for calling the mint function on ZBTC
    const paramsEncoded = ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [account, amount]
    );

    const data = functionSelector + paramsEncoded.substring(2);
    let message = ethers.utils.solidityKeccak256(['string', 'address', 'uint256', 'uint256', 'bytes'], ["/zero/0.1.0", to, nonce, value, data]);
       // console.log(message)
        const messageBuffer = Buffer.from(message.slice(2), 'hex');
        const privateKeyHex = keyPair.privateKey.toString('hex');
        const schnorrSignature = schnorr.sign(privateKeyHex, messageBuffer);
    // Call execute on Control, which should call mint on ZAssetBase
    await control.execute(to, nonce, value, data, schnorrSignature);

    // Verify the result on ZAssetBase
    const balance = await zBTC.balanceOf(account);
    expect(balance).to.equal(amount);
  });
});
