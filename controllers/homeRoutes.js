const router = require("express").Router();
const { User } = require("../models");
const passport = require("passport");
var SpotifyWebApi = require("spotify-web-api-node");
const fetch = require("node-fetch");
const path = require('path');

let artistName;
let artistId;
let artistImg;
let artistGenre;
let songData;

router.get("/", isAuth, async (req, res) => {
  res.render("login");
});

router.get("/login", async (req, res) => {

  console.log(req.session);

  const userData = await User.findByPk(req.session.passport.user);
  const spotifyId = userData.get({ plain: true }).spotifyId;


  res.render("home", { user: spotifyId, artist: artistName });
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

    //get artist by Name
    const bandName = req.params.band;
    const artist = (await spotifyApi.searchArtists(bandName)).body.artists
      .items[0];

    
   
      
    //global variables now have information to then pass into the /artist route
    artistName = artist.name;
    artistId = artist.id;
    artistImg = artist.images[0];
    artistGenre = artist.genres[0];
   
    

    //Get top tracks from artist
    const searchSong = (await spotifyApi.getArtistTopTracks(artistId, 'US'))

    songData = searchSong.body.tracks
   
  //  console.log(searchSong.body.tracks) 



    // @ToDo set up a POST route to save info to Search model

    // const response = await fetch('http://localhost:3001/api/search/', {
    //   method: "POST",
    //   body: JSON.stringify({
    //     artist: artistName,
    //     artist_id: artistId,
    //     img: artistImg,
    //     user_id: currentUser,
    //   }),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // if (response.ok) {
    //   res.redirect("/artist");
    // } else {
    //   console.log("Failed to post band");
    // }

    // const newArtist = artist.get({ plain: true})

    res.render('login', {
      artist: "testing"
    })
  } catch (err) {
    console.log("ERROR AT ARTIST ROUTE", err);
  }
});

router.get("/artist", async (req, res) => {
  try {
    console.log("SONG DATA ",songData[0].name)
    res.render('artist', {
      artist: artistName,
      img: artistImg,
      genre: artistGenre,
      songs: songData
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
