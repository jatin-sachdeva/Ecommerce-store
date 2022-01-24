const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repo = require('./repo');

class ProductRepo extends Repo {}
module.exports = new ProductRepo('products.json');
