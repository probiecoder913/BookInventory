const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();


app.set('view engine', 'ejs');
app.use(bodyparser.json());//parsing the application/json
app.use(bodyparser.urlencoded({ extended: true }));//parses the x-www-form-urlencoded

Book = require('./models/book');
Suppliers = require('./models/supplier');
mongoose.connect('mongodb://localhost/inventory');
var db = mongoose.connection;

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
function sanitizer(string){
    string = entities.encode(string);
    return string;
}
//getting to the index
app.get('/',(req ,res)=>{
    res.render('index');
});
//getting addbook page
app.get('/addbook' , (req ,res)=>{
    res.render('addbook');
});
//getting editbook page
app.get('/editbook/:id',(req, res)=>{
    var id = req.params.id;
    res.render('editbook',{ id:id });
});
//getting books
app.get('/books',(req , res)=>{
    Book.getBooks((err , books)=>{
        if(err){
            res.render('book' , {
                msg:'Error in getting details..' 
            });
        }
        else{
        var obj = books;
        res.render('book', { obj:obj } );
        }
    }) 
});
// add the books 
app.post('/addbook',(req, res)=>{
    var name = entities.encode(req.body.name);
    var price = entities.encode(req.body.price);
    var qty = entities.encode(req.body.qty);
    var state = entities.encode(req.body.state);
    var on = makeid(7);
    Book.addBook({
        name:name,price:price,qty:qty,state:state,isbn:on
    } , (err , book)=>{
        if(err)
        { res.render('addbook', {
            msg:'Please fill required details!'
        })}
        var obj = book;
        // res.render('addbook' , {
        //     msg:'successfully submit!!'
        //});
        res.redirect('/books');  
    });
});
// update the book data
app.post('/editbook/:id',(req ,res)=>{
    var  id = req.params.id;
    var name = entities.encode(req.body.name);
    var price = entities.encode(req.body.price);
    var qty = entities.encode(req.body.qty);
    var state = entities.encode(req.body.state);
    var on = makeid(7);
    Book.updateBook(id , {
        name:name,price:price,qty:qty,state:state,isbn:on
    },{}, (err , callback)=>{
        if(err){
            res.render('editbook', {msg:"Error Occured."});
        }
        // res.render('editbook' ,{ id:id ,msg:"Successfully updated!!"} );
        res.redirect('/books');
    });
 });
//delete the data of books
app.post('/deletebook/:_id',(req , res)=>{
    var id = req.params._id;
    Book.removeBook(id , (err ,callback)=>{
        if(err){throw err}
        res.redirect('/books');
        } );
});
app.post('/showbooks/:id',(req ,res)=>{
    var id = req.params.id;
    Book.findbyid(id , (err , books)=>{
        if(err){throw err;}
        var obj = books;
        res.render('showbooks', {obj:obj});
    });
});
//--------------------------------------------------
app.get('/addsupplier',(req,res)=>{
    res.render('addsupplier');
});
app.get('/editsupplier/:id',(req,res)=>{
    var id = req.params.id;
    res.render('editsupplier', {id:id});
});
// finds the suppliers
app.get('/suppliers',(req, res)=>{
        Suppliers.getSuppliers((err , suppliers)=>{
            if(err)
            {
                res.render('supplier' , {
                    msg:'some error occured!!'
                });
            }
            var obj = suppliers; 
            res.render('supplier' , {obj:obj});
        });
});
app.post('/addsupplier' , (req ,res)=>{
    var cmpname = sanitizer(req.body.cmpname);
    var bookname = sanitizer(req.body.bookname);
    var state = sanitizer(req.body.state);
    var emailid = sanitizer(req.body.emailid);
    var contactno = sanitizer(req.body.contactno);
    var address = sanitizer(req.body.address);
    var costprice = sanitizer(req.body.costprice);
    var qty = sanitizer(req.body.qty);
    var on = makeid(7);
    var supplier = {cmpname:cmpname, bookname:bookname, state:state, emailid:emailid, 
                contactno:contactno, address:address, costprice:costprice, qty:qty ,isbn:on };
    Suppliers.addSupplier(supplier , (err , supplier)=>{
        if(err){throw err}
        res.redirect('/suppliers');
    })
});
// //add suppliers
// app.post('/addsupplier',(req ,res)=>{
//     var supplier = req.body;
//     Suppliers.addSupplier(supplier , (err, supplier)=>{
//         if(err){
//             throw err; 
//         }
//         res.json(supplier);
//     });
// });
//update the supplier data
app.get('/showsupplier/:id',(req , res)=>{
    var id = req.params.id;
    Suppliers.getSuppliersById(id , (err , supplier)=>{
        if(err){throw err}
        var obj = supplier;
        res.render('showsupplier', {obj:obj});
    });
});
app.post('/editsupplier/:_id',(req ,res)=>{
    var id = req.params._id;
    var cmpname = sanitizer(req.body.cmpname);
    var bookname = sanitizer(req.body.bookname);
    var state = sanitizer(req.body.state);
    var emailid = sanitizer(req.body.emailid);
    var contactno = sanitizer(req.body.contactno);
    var address = sanitizer(req.body.address);
    var costprice = sanitizer(req.body.costprice);
    var qty = sanitizer(req.body.qty);
    var on = makeid(7);
    var supplier = {cmpname:cmpname, bookname:bookname, state:state, emailid:emailid, 
                contactno:contactno, address:address, costprice:costprice, qty:qty ,isbn:on };
    Suppliers.updateSupplier(id , supplier ,{},(err , supplier)=>{
        if(err){
            throw err
        }
        res.redirect('/suppliers');
    });
} );
//delete the data from supplier ...
app.post('/deletesupplier/:_id',(req,res)=>{
    var id = req.params._id;
    Suppliers.removeSupplier(id, (err , callback)=>{
        if(err){throw err}
        res.redirect('/suppliers');
    });
});
app.listen( process.env.PORT || 8080, ()=>{
    console.log('running in port 8080..');
});