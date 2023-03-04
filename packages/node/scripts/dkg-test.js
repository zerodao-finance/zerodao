import init from "frost-taproot-wasm/frost_taproot_wasm.js";
import * as kwasm from "frost-taproot-wasm/frost_taproot_wasm.js";

function testDkg() {
    console.log("TEST DKG");

    // DKG setup.
    let ctx = new Uint8Array([1,2,3,4]);
    let p1others = new Uint32Array([2, 3]);
    let p2others = new Uint32Array([1, 3]);
    let p3others = new Uint32Array([1, 2]);
    let p1r0 = krust.frost_secp256k1_dkg_init(1, 2, ctx, p1others);
    let p2r0 = krust.frost_secp256k1_dkg_init(2, 2, ctx, p2others);
    let p3r0 = krust.frost_secp256k1_dkg_init(3, 2, ctx, p3others);
    console.log("round 0", p1r0, p2r0, p3r0);

    // DKG round 1.
    let p1secret = new Uint8Array(32).fill(0x7f);
    let p2secret = new Uint8Array(32).fill(0x7e);
    let p3secret = new Uint8Array(32).fill(0x7d); // not 0x7d
    let p1ent = new Uint8Array(32).fill(0x20);
    let p2ent = new Uint8Array(32).fill(0x21);
    let p3ent = new Uint8Array(32).fill(0x22);
    let p1o1 = krust.frost_secp256k1_dkg_r1(p1r0, p1secret, p1ent);
    let p2o1 = krust.frost_secp256k1_dkg_r1(p2r0, p2secret, p2ent);
    let p3o1 = krust.frost_secp256k1_dkg_r1(p3r0, p3secret, p3ent);
    console.log("round 1", p1o1, p2o1, p3o1);

    // DKG round 2.
    let p1inBc = [[2, p2o1.bcast], [3, p3o1.bcast]];
    let p2inBc = [[1, p1o1.bcast], [3, p3o1.bcast]];
    let p3inBc = [[1, p1o1.bcast], [2, p2o1.bcast]];
    let p1recv = [[2, p2o1.sends.get(1)], [3, p3o1.sends.get(1)]];
    let p2recv = [[1, p1o1.sends.get(2)], [3, p3o1.sends.get(2)]];
    let p3recv = [[1, p1o1.sends.get(3)], [2, p2o1.sends.get(3)]];
    console.log("recvs", [p1recv, p2recv, p3recv]);
    let p1o2 = krust.frost_secp256k1_dkg_r2(p1o1.state, p1inBc, p1recv);
    let p2o2 = krust.frost_secp256k1_dkg_r2(p2o1.state, p2inBc, p2recv);
    let p3o2 = krust.frost_secp256k1_dkg_r2(p3o1.state, p3inBc, p3recv);
    console.log("round 2", p1o2, p2o2, p3o2);

    let vk = krust.frost_secp256k1_export_bip340_pk(p1o2.bcast);
    console.log("pubkey xonly", vk);

    // Thresh setup.
    let p1s0 = krust.frost_secp256k1_sign_init(p1o2.state);
    let p2s0 = krust.frost_secp256k1_sign_init(p2o2.state);
    console.log("sign round 0", [p1s0, p2s0]);

    // Thresh round 1.
    let p1sent = new Uint8Array(32).fill(0x01);
    let p2sent = new Uint8Array(32).fill(0x02);
    let p1s1 = krust.frost_secp256k1_sign_r1(p1s0, p1sent);
    let p2s1 = krust.frost_secp256k1_sign_r1(p2s0, p2sent);
    let s1bc = [[1, p1s1.bcast], [2, p2s1.bcast]];
    console.log("sign round 1", s1bc);

    // Thresh round 2.
    let mhash = new Uint8Array(32).fill(0x80);
    let p1so2 = krust.frost_secp256k1_sign_r2(p1s1.state, mhash, s1bc);
    let p2so2 = krust.frost_secp256k1_sign_r2(p2s1.state, mhash, s1bc);
    let s2bc = [[1, p1so2.bcast], [2, p2so2.bcast]];
    console.log("sign round 2", s2bc);

    // Thresh round 3.
    let p1so3 = krust.frost_secp256k1_sign_r3(p1so2.state, s2bc);
    let p2so3 = krust.frost_secp256k1_sign_r3(p2so2.state, s2bc);
    let s3bc = [[1, p1so3.bcast], [2, p2so3.bcast]];
    console.log("sign round 3", s3bc);

    let sig = krust.frost_secp256k1_export_bip340_sig(p1so3.bcast);
    console.log("signature", sig);
}

async function main() {
    let w = await init();
    window.krust = kwasm;
    window.krust.krustology_init();
    console.log('wasm!', w);

    testDkg();
}

main();
