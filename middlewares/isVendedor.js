const isVendedor = (req, res, next) => {
    console.log(req.session.vendedor);
    if (req.session.vendedor) {
        next();
    } else {
        console.log('Usuario no autenticado, redireccionando...');
        req.session.alertMessage = "Debes iniciar sesión como vendedor para acceder a esta página.";
        res.redirect('/')
    }
};

module.exports= {isVendedor}