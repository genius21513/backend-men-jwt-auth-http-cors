const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  // origin: "*",

  origin: [
    // "http://localhost:4000",

    // "http://localhost",
    // "http://localhost:3000",
    
    // "http://13.53.64.138",
    // "http://13.53.64.138:3000",

    // // "http://10.10.13.227",
    // "http://10.10.13.227:3000",

    // // "http://127.0.0.1",
    // "http://127.0.0.1:3000"
  ],  
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable    
    httpOnly: true,
    // httpOnly: false,
    path: "/",
    // sameSite: "none",
  })  
);

// This is test for the first.
app.use(function(req, res, next) {
  // This is default cookie func
  res.cookie("res.cookie", "res.cookie()");
  // This is test cookieSession token
  req.session.session_cookie = "session_cookie";

  // General headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept"
    // "Origin, Content-Type, Accept, Access-Control-Allow-Origin, Set-Cookie, Authorization"
  );

  var origin = req.get('origin'); // = req.headers.origin
  var host = req.get('host');
  const ipS = req.socket.remoteAddress;
  // const ipH = req.header('x-forwarded-for');
  console.log('---------------Log time: ', new Date());
  console.log('Origin: ', origin);
  console.log('Host: ', host);
  console.log('IpS: ', ipS);
  // console.log('IpH: ', ipH);
  console.log('---------------End');
  
  next();
});  


const db = require("./app/models");
const Role = db.role;

/** LocalHost */
// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
  
/** Remote Host */
db.mongoose
.connect(`${dbConfig.Connstring}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
