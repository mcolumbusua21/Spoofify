const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth')
const passport = require("passport");
let currentUser;


router.get('/login', isAuth, (req, res) => {
    res.redirect('/')
  })
  
  router.get('/', (req, res) => {
    res.send(`Welcome, ${currentUser}!`)
  })
  
  router.get("/auth/spotify", passport.authenticate("spotify"), function (req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  });
  
  router.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect home.
      currentUser = req.user.displayName
      res.redirect('/')
    }
  );
  
  router.get(
    "/auth/spotify",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private"],
    }),
    function (req, res) {
      // The request will be redirected to spotify for authentication, so this
      // function will not be called.
    }
  );
  
  function isAuth(req, res, next) {
    if (req.isAuthenticated()) return next()
    res.redirect('/auth/spotify')
  }

  module.exports = router;
