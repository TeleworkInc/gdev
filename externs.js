// require()
function require(moduleName) {}

// process
var process = {};

// path-specific constants
var __filename,
    __dirname;

//→ assert.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's assert module
 * @see http://nodejs.org/api/assert.html
 * @see https://github.com/joyent/node/blob/master/lib/assert.js
 */

/**
 * @param {*} value
 * @param {string} message
 * @return {void}
 * @throws {assert.AssertionError}
 */
var assert = function(value, message) {};

/**
 * @param {{message: string, actual: *, expected: *, operator: string}} options
 * @constructor
 * @extends Error
 */
assert.AssertionError = function(options) {};

/**
 * @return {string}
 */
assert.AssertionError.prototype.toString;



//→ buffer.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's buffer module.
 * @see http://nodejs.org/api/buffer.html
 * @see https://github.com/joyent/node/blob/master/lib/buffer.js
 */

/**
 * @const
 */
var buffer = {};

/**
 * @param {number} size
 * @constructor
 */
buffer.SlowBuffer = function(size) {};

/**
 *
 * @param {string} string
 * @param {number|string} offset
 * @param {number|string=} length
 * @param {number|string=} encoding
 * @return {*}
 */
buffer.SlowBuffer.prototype.write;

/**
 * @param {number} start
 * @param {number} end
 * @return {Buffer}
 */
buffer.SlowBuffer.prototype.slice;

/**
 * @return {string}
 */
buffer.SlowBuffer.prototype.toString;

/**
 * @param {number} size
 * @param {(string|!Buffer|number)=} fill
 * @param {string=} encoding
 * @return {!Buffer}
 */
buffer.Buffer.alloc;

//→ child_process.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's child_process module. Depends on the
 *     events module.
 * @externs
 * @see http://nodejs.org/api/child_process.html
 * @see https://github.com/joyent/node/blob/master/lib/child_process.js
 */

var events = require('events');
var stream = require('stream');

/**
 * @const
 */
var child_process = {};

/**
 * @constructor
 * @param {...*} var_args
 * @extends events.EventEmitter
 */
child_process.ChildProcess = function(var_args) {}; // Private?

/**
 * @type {stream.ReadableStream}
 */
child_process.ChildProcess.prototype.stdin;

/**
 * @type {stream.WritableStream}
 */
child_process.ChildProcess.prototype.stdout;

/**
 * @type {stream.WritableStream}
 */
child_process.ChildProcess.prototype.stderr;

/**
 * @type {number}
 */
child_process.ChildProcess.prototype.pid;

/**
 * @param {string=} signal
 * @return {void}
 */
child_process.ChildProcess.prototype.kill;

/**
 * @param {Object.<string,*>} message
 * @param {*} sendHandle
 * @return {void}
 */
child_process.ChildProcess.prototype.send;

/**
 * @return {void}
 */
child_process.ChildProcess.prototype.disconnect;

/**
 * @param {string} command
 * @param {Array.<string>=} args
 * @param {child_process.Options=} options
 * @return {child_process.ChildProcess}
 */
child_process.ChildProcess.spawn;



//→ cluster.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's cluster module. Depends on the events module.
 * @see http://nodejs.org/api/cluster.html
 * @see https://github.com/joyent/node/blob/master/lib/cluster.js
 */

var child_process = require('child_process');
var events = require('events');

/**
 * @const
 */
var cluster = new events.EventEmitter();

/**
 * @constructor
 * @extends events.EventEmitter
 */
cluster.Worker = function() {};

/**
 * @type {string}
 */
cluster.Worker.prototype.id;

/**
 * @type {child_process.ChildProcess}
 */
cluster.Worker.prototype.process;

/**
 * @type {boolean}
 */
cluster.Worker.prototype.suicide;

/**
 * @param {Object} message
 * @param {*=} sendHandle
 * @return {void}
 */
cluster.Worker.prototype.send;

/**
 * @return {void}
 */
cluster.Worker.prototype.destroy;

/**
 * @return {void}
 */
cluster.Worker.prototype.disconnect;



//→ crypto.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's crypto module. Depends on the buffer module.
 * @see http://nodejs.org/api/crypto.html
 * @see https://github.com/joyent/node/blob/master/lib/crypto.js
 */

var stream = require('stream');

/**
 * @const
 */
var crypto = {};

/**
 * @constructor
 */
crypto.Credentials = function () {};

/** @type {string|Buffer} */
crypto.Credentials.prototype.pfx;

/** @type {string|Buffer} */
crypto.Credentials.prototype.key;

/** @type {string} */
crypto.Credentials.prototype.passphrase;

/** @type {string|Buffer} */
crypto.Credentials.prototype.cert;

/** @type {Array.<string|Buffer>} */
crypto.Credentials.prototype.ca;

/** @type {Array.<string>|string} */
crypto.Credentials.prototype.crl;

/** @type {string} */
crypto.Credentials.prototype.ciphers;

/**
 * @param {string} algorithm
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
crypto.Hash = function(algorithm, options) {};

/**
 * @param {string|Buffer} data
 * @param {string=} input_encoding
 * @return {void}
 */
crypto.Hash.prototype.update;

/**
 * @param {string=} encoding
 * @return {string}
 */
crypto.Hash.prototype.digest;

