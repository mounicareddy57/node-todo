var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//Connect to the database
mongoose.connect('mongodb://test:test@ds157631.mlab.com:57631/tododb');

//Create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

//Create a new model
var Todo = mongoose.model('Todo', todoSchema);

//Create a new item and save to database
/*var itemOne = Todo({item: 'buy flowers'}).save(function(err){
if(err) throw err;
    console.log('Item saved');
});*/

//var data =[{item:'get milk'},{item:'walk dog'},{item:'learn JS'}];

var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

module.exports = function (app) {

    app.get('/todo', function (req, res) {
        //get data from mongodb and pass it to view
        Todo.find({}, function (err, data) {
            if (err) throw err;
            res.render('todo', {
                todos: data
            });
        });

    });

    app.post('/todo',
        urlencodedParser,
        function (req, res) {
            //get data from the view and add to mongodb
            var newTodo = Todo(req.body).save(function (err, data) {
                if (err) throw err;
                res.json(data);
            })
        });

    app.delete('/todo/:item', function (req, res){
        console.log('delete working!');
        //delete the item from mongodb
        Todo.find({item: req.params.item}).remove(function(err, data){
            if (err) throw err;
            res.json(data);
        });
        
        
    });

}
