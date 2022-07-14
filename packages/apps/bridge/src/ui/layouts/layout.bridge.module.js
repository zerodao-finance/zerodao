import { useBridgePage } from "../../api/global/interfaces/interface.bridge";
export const LayoutBridgeModule = () => {
  /**
     * Conditional Rendering Logic
     * 
     * States - input | processing
     * if @input
     *  show input screens 
     *  release or transfer
     * 
     *if @process
        show signature screen
        show gateway screen
     *  
     * */

  const { component, mode } = useBridgePage();

  switch (mode) {
    case "transfer":
      return;
    case "process":
      return;
  }
};
