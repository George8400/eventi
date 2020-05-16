
module.exports = {

    mongodbUrl: 'mongodb://AdminMdb:Giorgio1984@testmongodb-shard-00-00-emoou.mongodb.net:27017,testmongodb-shard-00-01-emoou.mongodb.net:27017,testmongodb-shard-00-02-emoou.mongodb.net:27017/test?ssl=true&replicaSet=TestMongoDB-shard-0&authSource=admin&retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    AWS_SECRET_ACCESS: '+Z8DrbHY62OnK1skwJ5qnRwktl08HmHgZucLSU55',
    AWS_ACCESS_KEY: 'AKIAJK5DJHUBLYKQ3Q4A',
    globalVariables: (req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.success = req.flash('success');
        res.locals.warning_msg = req.flash('warning_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        
        next();
    }  
};