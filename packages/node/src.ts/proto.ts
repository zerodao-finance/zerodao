'use strict';

import protobuf = require('protobufjs');
import './ZeroProtocol.json';
export const protocol = protobuf.Root.fromJSON(require('./ZeroProtocol'));
