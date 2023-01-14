import { pipe } from "it-pipe";
import { handshake } from "it-handshake";
import { ZeroP2P } from "@zerodao/p2p";
import { ethers } from "ethers";

const createNode = async () => {
  return await new Promise(async (resolve) => {
    let signer = await ethers.Wallet.createRandom();

    const seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );
    
    let node = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), "hex")
    } as any);

    await node.start();

    setTimeout(() => resolve(node), 2000);
  });
}

(async () => {
  let node: any = await createNode();
  let node2: any = await createNode();

  await node2.peerStore.addressBook.set((node as any).peerId, (node as any).multiaddrs )

  node.handle('/test-endpoint', async ({ stream, connection, protocol }) => {
    
    var shake = handshake(stream);
    console.log("client: %s", await shake.read());

    pipe(
     shake.stream,
     async function * (source) {
       for await (const message of source) {
         yield message
       }
     },
     shake.stream
    );

  })

  let hello = new TextEncoder().encode("hello")
  const { stream } = await node2.dialProtocol((node as any).peerId, ['/test-endpoint']);
   
  var shake: any = handshake(stream);

  await pipe(
    [hello],
    shake.stream,
    async function * (source) {
      for await (const bufferList of source) {
        console.log((bufferList as any).slice())
      }
    }
  );

  

})();


