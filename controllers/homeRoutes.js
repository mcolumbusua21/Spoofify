const router = require("express").Router();
const { User } = require("../models");
const passport = require("passport");
var SpotifyWebApi = require('spotify-web-api-node');


let userData = [];
let accessToken = [];

router.get("/", async (req, res) => {
  // @ ToDo NEED TO CHECK ROUTES! IF NOT LOGGED IN, GO TO LOGIN PAGE!
  // OR ELSE MACHINE WONT RECOGNIZE NEW SPOTIFYID VARIABLE
  res.render("login");
  
 
});

router.get("/login", (req, res) => {
  // res.redirect("/"); let accessToken = userData[0].dataValues.accessToken
  console.log("HERE IS THE TOKEN   ",accessToken)
  // spotifyApi.setAccessToken(accessToken)
  
  let spotifyId = userData[0].dataValues.spotifyId

  res.render("home", {user: spotifyId});
  
});

// TESTING GET ARTIST ROUTE
router.get("/artist", async (req, res) => {
  console.log("Artist route")
  try{
    let spotifyId = await userData[0].dataValues.spotifyId
    var spotifyApi = await new SpotifyWebApi({
      clientId:process.env.client_id ,
      clientSecret: process.env.client_secret,
      redirectUri: "http://localhost:3001/auth/spotify/callback"
    });
      spotifyApi.setAccessToken(accessToken)
      spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function(data) {
          console.log('Artist albums', data.body);
          res.render('home',{user: spotifyId, artist: data.body})
        },
        function(err) {
          console.error(err);
        }
      );
  }catch(err){
    console.log("ERROR AT ARTIST ROUTE", err)
  }
})

router.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
  }),
  function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
    // res.render("login", { user: JSON.stringify(req.user) });
  }
);

router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  async function (req, res) {
    userData = [];
    accessToken = [];
    await accessToken.push(req.user)
    await userData.push(req.user)
    // console.log("userData Array",userData)
    // Successful authentication, redirect home.
    // console.log(req.user)

    //Redirecting to /login forces feedback loop
     res.redirect('/login');

  }
);



router.get('/logout', (req, res) => {
  userData = [];
  accessToken = [];
  req.session = null;
  req.logout(); 
  res.redirect('/login');
})

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}


module.exports = router;
