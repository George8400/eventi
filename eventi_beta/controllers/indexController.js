module.exports = {

    index: (req, res) => {
        res.render('index/categories');
    },

    submitCategories: (req, res) => {

        const lista = req.body.categories;
        
            console.log(req.body.test);
    }


};