//// ZeroP2P Netoworking Layer for ZeroNode
//
//
//

import { ZeroNode } from "../node";
import { ethers } from "ethers";

export async function initNode(signer: ethers.Signer) {
  return await ZeroNode.fromSigner(signer);
}





