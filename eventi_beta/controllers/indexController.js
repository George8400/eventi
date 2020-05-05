module.exports = {

    index: (req, res) => {
        res.render('index/categories');
    },

    submitCategories: (req, res) => {

        let categories = req.body.categories;

    },

    createEvent: (req, res) => {
        res.render('index/createEvent');
    }


};