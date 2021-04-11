require("dotenv").config();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const { User } = require("./models");
var SpotifyWebApi = require("spotify-web-api-node");

const sequelize = require("./config/connection");

const hbs = exphbs.create({});

// //Creating new sequelize store
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "Rainbow Kitten Suprise",
  cookie: {},
  resave: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

//Middleware
app.use(session(sess));

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id)
  .then (function (user) {
    done(null, user);
  });
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.client_secret,
      callbackURL: "https://spoofify13.herokuapp.com/auth/spotify/callback",
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.

      const existingUser = await User.findOne({
        where: { spotify_id: profile.id },
      });
      console.log('EXISTINGUSER==>',existingUser)

      if (!existingUser) {
        const newUser = await User.create({
          spotifyId: profile.id,
          accessToken: accessToken,
          refreshToken: refreshToken,
          expires_in: expires_in,
        });
        return done(null, newUser);
      }
      existingUser.update(
        {
          accessToken: accessToken
        }
      )
      return done(null, existingUser);
    }
  )
);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening", PORT));
});
