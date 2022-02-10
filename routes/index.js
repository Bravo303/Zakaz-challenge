const express = require('express');
// const router = require('express').Router();
const router = express.Router();
const { Favorites } = require('../db/models');
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
// router.post('/fav', async (req, res) => {
//   const emailId = res.locals.useremail.id;
//   const favLink = req.body.link;
//   const povtor = await Favorites.findOne({ where: { favorites_link: favLink } });
//   if (!povtor) {
//     const favSock = await Favorites.create({
//       user_id: emailId,
//       favorites_link: favLink,
//     });
//   } else res.status(200).end();
// });
router.get('/fav', (req, res) => {
  res.render('fav');
});

router
  .route('/generator')
  .get(renderGenerator);
router
  .route('/favorites')
  .get(renderFav);

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
