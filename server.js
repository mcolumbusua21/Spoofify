require("dotenv").config();
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const path = require("path");
const express = require("express");
// const session = require('express-session');
// const exphbs = require('express-handlebars');
// const routes = require('./controllers');

// const sequelize = require('./config/connection');

// const hbs = exphbs.create({});

// //Creating new sequelize store
// const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// const sess = {
//     secret: 'Rainbow Kitten Suprise',
//     cookie: {},
//     resave: false,
//     saveUninitialized: true,
//     store: new SequelizeStore({
//         db: sequelize
//     })
// };

// //Middleware
// app.use(session(sess))

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// app.use(routes);

// sequelize.sync({ force: false }).then(() => {
//
//   });

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.client_id,
      clientSecret: process.env.client_secret,
      callbackURL: "http://localhost:3001/auth/spotify/callback",
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      userInfo.findOrCreate({ spotifyId: profile.id }),
        function (err, user) {
          return done(err, user);
        };
    }
  )
);

app.get('/', (req, res) => {
  res.redirect('/auth/spotify')
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
    res.redirect("/");
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
app.listen(PORT, () => console.log("Now listening", PORT));
