const express = require('express');
const cartsRepo = require('../repositories/cartsRepo');
const productsRepo = require('../repositories/productsRepo');
const cartItemsTemplate = require('../views/cart/cartItems');
const router = express.Router();

// handeler to handle add request to cart
router.post('/cart/add/:id', async (req, res) => {
	const productId = req.params.id;
	if (!req.session.cartId) {
		console.log(req.session.cartId);
		let products = [];
		const product = {
			id: productId,
			qt: 1
		};
		products.push(product);
		const createdCart = await cartsRepo.create({ products });
		console.log(createdCart);
		req.session = {
			cartId: createdCart.id
		};
	} else {
		const cartId = req.session.cartId;
		const cart = await cartsRepo.getOne(cartId);
		let productPresent = false;
		for (let product of cart.products) {
			if (product.id == productId) {
				product.qt++;
				productPresent = true;
				break;
			}
		}
		if (!productPresent) cart.products.push({ id: productId, qt: 1 });
		await cartsRepo.update(cartId, cart);
	}
	res.redirect('/');
});

// handeler to handle request to list the cart items
router.get('/cart', async (req, res) => {
	const cartId = req.session.cartId;
	console.log(cartId);
	let products = [];
	if (cartId) {
		const cart = await cartsRepo.getOne(cartId);
		products = cart.products;
	}
	for (let p of products) {
		const curr = await productsRepo.getOne(p.id);
		p.product = curr;
	}

	res.send(await cartItemsTemplate({ products }));
});
// handle delete from cart
router.post('/cart/product/delete', async (req, res) => {
	console.log(req.body.productId);
	const cart = await cartsRepo.getOne(req.session.cartId);
	let products = cart.products;
	products = products.filter((curr) => {
		return curr.id != req.body.productId;
	});
	cart.products = products;
	await cartsRepo.update(cart.id, cart);
	res.redirect('/cart');
});
module.exports = { router };
