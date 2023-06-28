// SPDX-License-Identifier: MIT 
import { ZAssetBase } from "./zAssetBase.sol";

contract ZBTC is ZAssetBase {
    function initialize() public initializer {
        __ERC20Permit_init("ZBTC");
        __ERC20_init_unchained("ZBTC", "ZBTC");
        __Ownable_init_unchained();
         changeIdx(0); 
    
    }
    // Add specific functionality for ZBTC if needed
}
