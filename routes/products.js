const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const productsController = require('../controllers/products');
const { isVendedor } = require('../middlewares/isVendedor')


router.post('/agregar', upload.fields([
    { name: 'Image' },
    { name: 'secondaryImages', maxCount: 10 }
]), productsController.agregar.post);

router.get('/agregar', isVendedor, productsController.agregar.get);

router.get('/vender', isVendedor, productsController.products.get);


router.get('/detalle/:id', productsController.detalle.get)

router.get('/buscar', productsController.buscar.get);

router.get('/agregar', productsController.buscar.get);

router.get('/editar/:id', productsController.editar.get);

router.put('/editar/:id', upload.fields([
    { name: 'Image' },
    { name: 'secondaryImages' }
]), productsController.editar.put);

router.delete('/eliminar/:id', productsController.eliminar.delete);







module.exports = router;


