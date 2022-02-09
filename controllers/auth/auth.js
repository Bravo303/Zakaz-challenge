const bcrypt = require('bcrypt');
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
    req.session.user = { id: user.id, email: user.email }; // req.session.user -> id, name
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
  console.log(user)
  if (!user) return res.json({ authorised: false });

  if (user) {
    try {
      // Сравниваем хэш в БД с хэшем введённого пароля
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return failAuth(res, ' Неправильное имя\\пароль');

      req.session.user = { id: user.id, name: user.name }; // записываем в req.session.user данные (id & name) (создаем сессию)
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

/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 * @param err  сообщение об ошибке
 */
