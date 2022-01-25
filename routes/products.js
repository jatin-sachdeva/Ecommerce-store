const express = require('express');
const productsTemplate = require('../views/products/index');
const productsRepo = require('../repositories/productsRepo');
const cartsRepo = require('../repositories/cartsRepo');
const router = express.Router();

router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsTemplate({ products }));
});

module.exports = { router };
