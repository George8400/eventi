module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) {
            return next();
        }

        req.flash('error', 'Effettua il login per creare un evento e diventare un event manager');
        res.redirect('/login');
    }
}