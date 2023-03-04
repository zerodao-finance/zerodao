const { createNode } = require("./test-p2p");
const { CreateMempool } = require("../lib/mempool/v1/new_reactor";
const util = require("util");
const { pipe } = require("it-pipe");
const peerId = require("peer-id");

(async () => {
  let node: any = await createNode(); 
  let node2: any = await createNode();

  // create a proxy of the node
  let _proxyNode = new Proxy(node as any, {});

  var reactor = new CreateMempool( _proxyNode, "/mempool/1.0.0" );
  
  node2.on('peer:discovery', (peerInfo) => {
    let id = peerId.createFromBytes(peerInfo.id).toB58String();
    console.log(id);
  });

  
  // let { stream } = await node2.dialProtocol(node.peerId._idB58String, ['/mempool/1.0.0']);

  // await pipe(
    // ["hello"],
  // );

})();
