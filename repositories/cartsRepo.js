const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repo = require('./repo');

class cartsRepo extends Repo {}
module.exports = new cartsRepo('carts.json');
