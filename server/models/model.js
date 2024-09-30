

const { default: mongoose } = require('mongoose');
const Schema=mongoose.Schema; //new

// const Schema=require('mongoose');
// const Schema = require('mongoose').Schema;

//categories=>field=>['type','color']
const categories_model=new Schema({
    type:{type:String,default:"Investment"},
    color:{type:String,default:'#fcbe44'}

})

//transactions=> field=>['name','type']
const transaction_model=new Schema({
    name:{type:String,default:"Anonymous"},
    type:{type:String,default:"Investment"},
    amount:{type:Number},
    date:{type:Date,default:Date.now}
})

const Categories=mongoose.model('categories',categories_model)
const Transaction=mongoose.model('tranaction',transaction_model);

exports.default=Transaction;
module.exports={
    Categories,
    Transaction
}