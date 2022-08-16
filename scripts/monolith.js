'use strict';

const ioredis = require('ioredis');
const ioredisMock = require('ioredis-mock');
require.cache[require.resolve('ioredis')].exports = ioredisMock;
require('../packages/keeper/bin/keeper');
require('../packages/pending/bin/pending');
require('../packages/watcher/bin/watcher');
require('../packages/dispatcher/bin/dispatcher');

