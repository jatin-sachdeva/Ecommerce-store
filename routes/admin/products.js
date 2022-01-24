const express = require('express');
const { validationResult, check } = require('express-validator');
const { getTitle, getPrice } = require('../../routes/admin/validators');
const multer = require('multer');
const productsNew = require('../../views/admin/product/new');
const products = require('../../repositories/productsRepo');
const index = require('../../views/admin/product/index');
const productEditTemplate = require('../../views/admin/product/edit');
const { checkErrors, checkCookie } = require('./middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// definig the storage path for image read multer docs upload.single(''field name");

router.get('/admin/products/new', [ checkCookie ], (req, res) => {
	res.send(productsNew({ req }));
});
router.post(
	'/admin/products/new',
	[ upload.single('image'), getTitle, getPrice, checkErrors(productsNew) ],
	async (req, res) => {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	console.log(errors);
		// 	res.send(productsNew({ errors }));

		const img = req.file.buffer.toString('base64'); // covert file to base 64 encoding

		const { price, title } = req.body;
		console.log(price, title);
		await products.create({ img, price, title }); // create a productt
		console.log(price, title);
		res.redirect('/admin/products'); // redirecting
	}
);
router.get('/admin/products', [ checkCookie ], async (req, res) => {
	const productsArr = await products.getAll();
	res.send(index(productsArr));
});

// handelling the edit page
router.get('/admin/products/:id/edit', checkCookie, async (req, res) => {
	console.log(req.params.id);
	const product = await products.getOne(req.params.id);
	if (!product) res.send('product not found');
	res.send(productEditTemplate({ product }));
});

router.post(
	'/admin/products/:id/edit',
	[
		upload.single('image'),
		getTitle,
		getPrice,
		checkErrors(productEditTemplate, async (req) => {
			const product = await products.getOne(req.params.id);
			return { product };
		})
	],
	async (req, res) => {
		// reupload/update the product
		const productId = req.params.id;
		const { title, price } = req.body;
		const img = await products.getOne(productId).img;
		if (req.file) {
			img = req.file.buffer.toString('base64');
		}
		// update
		try {
			await products.update(productId, { title, price, img });
		} catch (err) {
			return res.send('couldnt find the item');
		}
		// res.send('updated');
		res.redirect('/admin/products');
	}
);
// handelling delete
router.post('/admin/products/:id/delete', (req, res) => {
	try {
		products.delete(req.params.id);
	} catch (err) {
		res.send("the item doesn't exist so cant be deleted");
	}
	res.redirect('/admin/products');
});

module.exports = { router };
