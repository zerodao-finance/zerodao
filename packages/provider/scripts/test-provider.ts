import { Provider } from '../lib/src.ts/provider'
import { Transaction } from '../lib/proto/Transaction';
(async () => {
    const data: Transaction = {
        'type': 'TRANSFER'
    }
	const provider = new Provider();
    const response = await provider.call(data);
    console.log(response);
})();