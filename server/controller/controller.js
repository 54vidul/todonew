const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//CREATE A MONGOOSE,TODO,USER OBJ
var {mongoose} = require('.././db/mongoose');
var {Todo} = require('.././models/todo');
var {User} = require('.././models/user');
var {authenticate} = require('.././middleware/authenticate');


var urlEncodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
    
//ACCESS THE MIDDLEWARE
app.use(bodyParser.json());

    
    //ROUTING CREATE TODO
app.post('/todos', [authenticate, urlEncodedParser], (req, res) =>{
    
    var time = new Date().getTime();
    
    //GET TODO FROM THE CLIENT'S BODY
    var todo = new Todo({
        text: req.body.text,
        madeOn: time,
        _creator: req.user._id
    });
    //SAVE TODO IN THE DB
    todo.save().then((doc) =>{
        res.send(doc);
    }, (err) =>{
        res.status(400).send(err);
    });
    
    
});

    //RENDER PAGES
app.get('/login',(req, res) =>{
  res.render("login",{});  
})
    
app.get('/',(req, res) =>{
  res.render("login",{});  
})
    
app.get('/todo', (req, res) =>{
  res.render("todo",{});  
});
    

//GET ALL TODOS
app.get('/todos', authenticate, (req, res) =>{
    //GET ALL TODOS IN THE DB
    Todo.find({
        _creator: req.user._id
    }).then((todos) =>{
        res.send({
            todos
        });
    }, (err) =>{
        res.status(400).send(err);
    });
});

//GET INDIVIDUAL TODO USING URL PARAMATER
app.get('/todos/:id', authenticate, (req, res) => {
   
    var id = req.params.id;
    
    //CHECK IF THE ID PASSED IS VALID
    if(!ObjectID.isValid(id)){
        //STOP EXECUTION USING RETURN 
        return res.send(404).send();
    }
    
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) =>{
       if(!todo){
           return res.status(404).send();
       }
        
        res.send({
            todo
        });
    }, (err) => {
        res.status(404).send();
    });
        
   
});

app.delete('/todos/:id', authenticate, (req, res) =>{
   //GET THE ID
    var id = req.params.id;
    
    //VALIDATE THE ID
    if(!ObjectID.isValid(id)){
        //STOP EXECUTION USING RETURN
        return res.status(404).send();
    }
    
    //REMOVE TODO BY ID
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) =>{
       if(!todo){
           return res.status(404).send();
       } 
        res.status(200).send(todo);
    }, (err) =>{
        res.status(404).send();
    }).catch((e) =>{
        res.status(404).send();
    });
});

//UPDATE 
app.patch('/todos/:id', [authenticate, urlEncodedParser], (req, res) =>{
    //GET THE ID
    var id = req.params.id;
    
    //VALIDATE THE ID
    if(!ObjectID.isValid(id)){
        //STOP EXECUTION USING RETURN
        return res.status(404).send();
    }
    
    //USING LODASH TO PICK BODY
    //BECAUSE WE WANT USER TO ONLY UPDATE FEW OF THE PROPERTY
    //PICK TAKES AN OBJECT AND THEN TAKES AN ARRAY WHICH TAKES THE PROPERTIES YOU WANNA PULL-OFF
    var body = _.pick(req.body, ['text','completed']);
    
    //CHECK THE COMPLETED VALUE AND USE THAT VALUE TO SET COMPLETED AT
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
    
    //UPDATE THE DATABASE 
    //1ST ARG : ID 
    //2ND ARG : OBJ WITH VALUES ie MONGOOSE OPERATOR
    //3RD ARG : OPTIONS WHICH STATES HOW FN WORKS
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true}).then((todo) =>{
        if(!todo) {
            return res.status(404).send();
        }
        res.status(200).send(todo);
    }, (err) =>{
        res.status(404).send();
    }).catch((e) =>{
       res.status(404).send(e); 
    });
    
    
})



//USER SCHEMA
app.post('/users', urlEncodedParser, (req, res) =>{
    //PICK ONLY EMAIL AND PASSWORD FROM THE REQ SINCE REST ARE NOT MODIFIABLE BY USER
    var body = _.pick(req.body, ['email','password']);
//    var user = new User({
//        email: body.email,
//        password: body.password
//    });
    var user = new User(body);
    
    user.save().then(() =>{
        //RETURN A PROMISE AND TOKEN IS OBTAINED
        return user.generateAuthToken();
//        res.status(200).send(user);
    }).then((token) =>{
        //HEADER (KEY:VALUE)
        //X-AUTH MEANS WE ARE CREATING A CUSTOM HEADER
        res.header('x-auth', token).send(user);
    }).catch((error) =>{
        res.status(400).send(error);
    }); 
    
});



//CREATE PRIVATE ROUTE
//WITH AUTH 
app.get('/users/me', authenticate, (req, res) =>{
   //THIS CODE WILL GO INTO THE MIDDLEWARE
//    //GET THE AUTH TOKEN FROM THE REQ
//    var token = req.header('x-auth');
//    //STATICS MODEL METHOD TO GET THE USER WITH THE TOKEN
//    User.findByToken(token).then((user) =>{
//        if(!user){
//            //THERE IS A VALID TOKEN BY QUERY CANNOT FIND THE USER
//            //CAN ALSO SEND RES.STATUS(401).SEND()
//            return Promise.reject();
//        }
//        res.status(200).send(user); 
//    }).catch(() => {
//        //401 MEANS AUTH IS REQUIRED
//        res.status(401).send();
//    });
    console.log("in controller");
    res.status(200).send(req.user);
});

//LOGIN USER
app.post('/users/login', urlEncodedParser, (req, res) =>{
   
    var body = _.pick(req.body, ['email', 'password']);
    
    //CALL THE MODEL METHOD 
    User.findByCredentials(body.email, body.password).then((user) =>{
        return user.generateAuthToken().then((token) =>{
            res.header('x-auth', token).send(user);
        });
    }).catch((err) =>{
        res.status(400).send(err);
    });
    
});


//LOGOUT USER
app.delete('/users/me/token', authenticate,  (req, res) =>{
   
    req.user.removeToken(req.token).then(() =>{
       res.sendStatus(200).send(); 
    }, () =>{
        res.sendStatus(400).send();
    });
});
    
}