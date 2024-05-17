const http = require('http')
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {Server} = require('socket.io')


const server = express();
const App = http.createServer(server);
const io = new Server(App);

//socket io


const bodyParser = require('body-parser')
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Customer } = require("./Model/Customer");
const { SenitizeUser } = require("./Services/Commen");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//dotenv imports

require("dotenv").config();
const SECRET_KEY = process.env.SCERET_KEY;
const PORT = process.env.PORT;
const DATABASE = process.env.DATABASE;

//Routes For API

const Productrouter = require("./Routes/Product")
const Customerouter = require("./Routes/Customer");
const Supplierrouter = require("./Routes/Supplier");
const Userrouter = require("./Routes/User");
const Orderrouter = require('./Routes/Order');
const Dashboardrouter = require('./Routes/Dashboard');
const { Socket } = require('dgram');

//Server started

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SArfwershnrt234%$";

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  })
);

server.use(express.json());
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true,parameterLimit:50000}));
server.use(cors());

server.use("/product",Productrouter.router)
server.use("/customer", Customerouter.router);
server.use("/supplier", Supplierrouter.router);
server.use('/user',Userrouter.router);
server.use('/order', Orderrouter.router);
server.use('/dashboard', Dashboardrouter.router)

//This is Called when LOGIN Api called

passport.use(
  "local",
  new LocalStrategy({ usernameField: "Phone_Number" }, async function (
    Phone_Number,
    Password,
    done
  ) {
    // by default passport uses username
    
    try {
      console.log({ Phone_Number, Password },"working");
      const user = await Customer.findOne({ Phone_Number: Phone_Number });
      console.log(Phone_Number, Password, user);
      if (!user) {
        return done(null, false, { message: 'invalid credentials' }); // for safety
      }
      crypto.pbkdf2(
        Password,
        user.Salt,
        3100,
      512,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.Hash_Password, hashedPassword)) {
            console.log('working')
            return done(null, false, { message: 'invalid credentials' });
          }
          const token = jwt.sign(
            SenitizeUser(user),
            SECRET_KEY
          );
          done(null, { id: user._id,Phone_Number: user.Phone_Number, token, }); // this lines sends to serializer
        }
      );
    } catch (err) {
      console.log(err,"Working")
      done(err);
    }
  })
);

//This API Called when JWT Cookie is provided
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log("JWT Startegy Called");
    try {
      const user = await Customer.findOne({ _id: jwt_payload.id });
      if (user) {
        return done(null, SenitizeUser(user));
      } else {
        return done(null, false, { error: "Something Went Wrong" });
      }
    } catch (err) {
      done(err);
    }
  })
);

//This is Serializer user

passport.serializeUser(function (user, cb) {
  console.log("SerializeUser called");
  process.nextTick(function () {
    return cb(null, SenitizeUser(user));
  });
});

//This is Deselizer user

passport.deserializeUser(function (user, cb) {
  console.log("Deserilizeuser called");
  process.nextTick(function () {
    return cb(null, user);
  });
});

//Database Connection

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(DATABASE);
  console.log("Database Connected");
}
App.listen(PORT, () => {
  console.log(`Server is started at ${PORT}`);
});
