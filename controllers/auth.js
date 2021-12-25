const User = require('../models/user');

const bcrypt = require('bcryptjs')

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
  const email = req.body.email;
  const password = req.body.password

  User.findOne({ email: email})
    .then(user => {
      if(!user) {
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then((doMatch) => {
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/')
          });
        }
        res.redirect('/login')
      })
      .catch(err => {
        console.log('Mat khau k dung')
        res.redirect('login')
      })
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
    return bcrypt
      .hash( password, 12)
      .then(hashPass => {
        const newUser = new User({
          email: email,
          password: hashPass,
          cart: { items: [] }
        })
        return newUser.save()
      })
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
