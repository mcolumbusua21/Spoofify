require("dotenv").config();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const path = require("path");
const express = require("express");
const session = require('express-session');
const exphbs = require('express-handlebars');
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
        return done(null, profile);
      });
    }
  )
);


sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () => console.log("Now listening", PORT));
  });

