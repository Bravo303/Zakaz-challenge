const express = require('express');
// const router = require('express').Router();
const router = express.Router();
const { Favorites, Basket } = require('../db/models');
const {
  checkUserAndCreateSession,
  createUserAndSession, destroySession,
  isValid,
  renderSignInForm,
  renderSignUpForm,
  renderGenerator,
  renderFav,
  deletFromFav,
  addInBasket,
  renderBasket,
  deleteFromBasket,
  sendEmail,

} = require('../controllers/auth/auth.js');

router.get('/', (req, res) => {
  res.render('index');
});
router.post('/fav', async (req, res) => {
  try {
    const emailId = res.locals.useremail.id;
    const favLink = req.body.link;

    console.log('favLink', req.body);
    const povtor = await Favorites.findOne({ where: { favorites_link: favLink } });
    if (!povtor) {
      const favSock = await Favorites.create({
        user_id: emailId,
        favorites_link: favLink,
      });
      res.status(200).end();
    } else res.status(200).end();
  } catch (err) {
    console.log(err);
  }
});

router
  .route('/generator')
  .get(renderGenerator);
router
  .route('/favorites')
  .get(renderFav);

// router.get('/basket', (req, res) => {
//   res.render('basket'); // создала временную ручку, чтобы сделать hbs и стили
// });

router.post('/baskets/count', async (req, res) => {
  const basUser = await Basket.findAll({ where: { user_id: res.locals.useremail.id } });
  const reduceNew = await basUser.reduce((a, b) => a + b.basket_size, 0);
  console.log(reduceNew);
  res.json({ reduceNew });
});

router.get('/aboutUs', (req, res) => {
  res.render('aboutUs'); // создала временную ручку, чтобы сделать hbs и стили
});

router.get('/policy', (req, res) => { // Dimka ручка для политики!
  res.render('policy')
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
router
  .route('/:id')
  .delete(deletFromFav);
router
  .route('/addBasket')
  .put(addInBasket)
  .get(addInBasket);

router
  .route('/basket')
  .get(renderBasket);
router
  .route('/baskets/:id')
  .delete(deleteFromBasket);

router
  .route('/email')
  .post(sendEmail);

module.exports = router;
