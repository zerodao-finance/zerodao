import { ethers } from "ethers";
import { ZeroNode } from "../lib";

(async () => {
	const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
	const signer = provider.getSigner();
	let node = await ZeroNode.fromSigner(signer, 'DEV-MAINNET');	
	await node.init();
	console.log("starting ping pong");
	await node.pingpong();
})()

