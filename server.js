require("dotenv").config();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const path = require("path");
const express = require("express");
const session = require('express-session');
// const exphbs = require('express-handlebars');
const routes = require('./controllers');

// const sequelize = require('./config/connection');

const hbs = exphbs.create({});

// //Creating new sequelize store
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
    secret: 'Rainbow Kitten Suprise',
    resave: true,
    saveUninitialized: true,
    // store: new SequelizeStore({
    //     db: sequelize
    // })
};

 //Middleware
// app.use(session(sess))

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//
//   });
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.client_secret,
      callbackURL: "http://localhost:3001/auth/spotify/callback",
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      process.nextTick(function () {
        // To keep the example simple, the user's spotify profile is returned to
        // represent the logged-in user. In a typical application, you would want
        // to associate the spotify account with a user record in your database,
        // and return that user instead.
        return done(null, profile);
      });
    }
  )
);

<<<<<<< HEAD
app.get('/login', isAuth, (req, res) => {
  res.redirect('/')
})

app.get('/', (req, res) => {
//   res.send(`Welcome, ${currentUser}!`)
    res.render('login')
})

app.get("/auth/spotify", passport.authenticate("spotify"), function (req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    currentUser = req.user.displayName
    res.redirect('/')
  }
);

app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  }),
  function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);
=======
>>>>>>> a5503de0b04580bde03174f0840dde2c55544ca9


app.listen(PORT, () => console.log("Now listening", PORT));
