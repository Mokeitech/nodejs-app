//EXPRESS BASICS (it was installed with npm install express and npm install i to install the node_modules folder)
import  express  from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//CONNECT TO MONGODB DECLARATION START
mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName:"backend",
})
.then(() => console.log("Database Connected"))
.catch(e => console.log(e));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);
//CONNECT TO MONGODB DECLARATION END

const app = express();

const users = [];

//USING MIDDLEWARES
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//SETTING UP VIEWS ENGINE(EJS FILE) line 9 that serves also line 20
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (token) {
        
      const decoded =  jwt.verify(token, "jinfjenjnjefe");
      
      req.user = await User.findById(decoded._id);

        next();
      }
      else {
        res.redirect("/login");
      }
};

app.get("/", isAuthenticated, (req, res) => {
    res.render("logout", { name: req.user.name });
    /*res.json({
        success: true,        
        products:[],
    });*/
    //GETTING THE ABOVE IN HTML WITH THE BELOW(comment) CONST AND RES.SENDFILE, RENDER, STATUS ETC
    //const pathlocation = path.resolve();
    //res.sendFile(path.join(pathlocation, "./index.html"));    //remember, its for html files
    //EJS TUTORIAL (INSTALL EJS WITH npm i ejs)
    //res.render("index", { name: "Chigozie"}); THIS PATH IS USED TO SHOW INDEX THAT CONTAINS USERNAME AND EMAIL ADDRESS 
    //res.render("login")
 });

 app.get("/login", (req, res) => {
    res.render("login");
 });

app.get("/register",  (req, res) => {
    res.render("register");
 });

 app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if(!user) return res.redirect("/register");

    //const isMatch = user.password===password;
    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) return res.render("login", { email, message: "Incorrect Password"});

    const token = jwt.sign({ _id: user._id }, "jinfjenjnjefe");
   
           res.cookie("token", token , {
           httpOnly: true, 
           expires: new Date(Date.now() + 60 * 1000),
       });   
       res.redirect("/");
   });


 app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
   
    let user = await User.findOne({ email });
    if (user) {
       return res.redirect("/login");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


/*app.post("/login", async (req, res) => {
 const { name, email } = req.body;

 let user = await User.findOne({ email });
 if (!user) {
    return res.redirect("/register");
 }*/

  user = await User.create({
    name,
    email,
    password: hashedPassword,
 });

 const token = jwt.sign({ _id:user._id }, "jinfjenjnjefe");
 console.log(token);

        res.cookie("token", token , {
        httpOnly: true, 
        expires: new Date(Date.now() + 60 * 1000),
    });   
    res.redirect("/");
});

app.get("/logout", (req, res) => {
    res.cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.redirect("/");
});

//CONNECT TO MONGODB FUNCTIONALITIES START
/*app.get("/add", async (req, res) => {
    await Message.create({name: "Gozie3", email: "example2@gmail.com"});
        res.send("Nice");
});*/
//CONNECT TO MONGODB FUNCTIONALITIES END

/*app.get("/success", (req, res) => {
    res.render("success");
});*/

//LOAD DATA/MESSAGE to MONGODB START
/*app.post("/contact", async (req, res) => {
   //console.log(req.body.name, req.body.email);  //PRINT THE ITEMS IN TERMINAL
   const {name, email} = req.body;
   await Message.create({ name, email });
   res.redirect("/success");
});*/
//LOAD DATA/MESSAGE to MONGODB END

/*app.get("/users", (req, res) => {
    res.json({
        users,
    });
});*/

app.listen(5000, () => {
    console.log("Server is working")
});