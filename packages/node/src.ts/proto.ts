'use strict';

import protobuf = require('protobufjs');

export const protocol = protobuf.Root.fromJSON(require('../build/ZeroProto'));
