var express = require('express');
var router = express.Router();
var userModel = require("./users");
const passport = require('passport');
const postModel = require("./post");
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function (req, res, next) {
  res.render("index", { nav: false });
});

router.get('/login', function (req, res, next) {
  res.render("login", { error: req.flash("error"), nav: false });
});

router.get('/signup', function (req, res, next) {
  res.render("signup", {
    nav: false
  });
});

router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("post");
  res.render("profile", { user, nav: true });
});

router.get('/add', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render("add", { user, nav: true })
});

router.post('/createpost', isLoggedIn, upload.single("postimage"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  });
  user.post.push(post._id)
  await user.save();
  res.redirect("/profile");
});

router.post('/fileupload', isLoggedIn, upload.single("image"), async function (req, res, next) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  user.profileImage = req.file.filename;
  user.save();
  res.redirect("/profile");
});

router.post("/register", function (req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    password: req.body.password
  })

  userModel.register(data, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/profile");
      })
    })
});

router.post("/login", passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/profile",
  failureFlash: true
}), function (req, res, next) {

})

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

router.get("/show/posts", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
    .populate("post");
  res.render("show", { nav: true, user })
})

router.get("/feed", async function (req, res, next) {
  // const user = await userModel.findOne({ username: req.session.passport.user })
  const posts = await postModel.find()
    .populate("user");
      console.log(posts)
      const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("feed", { nav: false , posts , user})
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login")
}



module.exports = router;
