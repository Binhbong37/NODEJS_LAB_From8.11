const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('61c5360857a5b02fd8a1189a')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  // const confirmPass = req.boyd.confirmPassword
  
  User.findOne({ email: email })
  .then(userDoc => {
    if(userDoc) {
      return res.redirect("/signup")
    }
    const newUser = new User({
      email: email,
      password: password,
      cart: { items: [] }
    })
    return newUser.save()
  })
  .then(result => {
    console.log("Tao User thanh cong !!")
    res.redirect('/login')
  })
  .catch(err => console.log('Chua tao dc USER moi !!'))

};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
