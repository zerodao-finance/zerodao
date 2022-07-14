export class GlobalStateHelper {
  constructor(state, dispatch) {
    this.state = state;
    this.dispatch = dispatch;
  }

  update(module, effect, data) {
    this.dispatch({
      type: "UPDATE",
      module: module,
      effect: effect,
      data: data,
    });
    return;
  }

  reset(module, effect) {
    this.dispatch({ type: "RESET", module: module, effect: effect });
    return;
  }

  getModuleModeState(module) {
    const { processing, signed, gatewayRecieved } = this.state[module].mode;

    return {
      processing,
      signed,
      gatewayRecieved,
    };
  }

  getModuleGatewayProps(module) {
    const { address, requestData } = this.state[module].mode.gatewayData;
    return { gatewayAddress: address, transferRequest: requestData };
  }
}

export class EventHelper {
  event = [];
  constructor() {}

  newEvent(type, name, dataArgs) {
    this.event[type].emit(name, ...dataArgs);
  }

  callback(type, listen, fn) {
    return this.event[type].on(listen, fn);
  }
}
