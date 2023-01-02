"use strict"

import { parentPort, workerData } from "worker_threads";

const { id, index } = workerData;


parentPort.on("sync:node", (msg) => {

});
