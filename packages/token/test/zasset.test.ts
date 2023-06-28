import { expect, util } from "chai";
import { ethers } from "hardhat";
import { Buffer } from "buffer";
const BigInteger = require('bigi');
const schnorr = require('bip-schnorr');
const convert = schnorr.convert;
import { Signer, SignerAsync, ECPairInterface, ECPairFactory, ECPairAPI, TinySecp256k1Interface } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
const abi = require('ethereumjs-abi');
const keccak256 = require('js-sha3').keccak256;
const ethUtil = require('ethereumjs-util');
import * as eth from "ethers"



describe("ZBTC", function () {
    let ZBTC;
    let zBTC;
    const tinysecp: TinySecp256k1Interface = require('tiny-secp256k1');
    const ECPair: ECPairAPI = ECPairFactory(tinysecp);


    beforeEach(async function () {
        ZBTC = await ethers.getContractFactory("ZBTC");
        zBTC = await ZBTC.deploy();
        await zBTC.deployed();
    });

    it("Should fail with invalid signature", async function () {
        const invalidSignature = ethers.utils.randomBytes(64); // Random invalid signature
        const pHash = ethers.utils.randomBytes(32);
        const nHash = ethers.utils.randomBytes(32);
        const amount = ethers.utils.parseEther("1");

        await expect(
            zBTC.mint(ethers.Wallet.createRandom().address, pHash, nHash, amount, invalidSignature)
        ).to.be.revertedWith("Invalid signature");
    });

    it("Should succeed with valid signature", async function () {
        const keyPair = ECPair.makeRandom();
        const accNoCheckSum = '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef';
        const accountBuffer = Buffer.from('C5fdf4076b8F3A5357c5E395ab970B5B54098Fef', 'hex'); // remove 0x and convert to Buffer
        const account = '0x' + accountBuffer.toString('hex');
        const nHash = Buffer.from('4321432143214321432143214321432143214321432143214321432143214321', 'hex');
        const amount = 1000; // some amount
        const publicKey = keyPair.publicKey; // Get the public key
        const xOnlyPublicKey = publicKey.slice(1, 33); // Get the X coordinate (the first 32 bytes)
        const pHash = '0x' + xOnlyPublicKey.toString('hex'); // Convert to hex string format
        // Perform the ABI encoding and the keccak256 hash
        let message = eth.utils.solidityKeccak256(['address', 'bytes32', 'bytes32', 'uint256'], [account, pHash, nHash, amount]);
       // console.log(message)
        const messageBuffer = Buffer.from(message.slice(2), 'hex');
        const privateKeyHex = keyPair.privateKey.toString('hex');
        const signature = schnorr.sign(privateKeyHex, messageBuffer);
        console.log(account);
        await expect(
            zBTC.mint(account, pHash, nHash, amount, signature)
        ).to.emit(zBTC, "Transfer").withArgs(ethers.constants.AddressZero, accNoCheckSum, amount);
    });
});
