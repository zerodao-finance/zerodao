const handshake = require("it-handshake");
const { ZeroP2P } = require("@zerodao/p2p");
const lp = require("it-length-prefixed");
const toBuffer = require("it-buffer");
const pipe = require("it-pipe");
const all = require("it-all");
const concat = require("it-concat");
const { ethers } = require("ethers");
const { toString } = require("uint8arrays");
const Wrap = require("it-pb-rpc");
const { protocol } = require("@zerodao/protobuf");
const { collect } = require("streaming-iterables");

const createNode = async () => {
  return await new Promise(async (resolve) => {
    let signer = await ethers.Wallet.createRandom();

    const seed = await signer.signMessage(
      ZeroP2P.toMessage(await signer.getAddress())
    );
    
    let node = await ZeroP2P.fromSeed({
      signer,
      seed: Buffer.from(seed.substr(2), "hex"),
      mainnet: 'DEV-MAINNET'
    } as any);

    await node.start();

    setTimeout(() => resolve(node), 2000);
  });
}

(async () => {
  let node: any = await createNode();
  let node2: any = await createNode();

  let hello = new TextEncoder().encode("0xjd2398d32jdewdawidoewj");
  let goodbye = new TextEncoder().encode("goodbye");

  await node2.peerStore.addressBook.set(node.peerId, node.multiaddrs )

  node.handle(['/test-endpoint', '/test-request'], async ({ stream }) => {

      
   let response = await pipe(
      stream, 
      toBuffer,
      collect,
      async ( source ) => {
        let [src] = await source;
        let decoded = protocol.MessagePacket.decode(src);
        return protocol.MessagePacket.toObject(
          decoded,
          {
            enums: String,
            longs: String,
            bytes: String
          });
      }
  );

  console.log(response);



   await pipe(
     [goodbye],
     lp.encode(),
     stream.sink,
   );


    console.log("finished");

  })
  
  const { stream } = await node2.dialProtocol(node.peerId, ['/test-endpoint']);
   
  const message = protocol.MessagePacket.fromObject({
    type: "REQUEST_MEMPOOL",
    channel: "CONSENSUS",
  })

  const encoded = protocol.MessagePacket.encode(message).finish();

  let decoded = protocol['MessagePacket'].decode(encoded);

  let to_object = protocol.MessagePacket.toObject(decoded, {
    enums: String,
    longs: String,
    bytes: String
  });

  await pipe(
    [encoded],
    stream.sink,
  );

  await pipe(
    stream,
    lp.decode(),
    async (source) => {
      for await (const msg of source) {
        console.log("from --", msg);
      }
    }
  );

  

})()


