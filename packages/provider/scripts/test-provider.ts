import { Provider } from '../lib/src.ts/provider'
import { Transaction } from '../lib/proto/Transaction';
(async () => {
    const data: Transaction = {
        type: 'TRANSFER',
        to: new Uint8Array([0x01, 0x02, 0x03]),
        data: new Uint8Array([0x04, 0x05, 0x06]),
        nonce: '12345',
        signature: new Uint8Array([0x07, 0x08, 0x09]),
        chain: 'ETHEREUM'
    }
    const provider = new Provider();
    const response = await provider.call(data);
    console.log(response);
})();