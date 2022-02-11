const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
// const { where } = require('sequelize/types');
const {
  User, Basket, Favorites, Order,
} = require('../../db/models');

function failAuth(res, err) {
  return res.status(401).json({ err });
}

exports.isValid = (req, res, next) => {
  console.log(req.body, 'приходит req body');
  const { valueName, valuePass, valueEmail } = req.body;
  if (valueName && valuePass && valueEmail) next();
  else res.status(401).end();
};

exports.createUserAndSession = async (req, res, next) => {
  const { valueName, valuePass, valueEmail } = req.body;
  const userCheck = await User.findOne({ where: { email: valueEmail }, raw: true });
  if (userCheck) return res.json({ authorised: false });

  try {
    // Мы не храним пароль в БД, только его хэш
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(valuePass, saltRounds);

    const user = await User.create({

      name: valueName,
      password: hashedPassword,
      email: valueEmail,
    });
    console.log(user, 'проверяем юзера');

    // записываем в req.session.user данные (id & name) (создаем сессию)
    req.session.email = { id: user.id, email: user.email, username: user.name }; // req.session.user -> id, name
    // res.json({ 1: 1 });
    res.json({ authorised: true });
    console.log(req.session.user, 'local user session');
  } catch (err) {
    console.error('Err message:', err.message);
    console.error('Err code', err.code);
    // return failAuth(res, err.message);
    res.json({ authorised: false });
  }
  // ответ 200+автоматическое создание и отправка cookies в заголовке клиенту
};

exports.checkUserAndCreateSession = async (req, res, next) => {
  const { userEmail, password } = req.body;
  console.log(req.body);

  // Пытаемся сначала найти пользователя в БД
  const user = await User.findOne({ where: { email: userEmail }, raw: true });
  console.log(user);
  if (!user) {
    return res.json({ authorised: false });
  }
  if (user) {
    try {
      // Сравниваем хэш в БД с хэшем введённого пароля
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(user);
      if (!isValidPassword) {
        return failAuth(res, ' Неправильное имя\\пароль');
      }

      req.session.email = { id: user.id, email: user.email, username: user.name }; // записываем в req.session.user данные (id
      console.log(req.session.email);
      res.json({ authorised: true });

      // & name) (создаем сессию)
      // res.status(200).end();
    } catch (err) {
      console.error('Err message:', err.message);
      console.error('Err code', err.code);
      // return failAuth(res, err.message);
    }
  }

  // res.status(200).end(); // ответ 200 + автоматическое создание и отправка cookies в заголовке клиенту
};

exports.destroySession = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie('sid');
    res.redirect('/');
  });
};

exports.renderSignInForm = (req, res) => res.render('logform', { isSignin: true });

exports.renderSignUpForm = (req, res) => res.render('regform', { isSignup: true });

exports.renderGenerator = (req, res) => res.render('generator');

exports.renderFav = async (req, res) => {
  console.log(req.session.email);
  if (req.session.email) {
    const a = req.session.email.id;
    const fav = await Favorites.findAll({ where: { user_id: a }, raw: true });
    console.log(fav);
    res.render('fav', { fav });
  }
  res.status(401);
};
exports.deletFromFav = async (req, res) => {
  const deletId = req.params.id;
  console.log(deletId);
  const destroy = await Favorites.destroy({ where: { id: deletId } });
  res.end();
};
exports.renderBasket = async (req, res) => {
  if (req.session.email) {
    const localsId = res.locals.useremail.id;
    const findBasket = await Basket.findAll({ where: { user_id: localsId }, raw: true });
    // console.log(findBasket);
    const reduc = await findBasket.reduce((a, b) => a + b.basket_size, 0);
    // console.log(reduc);
    res.render('basket', { findBasket, reduc });
  }res.render('regform');
};

exports.addInBasket = async (req, res) => {
  console.log('req.body', req.body);
  const { linkPic } = req.body;
  const { link } = req.body;
  if (linkPic) {
    const changeCount = await Basket.findOne({ where: { basket_link: linkPic } });
    if (changeCount) {
      changeCount.increment('basket_size', { by: 1 });
      res.end();
      // console.log('=>>>>', changeCount);
    } else {
      const findUser = await User.findOne({ where: { id: res.locals.useremail.id }, raw: true });

      const addInBasket = await Basket.create({ basket_link: linkPic, user_id: findUser.id, basket_size: 1 });

      res.end();
    }
  }
  if (link) {
    console.log(link);
    const changeCount = await Basket.findOne({ where: { basket_link: link } });
    if (changeCount) {
      changeCount.increment('basket_size', { by: 1 });

      res.end();
      // console.log('=>>>>', changeCount);
    } else {
      const findUser = await User.findOne({ where: { id: res.locals.useremail.id }, raw: true });

      const addInBasket = await Basket.create({ basket_link: link, user_id: findUser.id, basket_size: 1 });

      res.end();
    }
  }
};

exports.deleteFromBasket = async (req, res) => {
  try {
    const delBasket = req.params.id;
    const findBasd = await Basket.findOne({ where: { id: delBasket } });

    if (findBasd.basket_size >= 2) {
      await findBasd.increment('basket_size', { by: -1 });
      const reduce1 = await Basket.findAll({ where: { user_id: res.locals.useremail.id } });
      const reduc = await reduce1.reduce((a, b) => a + b.basket_size, 0);
      res.json({
        delete: false, count: findBasd.basket_size, reduce: reduc, id: findBasd.id,
      });
    } else {
      const reduce2 = await Basket.findAll({ where: { user_id: res.locals.useremail.id } });
      const reduc = await reduce2.reduce((a, b) => a + b.basket_size, 0);
      const destroy1 = await Basket.destroy({ where: { id: delBasket } });
      res.json({ delete: true, reduce: reduc, id: findBasd.id });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.sendEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
};
/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 * @param err  сообщение об ошибке
 */