/**
 * @param {string} hmac
 * @param {string|Buffer} key
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
crypto.Hmac = function(hmac, key, options) {};

/**
 * @param {string|Buffer} data
 * @return {void}
 */
crypto.Hmac.prototype.update;

/**
 * @param {string} encoding
 * @return {void}
 */
crypto.Hmac.prototype.digest;

/**
 * @param {string|Buffer} cipher
 * @param {string} password
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
crypto.Cipher = function(cipher, password, options) {};

/**
 * @param {string|Buffer} data
 * @param {string=} input_encoding
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Cipher.prototype.update;

/**
 * @name crypto.Cipher.prototype.final
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Cipher.prototype.final;

/**
 * @param {boolean=} auto_padding
 * @return {void}
 */
crypto.Cipher.prototype.setAutoPadding;

/**
 * Note:  Cipheriv mixes update, final, and setAutoPadding from Cipher but
 * doesn't inherit directly from Cipher.
 *
 * @param {string} cipher
 * @param {string|Buffer} key
 * @param {string|Buffer} iv
 * @constructor
 * @extends stream.Transform
 */
crypto.Cipheriv = function(cipher, key, iv) {};

/**
 * @param {string|Buffer} data
 * @param {string=} input_encoding
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Cipheriv.prototype.update;

/**
 * @name crypto.Cipheriv.prototype.final
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Cipheriv.prototype.final;

/**
 * @param {boolean=} auto_padding
 * @return {void}
 */
crypto.Cipheriv.prototype.setAutoPadding;

/**
 * Note:  Decipher mixes update, final, and setAutoPadding from Cipher but
 * doesn't inherit directly from Cipher.
 *
 * @param {string|Buffer} cipher
 * @param {string|Buffer} password
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
crypto.Decipher = function(cipher, password, options) {};

/**
 * @param {string|Buffer} data
 * @param {string=} input_encoding
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipher.prototype.update;

/**
 * @name crypto.Decipher.prototype.final
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipher.prototype.final;

/**
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipher.prototype.finaltol;

/**
 * @param {boolean=} auto_padding
 * @return {void}
 */
crypto.Decipher.prototype.setAutoPadding;

/**
 * Note:  Decipheriv mixes update, final, and setAutoPadding from Cipher but
 * doesn't inherit directly from Cipher.
 *
 * @param {string|Buffer|crypto.Decipheriv} cipher
 * @param {string|Buffer} key
 * @param {string|Buffer} iv
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
crypto.Decipheriv = function(cipher, key, iv, options) {};

/**
 * @param {string|Buffer} data
 * @param {string=} input_encoding
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipheriv.prototype.update;

/**
 * @name crypto.Decipheriv.prototype.final
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipheriv.prototype.final;

/**
 * @param {string=} output_encoding
 * @return {string|Buffer}
 */
crypto.Decipheriv.prototype.finaltol;

/**
 * @param {boolean=} auto_padding
 * @return {void}
 */
crypto.Decipheriv.prototype.setAutoPadding;

/**
 * @param {string} algorithm
 * @param {Object=} options
 * @constructor
 * @extends stream.Writable
 */
crypto.Sign = function(algorithm, options) {};

/**
 * @param {string|Buffer} data
 * @return {void}
 */
crypto.Sign.prototype.update;

/**
 * @param {string} private_key
 * @param {string=} output_format
 * @return {string|Buffer}
 */
crypto.Sign.prototype.sign;

/**
 * @param {string} algorithm
 * @param {Object=} options
 * @constructor
 * @extends stream.Writable
 */
crypto.Verify = function(algorithm, options) {};

/**
 * @param {string|Buffer} data
 * @return {void}
 */
crypto.Verify.prototype.update;

/**
 * @param {string} object
 * @param {string|Buffer} signature
 * @param {string=} signature_format
 * @return {boolean}
 */
crypto.Verify.prototype.verify;

/**
 * @param {number} sizeOrKey
 * @param {string=} encoding
 * @constructor
 */
crypto.DiffieHellman = function(sizeOrKey, encoding) {};

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.generateKeys;

/**
 * @param {string|Buffer} key
 * @param {string=} inEnc
 * @param {string=} outEnc
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.computeSecret;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.getPrime;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.getGenerator;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.getPublicKey;

/**
 * @param {string} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellman.prototype.getPrivateKey = function(encoding) {};

/**
 * @param {string|Buffer} key
 * @param {string=} encoding
 * @return {crypto.DiffieHellman}
 */
crypto.DiffieHellman.prototype.setPublicKey;

/**
 * @param {string|Buffer} key
 * @param {string=} encoding
 * @return {crypto.DiffieHellman}
 */
crypto.DiffieHellman.prototype.setPrivateKey;

/**
 * Note:  DiffieHellmanGroup mixes DiffieHellman but doesn't inherit directly.
 *
 * @param {string} name
 * @constructor
 */
crypto.DiffieHellmanGroup = function(name) {};

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.generateKeys;

/**
 * @param {string|Buffer} key
 * @param {string=} inEnc
 * @param {string=} outEnc
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.computeSecret;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.getPrime;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.getGenerator;

/**
 * @param {string=} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.getPublicKey;

/**
 * @param {string} encoding
 * @return {string|Buffer}
 */
