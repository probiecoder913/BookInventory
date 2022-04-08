var mongoose = require('mongoose'); 
var bookSchema = mongoose.Schema({
    name:{
        type:String,
        required :'Please Enter valid name'
    },
    state:{
        type:String,
        required :true
    },
    price:{
        type:Number,
        required: true
    },
    qty:{
        type:Number,
        required:true
    },
    isbn:{
        type:String
    }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

module.exports.getBooks = (callback , limit)=>{
    Book.find(callback).limit(limit);
}
module.exports.addBook = (book , callback)=>{
    Book.create(book ,callback);  
}

module.exports.updateBook=( id , book , option ,callback)=>{
    var query = { _id:id};
    var update={
        qty: book.qty,
        state:book.state,
        price:book.price,
        name:book.name,
        isbn:book.isbn
    }
    Book.findOneAndUpdate(query ,update, book ,callback);
};

module.exports.removeBook =(id , callback)=>{
    var query = {_id:id};
    Book.remove(query , callback);
}
module.exports.findbyid = (id , callback)=>{
    var query = {_id:id};
    Book.findById(query , callback);
};