const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const productsFilePath = path.join(__dirname, '../database/products.json');

const readProductsFile = () => {
    try {
        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(productsData);
    } catch (error) {
        console.error('Error reading products file:', error);
        return [];
    }
};

const writeProductsFile = (data) => {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing products file:', error);
    }
};

const products = {
    get: (req, res) => {
        try {
            const productsData = readProductsFile();
            const productosDelVendedor = productsData.filter(producto => 
                producto.createdBy && producto.createdBy.toString() === req.session.vendedor._id?.toString()
              );
              
            res.render('vendedor', { productos: productosDelVendedor });
        } catch (error) {
            console.error(error);
            res.render('error');
        }
    },
};

const detalle = {
    get: (req, res) => {
        try {
            const productId = req.params.id;
            const productsData = readProductsFile();
            const producto = productsData.find(product => product._id === productId);
            res.render('detail', { producto });
        } catch (error) {
            console.error(error);
            res.render('error');
        }
    },
};

const buscar = {
    get: (req, res) => {
        try {
            const searchTerm = req.query.search;
            const productsData = readProductsFile();
            const producto = productsData.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
            if (!producto || producto.length === 0) {
                return res.status(404).send('Producto no encontrados');
            }
            res.render('buscar', { producto });
        } catch (error) {
            console.error('Error al obtener detalles de los productos:', error);
            res.status(500).send('Error al obtener detalles de los productos');
        }
    },
};

const agregar = {
    get: (req, res) => {
        res.render('agregar');
    },

    post: (req, res) => {
        try {
            const { name, description, price, discount, count } = req.body;
            const mainImage = req.files['Image'][0].filename;
            const secondaryImages = req.files['secondaryImages'].map(file => file.filename);

            // Obtener el ID del vendedor actual de la sesión
            const createdBy = req.session.vendedor._id;

            const newProduct = {
                _id: uuidv4(),
                name,
                description,
                price,
                images: {
                    mainImage: mainImage,
                    secondaryImages: [...secondaryImages],
                },
                discount: discount,
                cantidad: count,
                createdBy: createdBy, // Asociar el ID del vendedor al producto
            };

            const productsData = readProductsFile();
            productsData.push(newProduct);
            writeProductsFile(productsData);

            res.redirect('/products/agregar');
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            res.status(500).send('Error al agregar el producto');
        }
    }
};

const editar = {
    get: (req, res) => {
        try {
            const productoId = req.params.id;
            const productsData = readProductsFile();
            const producto = productsData.find(product => product._id === productoId);
            res.render("editar", { producto });
        } catch (error) {
            console.error(error);
            res.status(500).render('error');
        }
    },

    put: async (req, res) => {
        try {
            const productoId = req.params.id;
            const { name, description, price, discount, count } = req.body;
            const productsData = readProductsFile();
            const productoIndex = productsData.findIndex(product => product._id === productoId);
    
            for (const product of productsData) {
                const mainImageAntigua = product.images.mainImage;
                const secondaryImages = product.images.secondaryImages;
            
                console.log('Main Image:', mainImageAntigua);
                console.log('Secondary Images:', secondaryImages);

                if (mainImageAntigua) {
                    const mainImagePath = path.join(__dirname, '../public/images/products', mainImageAntigua);
                    fs.unlinkSync(mainImagePath);
                    console.log('Main image deleted:', mainImageAntigua);
                }
            
              
                for (const secondaryImage of secondaryImages) {
                    const secondaryImagePath = path.join(__dirname, '../public/images/products', secondaryImage);
                    fs.unlinkSync(secondaryImagePath);
                    console.log('Secondary image deleted:', secondaryImage);
                }
            
            }
            

            if (productoIndex === -1) {
                return res.status(404).send('Producto no encontrado');
            }

            const productoToUpdate = productsData[productoIndex];
    
            const updatedProduct = {
                ...productoToUpdate,
                name,
                description,
                price,
                discount,
                cantidad: count,
                images: {
                    mainImage: req.files['Image'] ? req.files['Image'][0].filename : productoToUpdate.images.mainImage,
                    secondaryImages: req.files['secondaryImages'] ? req.files['secondaryImages'].map(file => file.filename) : productoToUpdate.images.secondaryImages,
                },
            };
    
            productsData[productoIndex] = updatedProduct;
            writeProductsFile(productsData);
    

         
            
            res.redirect(`/products/editar/${productoId}`);
        } catch (error) {
            console.error('Error al editar el producto:', error);
            res.status(500).send('Error al editar el producto');
        }
    },

}
const eliminar = {
    delete: (req, res) => {
        try {
            const productoId = req.params.id;
            console.log(productoId);

            const productsData = readProductsFile();
            const productoIndex = productsData.findIndex(product => product._id === productoId);

            if (productoIndex !== -1) {
                const producto = productsData[productoIndex];

                const mainImagePath = path.join(__dirname, '../public/images/products/', producto.images.mainImage);

                if (fs.existsSync(mainImagePath)) {
                    fs.unlinkSync(mainImagePath);
                } else {
                    console.log('Archivo no encontrado:', mainImagePath);
                }

                producto.images.secondaryImages.forEach((imageName) => {
                    const secondaryImagePath = path.join(__dirname, '../public/images/products/', imageName);
                    if (fs.existsSync(secondaryImagePath)) {
                        fs.unlinkSync(secondaryImagePath);
                    } else {
                        console.log('Archivo no encontrado:', secondaryImagePath);
                    }
                });

                productsData.splice(productoIndex, 1);
                writeProductsFile(productsData);
            }

            res.redirect('/products/vender');
        } catch (error) {
            console.error(error);
            res.status(500).render('error');
        }
    },
};


module.exports = {
    agregar,
    editar,
    products,
    eliminar,
    detalle,
    buscar
}