const router = require("express").Router();
const { User } = require("../models");
const withAuth = require("../utils/auth");
const passport = require("passport");

router.get("/login", isAuth, (req, res) => {
  res.redirect("/");
});
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/login", isAuth, (req, res) => {
  res.redirect("/");
});
// router.get("/auth/spotify", passport.authenticate("spotify"), function (req, res) {
//   // The request will be redirected to spotify for authentication, so this
//   // function will not be called.
// });

router.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  async function (req, res) {
    // Successful authentication, redirect home.

     res.render("login", { user: JSON.stringify(req.user) });

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

router.get('/logout', (req, res) => {
  req.session = null;
  req.logout(); 
  res.redirect('/');
})

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/spotify");
}

module.exports = router;
