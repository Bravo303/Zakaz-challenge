const express = require('express');
// const router = require('express').Router();
const router = express.Router();

const {
  checkUserAndCreateSession,
  createUserAndSession, destroySession,
  isValid,
  renderSignInForm,
  renderSignUpForm,
} = require('../controllers/auth/auth.js');

router.get('/', (req, res) => {
  res.render('index');
});
router.get('/fav', (req, res) => {
  res.render('fav'); //создала временную ручку, чтобы сделать hbs и стили
});

router.get('/basket', (req, res) => {
  res.render('basket'); //создала временную ручку, чтобы сделать hbs и стили
});

router.get('/aboutUs', (req, res) => {
  res.render('aboutUs'); //создала временную ручку, чтобы сделать hbs и стили
});


router
  .route('/regForm')
  // Страница регистрации пользователя
  .get(renderSignUpForm)
  // Регистрация пользователя
  .post(isValid, createUserAndSession);

router
  .route('/logForm')
  // Страница аутентификации пользователя
  .get(renderSignInForm)
  // Аутентификация пользователя
  .post(checkUserAndCreateSession);

router.get('/signout', destroySession);

module.exports = router;
