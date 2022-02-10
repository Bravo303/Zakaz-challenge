const express = require('express');
// const router = require('express').Router();
const router = express.Router();

const {
  checkUserAndCreateSession,
  createUserAndSession, destroySession,
  isValid,
  renderSignInForm,
  renderSignUpForm,
  renderGenerator,
  renderFav,
} = require('../controllers/auth/auth.js');

router.get('/', (req, res) => {
  res.render('index');
});
router
  .route('/generator')
  .get(renderGenerator);
router
  .route('/favorites')
  .get(renderFav);
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
