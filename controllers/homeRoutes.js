const router = require("express").Router();
const { User } = require("../models");
const passport = require("passport");
var SpotifyWebApi = require("spotify-web-api-node");



router.get("/", isAuth, async (req, res) => {
  // @ ToDo NEED TO CHECK ROUTES! IF NOT LOGGED IN, GO TO LOGIN PAGE!
  // OR ELSE MACHINE WONT RECOGNIZE NEW SPOTIFYID VARIABLE
  console.log("HERE IS THE HOME ROUTE");
  // spotifyApi.setAccessToken(accessToken)
  const userData = await User.findByPk(req.session.passport.user);
  const spotifyId = userData.get({ plain: true }).spotifyId;
  // let spotifyId = userData[0].dataValues.spotifyId

  res.render("home", { user: spotifyId });
  // res.render("login");
});

// router.get("/login", async (req, res) => {
//   // res.redirect("/"); let accessToken = userData[0].dataValues.accessToken

// });

var spotifyApi = new SpotifyWebApi({
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: "http://localhost:3001/auth/spotify/callback",
});

// TESTING GET ARTIST ROUTE
router.get("/artist", async (req, res) => {
  try {
    console.log("Artist route");
    const currentUser = await User.findByPk(req.session.passport.user);
    // console.log(currentUser.get({ plain: true }))
    const accessToken = currentUser.get({ plain: true }).accessToken;
    const refreshToken = currentUser.get({ plain: true }).refreshToken;

    //
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    spotifyApi
      .getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE", { limit: 10, offset: 20 })
      .then(
        function (data) {
          console.log("Album information", data.body);
        },
        function (err) {
          console.error(err);
        }
      );
  } catch (err) {
    console.log("ERROR AT ARTIST ROUTE", err);
  }
});

router.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  }),
  function (req, res) {}
);

// @ToDo failure go to 404
router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  async function (req, res) {
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  userData = [];
  accessToken = [];
  req.session = null;
  req.logout();
  res.redirect("/");
});

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}

module.exports = router;
