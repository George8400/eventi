module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }

        req.flash('error', 'Effettua il login per poter creare un evento');
        res.redirect('/login');
    }
}