crypto.DiffieHellmanGroup.prototype.getPrivateKey = function(encoding) {};

/**
 * @param {string|Buffer} key
 * @param {string=} encoding
 * @return {crypto.DiffieHellmanGroup}
 */
crypto.DiffieHellmanGroup.prototype.setPublicKey;

/**
 * @param {string|Buffer} key
 * @param {string=} encoding
 * @return {crypto.DiffieHellmanGroup}
 */
crypto.DiffieHellmanGroup.prototype.setPrivateKey;



//→ dgram.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's dgram module. Depends on the events module.
 * @see http://nodejs.org/api/dgram.html
 * @see https://github.com/joyent/node/blob/master/lib/dgram.js
 */

var events = require('events');

/**
 * @const
 */
var dgram = {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
dgram.Socket = function() {};

/**
 * @param {Buffer} buf
 * @param {number} offset
 * @param {number} length
 * @param {number} port
 * @param {string} address
 * @param {function(...)=} callback
 * @return {void}
 */
dgram.Socket.prototype.send;

/**
 * @param {number} port
 * @param {string=} address
 * @return {void}
 */
dgram.Socket.prototype.bind;

/**
 * @return {void}
 */
dgram.Socket.prototype.close;

/**
 * @return {string}
 */
dgram.Socket.prototype.address;

/**
 * @param {boolean} flag
 * @return {void}
 */
dgram.Socket.prototype.setBroadcast;

/**
 * @param {number} ttl
 * @return {number}
 */
dgram.Socket.prototype.setTTL;

/**
 * @param {number} ttl
 * @return {number}
 */
dgram.Socket.prototype.setMulticastTTL;

/**
 * @param {boolean} flag
 * @return {void}
 */
dgram.Socket.prototype.setMulticastLoopback;

/**
 * @param {string} multicastAddress
 * @param {string=} multicastInterface
 * @return {void}
 */
dgram.Socket.prototype.addMembership;

/**
 * @param {string} multicastAddress
 * @param {string=} multicastInterface
 * @return {void}
 */
dgram.Socket.prototype.dropMembership;



//→ dns.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's dns module.
 * @see http://nodejs.org/api/dns.html
 * @see https://github.com/joyent/node/blob/master/lib/dns.js
 */

/**
 * @const
 */
var dns = {};

/**
 * @type {string}
 * @const
 */
dns.NODATA = 'ENODATA';

/**
 * @type {string}
 * @const
 */
dns.FORMERR = 'EFORMERR';

/**
 * @type {string}
 * @const
 */
dns.SERVFAIL = 'ESERVFAIL';

/**
 * @type {string}
 * @const
 */
dns.NOTFOUND = 'ENOTFOUND';

/**
 * @type {string}
 * @const
 */
dns.NOTIMP = 'ENOTIMP';

/**
 * @type {string}
 * @const
 */
dns.REFUSED = 'EREFUSED';

/**
 * @type {string}
 * @const
 */
dns.BADQUERY = 'EBADQUERY';

/**
 * @type {string}
 * @const
 */
dns.BADNAME = 'EBADNAME';

/**
 * @type {string}
 * @const
 */
dns.BADFAMILY = 'EBADFAMILY';

/**
 * @type {string}
 * @const
 */
dns.BADRESP = 'EBADRESP';

/**
 * @type {string}
 * @const
 */
dns.CONNREFUSED = 'ECONNREFUSED';

/**
 * @type {string}
 * @const
 */
dns.TIMEOUT = 'ETIMEOUT';

/**
 * @type {string}
 * @const
 */
dns.EOF = 'EOF';

/**
 * @type {string}
 * @const
 */
dns.FILE = 'EFILE';

/**
 * @type {string}
 * @const
 */
dns.NOMEM = 'ENOMEM';

/**
 * @type {string}
 * @const
 */
dns.DESTRUCTION = 'EDESTRUCTION';

/**
 * @type {string}
 * @const
 */
dns.BADSTR = 'EBADSTR';

/**
 * @type {string}
 * @const
 */
dns.BADFLAGS = 'EBADFLAGS';

/**
 * @type {string}
 * @const
 */
dns.NONAME = 'ENONAME';

/**
 * @type {string}
 * @const
 */
dns.BADHINTS = 'EBADHINTS';

/**
 * @type {string}
 * @const
 */
dns.NOTINITIALIZED = 'ENOTINITIALIZED';

/**
 * @type {string}
 * @const
 */
dns.LOADIPHLPAPI = 'ELOADIPHLPAPI';

/**
 * @type {string}
 * @const
 */
dns.ADDRGETNETWORKPARAMS = 'EADDRGETNETWORKPARAMS';

/**
 * @type {string}
 * @const
 */
dns.CANCELLED = 'ECANCELLED';



//→ domain.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's domain module. Depends on the events module.
 * @see http://nodejs.org/api/domain.html
 * @see https://github.com/joyent/node/blob/master/lib/domain.js
 */

var events = require('events');

/**
 * @const
 */
var domain = {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
domain.Domain = function () {};

/**
 * @param {function()} fn
 */
domain.Domain.prototype.run;

/**
 * @type {Array}
 */
domain.Domain.prototype.members;

/**
 * @param {events.EventEmitter} emitter
 * @return {void}
 */
domain.Domain.prototype.add;

/**
 * @param {events.EventEmitter} emitter
 * @return {void}
 */
domain.Domain.prototype.remove;

/**
 * @param {function(...*)} callback
 * @return {function(...*)}
 */
domain.Domain.prototype.bind;

/**
 * @param {function(...*)} callback
 * @return {function(...*)}
 */
domain.Domain.prototype.intercept;

/**
 * @return {void}
 */
domain.Domain.prototype.dispose;

// Undocumented

/**
 * @return {void}
 */
domain.Domain.prototype.enter;

/**
 * @return {void}
 */
domain.Domain.prototype.exit;



//→ events.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's "events" module.
 * @externs
 *
 * @see http://nodejs.org/api/events.html
 * @see https://github.com/joyent/node/blob/master/lib/events.js
 */

/**
 * @const
 */
var events = {};

/**
 * @constructor
 */
events.EventEmitter = function() {};

/**
 * @param {string} event
 * @param {function(...)} listener
 * @return {events.EventEmitter}
 */
events.EventEmitter.prototype.addListener;

/**
 * @param {string} event
 * @param {function(...)} listener
 * @return {events.EventEmitter}
 */
events.EventEmitter.prototype.on;

/**
 * @param {string} event
 * @param {function(...)} listener
 * @return {events.EventEmitter}
 */
events.EventEmitter.prototype.once;

/**
 * @param {string} event
 * @param {function(...)} listener
 * @return {events.EventEmitter}
 */
events.EventEmitter.prototype.removeListener;

/**
 * @param {string=} event
 * @return {events.EventEmitter}
 */
events.EventEmitter.prototype.removeAllListeners;

/**
 * @param {number} n
 * @return {void}
 */
events.EventEmitter.prototype.setMaxListeners;

/**
 * @param {string} event
 * @return {Array.<function(...)>}
 */
events.EventEmitter.prototype.listeners;

/**
 * @param {string} event
 * @param {...*} var_args
 * @return {boolean}
 */
events.EventEmitter.prototype.emit;

/**
 * @param {events.EventEmitter} emitter
 * @param {string} type
 * @return {void}
 */
events.EventEmitter.listenerCount;

//→ fs.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's fs module. Depends on the stream and
 * events module.
 * @externs
 * @suppress {duplicate,checkTypes}
 *
 * @see http://nodejs.org/api/fs.html
 * @see https://github.com/joyent/node/blob/master/lib/fs.js
 */

/** @const */
var fs = {};

/**
 * @param {string} path
 * @return {fs.Stats}
 * @nosideeffects
 */
fs.statSync = function(path) {};

/**
 * @param {*} fd
 * @return {fs.Stats}
 * @nosideeffects
 */
fs.fstatSync = function(fd) {};

/**
 * @param {string} path
 * @return {fs.Stats}
 * @nosideeffects
 */
fs.lstatSync = function(path) {};

/**
 * @constructor
 */
fs.Stats = function () {};

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isFile;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isDirectory;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isBlockDevice;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isCharacterDevice;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isSymbolicLink;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isFIFO;

/**
 * @return {boolean}
 * @nosideeffects
 */
fs.Stats.prototype.isSocket;

/**
 * @type {number}
 */
fs.Stats.prototype.dev = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.ino = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.mode = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.nlink = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.uid = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.gid = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.rdev = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.size = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.blkSize = 0;

/**
 * @type {number}
 */
fs.Stats.prototype.blocks = 0;

/**
 * @type {Date}
 */
fs.Stats.prototype.atime;

/**
 * @type {Date}
 */
fs.Stats.prototype.mtime;

/**
 * @type {Date}
 */
fs.Stats.prototype.ctime;

/**
 * @constructor
 * @extends stream.ReadableStream
 */
fs.ReadStream = function () {};

/**
 * @constructor
 * @extends stream.WritableStream
 */
fs.WriteStream = function () {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
fs.FSWatcher = function () {};

/**
 * @return {void}
 */
fs.FSWatcher.prototype.close;

//→ globals.js:


//→ http.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's http module. Depends on the events module.
 * @see http://nodejs.org/api/http.html
 * @see https://github.com/joyent/node/blob/master/lib/http.js
 */

var events = require('events');
var net = require('net');
var stream = require('stream');

/** @const */
var http = {};

/**
 * @param {http.requestListener=} listener
 * @constructor
 * @extends events.EventEmitter
 */
http.Server = function(listener) {};

/**
 * @param {(number|string)} portOrPath
 * @param {(string|Function)=} hostnameOrCallback
 * @param {Function=} callback
 */
http.Server.prototype.listen;

/**
 * @return {void}
 */
http.Server.prototype.close;

/**
 * @constructor
 * @extends stream.Readable
 */
http.IncomingMessage = function() {};

/**
 * @type {?string}
 * */
http.IncomingMessage.prototype.method;

/**
 * @type {?string}
 */
http.IncomingMessage.prototype.url;

/**
 * @type {Object}
 * */
http.IncomingMessage.prototype.headers;

/**
 * @type {Object}
 * */
http.IncomingMessage.prototype.trailers;

/**
 * @type {string}
 */
http.IncomingMessage.prototype.httpVersion;

/**
 * @type {string}
 */
http.IncomingMessage.prototype.httpVersionMajor;

/**
 * @type {string}
 */
http.IncomingMessage.prototype.httpVersionMinor;

/**
 * @type {*}
 */
http.IncomingMessage.prototype.connection;

/**
 * @type {?number}
 */
http.IncomingMessage.prototype.statusCode;

/**
 * @type {net.Socket}
 */
http.IncomingMessage.prototype.socket;

/**
 * @param {number} msecs
 * @param {function()} callback
 * @return {void}
 */
http.IncomingMessage.prototype.setTimeout;

/**
 * @constructor
 * @extends events.EventEmitter
 * @private
 */
http.ServerResponse = function() {};

/**
 * @return {void}
 */
http.ServerResponse.prototype.writeContinue;

/**
 * @param {number} statusCode
 * @param {*=} reasonPhrase
 * @param {*=} headers
 */
http.ServerResponse.prototype.writeHead;

/**
 * @type {number}
 */
http.ServerResponse.prototype.statusCode;

/**
 * @param {string} name
 * @param {string} value
 * @return {void}
 */
http.ServerResponse.prototype.setHeader;

/**
 * @param {string} name
 * @return {string|undefined} value
 */
http.ServerResponse.prototype.getHeader;

/**
 * @param {string} name
 * @return {void}
 */
http.ServerResponse.prototype.removeHeader;

/**
 * @param {string|Array|Buffer} chunk
 * @param {string=} encoding
 * @return {void}
 */
http.ServerResponse.prototype.write;

/**
 * @param {Object} headers
 * @return {void}
 */
http.ServerResponse.prototype.addTrailers;

/**
 * @param {(string|Array|Buffer)=} data
 * @param {string=} encoding
 * @return {void}
 */
http.ServerResponse.prototype.end;

/**
 * @constructor
 * @extends events.EventEmitter
 * @private
 */
http.ClientRequest = function() {};

/**
 * @param {string|Array|Buffer} chunk
 * @param {string=} encoding
 * @return {void}
 */
http.ClientRequest.prototype.write;

/**
 * @param {(string|Array|Buffer)=} data
 * @param {string=} encoding
 * @return {void}
 */
http.ClientRequest.prototype.end;

/**
 * @return {void}
 */
http.ClientRequest.prototype.abort;

/**
 * @constructor
 * @extends events.EventEmitter
 */
http.Agent = function() {};

/**
 * @type {number}
 */
http.Agent.prototype.maxSockets;

/**
 * @type {number}
 */
http.Agent.prototype.sockets;

/**
 * @type {Array.<http.ClientRequest>}
 */
http.Agent.prototype.requests;



//→ https.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's https module. Depends on the tls module.
 * @see http://nodejs.org/api/https.html
 * @see https://github.com/joyent/node/blob/master/lib/https.js
 */

var http = require('http');
var tls = require('tls');

/** @const */
var https = {};

/**
 * @constructor
 * @extends tls.Server
 */
https.Server = function() {};

/**
 * @param {...*} var_args
 * @return {void}
 */
https.Server.prototype.listen;

/**
 * @param {function()=} callback
 * @return {void}
 */
https.Server.prototype.close;

/**
 * @constructor
 * @extends http.Agent
 */
https.Agent = function() {};



//→ net.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's net module. Depends on the events and buffer modules.
 * @see http://nodejs.org/api/net.html
 * @see https://github.com/joyent/node/blob/master/lib/net.js
 */

var events = require('events');

/**
 * @const
 */
var net = {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
net.Server = function() {};

/**
 *
 * @param {number|*} port
 * @param {(string|number|function(...))=} host
 * @param {(number|function(...))=} backlog
 * @param {function(...)=} callback
 * @return {void}
 */
net.Server.prototype.listen;

/**
 * @param {function(...)=} callback
 * @return {void}
 */
net.Server.prototype.close;

/**
 * @return {{port: number, family: string, address: string}}
 */
net.Server.prototype.address;

/**
 * @type {number}
 */
net.Server.prototype.maxConnectinos;

/**
 * @type {number}
 */
net.Server.prototype.connections;

/**
 * @constructor
 * @param {{fd: ?*, type: ?string, allowHalfOpen: ?boolean}=} options
 * @extends events.EventEmitter
 */
net.Socket = function(options) {};

/**
 * @param {number|string|function(...)} port
 * @param {(string|function(...))=} host
 * @param {function(...)=} connectListener
 * @return {void}
 */
net.Socket.prototype.connect;

/**
 * @type {number}
 */
net.Socket.prototype.bufferSize;

/**
 * @param {?string=} encoding
 * @return {void}
 */
net.Socket.prototype.setEncoding;

/**
 * @param {string|Buffer} data
 * @param {(string|function(...))=}encoding
 * @param {function(...)=} callback
 * @return {void}
 */
net.Socket.prototype.write;

/**
 * @param {(string|Buffer)=}data
 * @param {string=} encoding
 * @return {void}
 */
net.Socket.prototype.end;

/**
 * @return {void}
 */
net.Socket.prototype.destroy = function() {};

/**
 * @return {void}
 */
net.Socket.prototype.pause = function() {};

/**
 * @return {void}
 */
net.Socket.prototype.resume;

/**
 * @param {number} timeout
 * @param {function(...)=} callback
 * @return {void}
 */
net.Socket.prototype.setTimeout;

/**
 * @param {boolean=} noDelay
 * @return {void}
 */
net.Socket.prototype.setNoDelay;

/**
 * @param {(boolean|number)=} enable
 * @param {number=} initialDelay
 * @return {void}
 */
net.Socket.prototype.setKeepAlive;

/**
 * @return {string}
 */
net.Socket.prototype.address;

/**
 * @type {?string}
 */
net.Socket.prototype.remoteAddress;

/**
 * @type {?number}
 */
net.Socket.prototype.remotePort;

/**
 * @type {number}
 */
net.Socket.prototype.bytesRead;

/**
 * @type {number}
 */
net.Socket.prototype.bytesWritten;



//→ os.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's os module.
 * @see http://nodejs.org/api/os.html
 * @externs
 */

/** @const */
var os = {};



//→ path.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's path module.
 * @externs
 * @see http://nodejs.org/api/path.html
 */

/**
 * @const
 */
var path = {};



//→ punycode.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's punycode module.
 * @see http://nodejs.org/api/punycode.html
 * @see https://github.com/joyent/node/blob/master/lib/punycode.js
 */

/**
 * @const
 */
var punycode = {};

/**
 * @type {Object.<string,*>}
 */
punycode.ucs2 = {};

/**
 * @param {string} string
 * @return {Array.<number>}
 */
punycode.ucs2.decode;

/**
 * @param {Array.<number>} codePoints
 * @return {string}
 */
punycode.ucs2.encode;



//→ querystring.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's querystring module.
 * @see http://nodejs.org/api/querystring.html
 * @see https://github.com/joyent/node/blob/master/lib/querystring.js
 */

/**
 * @const
 */
var querystring = {};



//→ readline.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's readline module. Depends on the events module.
 * @see http://nodejs.org/api/readline.html
 */

var events = require('events');
var stream = require('stream');

/**
 * @const
 */
var readline = {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
readline.Interface = function() {};

/**
 * @param {string} prompt
 * @param {number} length
 * @return {void}
 */
readline.Interface.prototype.setPrompt;

/**
 * @param {boolean=} preserveCursor
 * @return {void}
 */
readline.Interface.prototype.prompt;

/**
 * @param {string} query
 * @param {function(string)} callback
 * @return {void}
 */
readline.Interface.prototype.question;

/**
 * @return {void}
 */
readline.Interface.prototype.pause;

/**
 * @return {void}
 */
readline.Interface.prototype.resume;

/**
 * @return {void}
 */
readline.Interface.prototype.close;

/**
 * @param {string} data
 * @param {Object.<string,*>=} key
 * @return {void}
 */
readline.Interface.prototype.write;



//→ repl.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's repl module. Depends on the events and stream modules.
 * @see http://nodejs.org/api/repl.html
 * @see https://github.com/joyent/node/blob/master/lib/repl.js
 */

var events = require('events');
var stream = require('stream');

/**
 * @const
 */
var repl = {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
repl.REPLServer = function() {};

/**
 * @type {Object.<string,*>}
 */
repl.REPLServer.prototype.context;



//→ stream.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's stream module. Depends on the events
 * module.
 * @externs
 *
 * @see http://nodejs.org/api/stream.html
 * @see https://github.com/joyent/node/blob/master/lib/stream.js
 */

/** @const */
var stream = {};

/**
 * @constructor
 * @param {Object=} options
 * @extends events.EventEmitter
 */
stream.Stream = function(options) {};

/**
 * @param {stream.Writable} dest
 * @param {{end: boolean}=} pipeOpts
 * @return {stream.Writable}
 */
stream.Stream.prototype.pipe;

/**
 * @constructor
 * @param {Object=} options
 * @extends stream.Stream
 */
stream.Readable = function(options) {};

/**
 * @type {boolean}
 * @deprecated
 */
stream.Readable.prototype.readable;

/**
 * @protected
 * @param {string|Buffer|null} chunk
 * @return {boolean}
 */
stream.Readable.prototype.push;

/**
 * @param {string|Buffer|null} chunk
 * @return {boolean}
 */
stream.Readable.prototype.unshift;

/**
 * @param {string} enc
 * @return {void}
 */
stream.Readable.prototype.setEncoding;

/**
 * @param {number=} n
 * @return {Buffer|string|null}
 */
stream.Readable.prototype.read;

/**
 * @protected
 * @param {number} n
 * @return {void}
 */
stream.Readable.prototype._read;

/**
 * @param {stream.Writable=} dest
 * @return {stream.Readable}
 */
stream.Readable.prototype.unpipe;

/**
 * @return {void}
 */
stream.Readable.prototype.resume;

/**
 * @return {void}
 */
stream.Readable.prototype.pause;

/**
 * @param {stream.Stream} stream
 * @return {stream.Readable}
 */
stream.Readable.prototype.wrap;

/**
 * @constructor
 * @extends stream.Readable
 */
stream.ReadableStream = function() {};

/**
 * @type {boolean}
 */
stream.ReadableStream.prototype.readable;

/**
 * @param {string=} encoding
 * @return {void}
 */
stream.ReadableStream.prototype.setEncoding;

/**
 * @return {void}
 */
stream.ReadableStream.prototype.destroy;

/**
 * @constructor
 * @param {Object=} options
 * @extends stream.Stream
 */
stream.Writable = function(options) {};

/**
 * @deprecated
 * @type {boolean}
 */
stream.Writable.prototype.writable;

/**
 * @param {string|Buffer} chunk
 * @param {string=} encoding
 * @param {function(*=)=} cb
 * @return {boolean}
 */
stream.Writable.prototype.write;

/**
 * @protected
 * @param {string|Buffer} chunk
 * @param {string} encoding
 * @param {function(*=)} cb
 * @return {void}
 */
stream.Writable.prototype._write;

/**
 * @param {string|Buffer=} chunk
 * @param {string=} encoding
 * @param {function(*=)=} cb
 * @return {void}
 */
stream.Writable.prototype.end;

/**
 * @constructor
 * @extends stream.Writable
 */
stream.WritableStream = function() {};

/**
 * @return {void}
 */
stream.WritableStream.prototype.drain;

/**
 * @type {boolean}
 */
stream.WritableStream.prototype.writable;

/**
 * @param {string|Buffer} buffer
 * @param {string=} encoding
 * @return {void}
 */
stream.WritableStream.prototype.write;

/**
 * @param {string|Buffer=} buffer
 * @param {string=} encoding
 * @param {function(*=)=} cb
 * @return {void}
 */
stream.WritableStream.prototype.end;

/**
 * @return {void}
 */
stream.WritableStream.prototype.destroy;

/**
 * @return {void}
 */
stream.WritableStream.prototype.destroySoon;

/**
 * @constructor
 * @param {Object=} options
 * @extends stream.Readable
 * Xextends stream.Writable
 */
stream.Duplex = function(options) {};

/**
 * @type {boolean}
 */
stream.Duplex.prototype.allowHalfOpen;


/**
 * @param {Object=} options
 * @constructor
 * @extends stream.Duplex
 */
stream.Transform = function(options) {};

/**
 * @protected
 * @param {string|Buffer} chunk
 * @param {string} encoding
 * @param {function(*=)} cb
 * @return {void}
 */
stream.Transform._transform;

/**
 * @protected
 * @param {function(*=)} cb
 * @return {void}
 */
stream.Transform._flush;

/**
 * @param {Object=} options
 * @constructor
 * @extends stream.Transform
 */
stream.PassThrough = function(options) {};

//→ string_decoder.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's string_decoder module. Depends on the buffer module.
 * @see http://nodejs.org/api/string_decoder.html
 * @see https://github.com/joyent/node/blob/master/lib/string_decoder.js
 */

/**
 * @param {string} encoding
 * @constructor
 */
var StringDecoder = function(encoding) {};

/**
 * @param {Buffer} buffer
 * @return {string}
 */
StringDecoder.prototype.write;

/**
 * @return {string}
 */
StringDecoder.prototype.toString;

/**
 * @param {Buffer} buffer
 * @return {number}
 */
StringDecoder.prototype.detectIncompleteChar;

/**
 * @param {Buffer} buffer
 * @return {string}
 */
StringDecoder.prototype.end;



//→ tls.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's tls module. Depends on the stream module.
 * @see http://nodejs.org/api/tls.html
 * @see https://github.com/joyent/node/blob/master/lib/tls.js
 */

var crypto = require('crypto');
var events = require('events');
var net = require('net');
var stream = require('stream');

/**
 * @const
 */
var tls = {};

/**
 * @constructor
 */
tls.CreateOptions = function () {};

/** @type {boolean} */
tls.CreateOptions.prototype.honorCipherOrder;

/** @type {boolean} */
tls.CreateOptions.prototype.requestCert;

/** @type {boolean} */
tls.CreateOptions.prototype.rejectUnauthorized;

/** @type {Array|Buffer} */
tls.CreateOptions.prototype.NPNProtocols;

/** @type {function(string)} */
tls.CreateOptions.prototype.SNICallback;

/** @type {string} */
tls.CreateOptions.prototype.sessionIdContext;

/**
 *
 * @param {number|tls.ConnectOptions} port
 * @param {(string|tls.ConnectOptions|function(...))=} host
 * @param {(tls.ConnectOptions|function(...))=} options
 * @param {function(...)=} callback
 * @return {void}
 */
tls.connect = function(port, host, options, callback) {};

/**
 * @constructor
 * @extends events.EventEmitter
 */
tls.SecurePair = function() {};

/**
 * @constructor
 * @extends net.Server
 */
tls.Server = function() {};

/**
 * @param {string} hostname
 * @param {string|Buffer} credentials
 * @return {void}
 */
tls.Server.prototype.addContext = function(hostname, credentials) {};

/**
 * @constructor
 * @extends stream.Duplex
 */
tls.CleartextStream = function() {};

/**
 * @type {boolean}
 */
tls.CleartextStream.prototype.authorized;

/**
 * @type {?string}
 */
tls.CleartextStream.prototype.authorizationError;

/**
 * @return {Object.<string,(string|Object.<string,string>)>}
 */
tls.CleartextStream.prototype.getPeerCertificate;

/**
 * @return {{name: string, version: string}}
 */
tls.CleartextStream.prototype.getCipher;

/**
 * @return {{port: number, family: string, address: string}}
 */
tls.CleartextStream.prototype.address;

/**
 * @type {string}
 */
tls.CleartextStream.prototype.remoteAddress;

/**
 * @type {number}
 */
tls.CleartextStream.prototype.remotePort;



//→ tty.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's tty module. Depends on the net module.
 * @see http://nodejs.org/api/tty.html
 * @see https://github.com/joyent/node/blob/master/lib/tty.js
 */

var net = require('net');

/**
 * @const
 */
var tty = {};

/**
 * @constructor
 * @extends net.Socket
 */
tty.ReadStream = function() {};

/**
 * @type {boolean}
 */
tty.ReadStream.prototype.isRaw;

/**
 * @param {boolean} mode
 * @return {void}
 */
tty.ReadStream.prototype.setRawMode;

/**
 * @constructor
 * @extends net.Socket
 */
tty.WriteStream = function() {};

/**
 * @type {number}
 */
tty.WriteStream.prototype.columns;

/**
 * @type {number}
 */
tty.WriteStream.prototype.rows;



//→ url.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's url module.
 * @see http://nodejs.org/api/url.html
 * @see https://github.com/joyent/node/blob/master/lib/url.js
 */

/**
 * @const
 */
var url = {};



//→ util.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's util module. Depends on the stream module.
 * @see http://nodejs.org/api/util.html
 * @see https://github.com/joyent/node/blob/master/lib/util.js
 */

/**
 * @const
 */
var util = {};



//→ vm.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's vm module.
 * @see http://nodejs.org/api/vm.html
 * @see https://github.com/joyent/node/blob/master/lib/vm.js
 */

/**
 * @const
 */
var vm = {};

/**
 * @constructor
 */
vm.Context = function() {}; // Does not really exist

/**
 * @constructor
 */
vm.Script = function() {};

/**
 * @return {void}
 */
vm.Script.prototype.runInThisContext;

/**
 * @param {Object.<string,*>=} sandbox
 * @return {void}
 */
vm.Script.prototype.runInNewContext;



//→ zlib.js:
/*
 * Copyright 2012 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Definitions for node's zlib module. Depends on the events and buffer modules.
 * @see http://nodejs.org/api/zlib.html
 * @see https://github.com/joyent/node/blob/master/lib/zlib.js
 */

var stream = require('stream');

/**
 * @const
 */
var zlib = {};



/**
 * @constructor
 * @extends stream.Transform
 */
zlib.Zlib = function() {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.Gzip = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.Gunzip = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.Deflate = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.Inflate = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.DeflateRaw = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.InflateRaw = function(options) {};

/**
 * @param {zlib.Options} options
 * @constructor
 * @extends zlib.Zlib
 */
zlib.Unzip = function(options) {};



/**
 * @type {number}
 * @const
 */
zlib.Z_NO_FLUSH = 0;

/**
 * @type {number}
 * @const
 */
zlib.Z_PARTIAL_FLUSH = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_SYNC_FLUSH = 2;

/**
 * @type {number}
 * @const
 */
zlib.Z_FULL_FLUSH = 3;

/**
 * @type {number}
 * @const
 */
zlib.Z_FINISH = 4;

/**
 * @type {number}
 * @const
 */
zlib.Z_BLOCK = 5;

/**
 * @type {number}
 * @const
 */
zlib.Z_TREES = 6;



/**
 * @type {number}
 * @const
 */
zlib.Z_OK = 0;

/**
 * @type {number}
 * @const
 */
zlib.Z_STREAM_END = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_NEED_DICT = 2;

/**
 * @type {number}
 * @const
 */
zlib.Z_ERRNO = -1;

/**
 * @type {number}
 * @const
 */
zlib.Z_STREAM_ERROR = -2;

/**
 * @type {number}
 * @const
 */
zlib.Z_DATA_ERROR = -3;

/**
 * @type {number}
 * @const
 */
zlib.Z_MEM_ERROR = -4;

/**
 * @type {number}
 * @const
 */
zlib.Z_BUF_ERROR = -5;

/**
 * @type {number}
 * @const
 */
zlib.Z_VERSION_ERROR = -6;



/**
 * @type {number}
 * @const
 */
zlib.Z_NO_COMPRESSION = 0;

/**
 * @type {number}
 * @const
 */
zlib.Z_BEST_SPEED = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_BEST_COMPRESSION = 9;

/**
 * @type {number}
 * @const
 */
zlib.Z_DEFAULT_COMPRESSION = -1;



/**
 * @type {number}
 * @const
 */
zlib.Z_FILTERED = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_HUFFMAN_ONLY = 2;

/**
 * @type {number}
 * @const
 */
zlib.Z_RLE = 3;

/**
 * @type {number}
 * @const
 */
zlib.Z_FIXED = 4;

/**
 * @type {number}
 * @const
 */
zlib.Z_DEFAULT_STRATEGY = 0;



/**
 * @type {number}
 * @const
 */
zlib.Z_BINARY = 0;

/**
 * @type {number}
 * @const
 */
zlib.Z_TEXT = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_ASCII = 1;

/**
 * @type {number}
 * @const
 */
zlib.Z_UNKNOWN = 2;



/**
 * @type {number}
 * @const
 */
zlib.Z_DEFLATED = 8;



/**
 * @type {number}
 * @const
 */
zlib.Z_NULL = 0;


