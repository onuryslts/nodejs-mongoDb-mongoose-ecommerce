const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "pug");
app.set("views", "./views");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const multer = require('multer');

const errorController = require("./controllers/errors");

const User = require("./models/user");
const ConnectionString =
  "mongodb+srv://@cluster0.5h71pxl.mongodb.net/node-app?retryWrites=true&w=majority";
var store = new mongoDbStore({
  uri: ConnectionString,
  collection: "mySessions",
});
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,'./public/img/')
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname + '-'+ Date.now()+ path.extname(file.originalname));
  }
})
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: storage}).single('image'));
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
    store: store,
  })
);
app.use(express.static(path.join(__dirname, "public")));
// routes

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});
app.use(csurf());
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);
app.use("/500", errorController.get500Page);
app.use(errorController.get404Page);
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).render("error/500", { title: "Error" });
});

/*
connection.execute('SELECT * FROM products')
.then((result)=>{
  console.log(result[0]);
}).catch((err)=>{
  console.log(err);
});
*/

//Product.hasOne(Category);
/*
mongoConnect(() => {
  User.findByUserName("onuryslts")
    .then((user) => {
      if (!user) {
        user = new User("onuryslts", "onuryslts@gmail.com");
        return user.save();
      }
      return user;
    })
    .then((user) => {
      console.log(user);
      app.listen(3000);
    })
    .catch((err) => {
      console.log(err);
    });
});
*/
mongoose
  .connect(ConnectionString)
  .then(() => {
    console.log("connected to mongodb");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
