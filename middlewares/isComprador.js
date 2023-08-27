const isComprador = (req, res, next) => {
    console.log(req.session.comprador);
    if (req.session.comprador) {
        next();
    } else {
        console.log('Usuario no autenticado, redireccionando...');
        res.redirect('/')
    
    }
};

module.exports= {isComprador}