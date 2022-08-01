import { Request } from "./request";

export { }
// export class BurnRequest extends Request {
//     constructor() {
//         super()
//     }


//     serialize(): string {
//         const _template = [
//             "asset",
//             "chainId",
//             "contractAddress",
//             "data",
//             "module",
//             "nonce",
//             "pNonce",
//             "signature",
//             "underwriter",
//             "owner",
//             "amount",
//             "deadline",
//             "destination",
//             "requestType",
//         ]

//         let requestFromTemplate = _template
//             ? Object.fromEntries(
//                 Object.entries(this).filter(([k, v]) =>
//                     _template.includes(k))
//             )
//             :
//             this

//         return JSON.stringify(requestFromTemplate)
//     }
// }