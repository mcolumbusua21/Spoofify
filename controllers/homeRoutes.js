const router = require("express").Router();
const { User } = require("../models");
const passport = require("passport");
var SpotifyWebApi = require("spotify-web-api-node");
const fetch = require("node-fetch");
const path = require('path');


router.get("/", isAuth, async (req, res) => {
  // @ ToDo NEED TO CHECK ROUTES! IF NOT LOGGED IN, GO TO LOGIN PAGE!
  // OR ELSE MACHINE WONT RECOGNIZE NEW SPOTIFYID VARIABLE
  res.render("login");
});

router.get("/login", async (req, res) => {
  // res.redirect("/"); let accessToken = userData[0].dataValues.accessToken
  console.log(req.session);
  // spotifyApi.setAccessToken(accessToken)
  const userData = await User.findByPk(req.session.passport.user);
  const spotifyId = userData.get({ plain: true }).spotifyId;
  // let spotifyId = userData[0].dataValues.spotifyId

  res.render("home", { user: spotifyId });
});

var spotifyApi = new SpotifyWebApi({
  clientID: process.env.client_id,
  clientSecret: process.env.client_secret,
  callbackURL: "http://localhost:3001/auth/spotify/callback",
});

// TESTING GET ARTIST ROUTE
router.get("/artist/:band", async (req, res) => {
  try {
    console.log("Artist route");
    const currentUser = await User.findByPk(req.session.passport.user);
    // console.log(currentUser.get({ plain: true }))
    const accessToken = currentUser.get({ plain: true }).accessToken;
    const refreshToken = currentUser.get({ plain: true }).refreshToken;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    //get arist by Name
    const bandName = req.params.band;
    const artist = await (await spotifyApi.searchArtists(bandName)).body.artists
      .items[0];

    console.log(artist);

    const artistName = artist.name;
    const artistId = artist.id;
    const artistImg = artist.images[0];

    const response = await fetch('http://localhost:3001/api/search/', {
      method: "POST",
      body: JSON.stringify({
        artist: artistName,
        artist_id: artistId,
        img: artistImg,
        user_id: currentUser,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      res.redirect("/artist");
    } else {
      console.log("Failed to search band");
    }

    // const artist = artist.get({ plain: true})

    // res.render('home', {
    //   artist: artist.name
    // })
  } catch (err) {
    console.log("ERROR AT ARTIST ROUTE", err);
  }
});

router.get("/artist", async (req, res) => {
  try {
    const searchData = await Search.findAll({
      include: [
        {
          model: User,
          attribute: ["spotifyId"],
        },
      ],
    });

    const search = searchData.map((search) => search.get({ plain: true }))

    res.render('artist', {
      search,
      logged_in: req.session.logged_in
    })
  } catch (err){
    res.status(500).json(err)
  }
});

router.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  }),
  function (req, res) {}
);

router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  async function (req, res) {
    res.redirect("/login");
  }
);

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}

module.exports = router;
