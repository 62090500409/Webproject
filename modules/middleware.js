const middleware = {};

middleware.isAdmin = (req, res, next) => {
    if(!req.isAuthenticated() || (req.user.role !== 'admin' && req.user.role !== 'master')) {
        req.flash('error', 'you can not access to this page.');
        res.redirect('back');
    } else {
        next();
    }
}

module.exports = middleware;