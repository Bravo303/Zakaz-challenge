const express = require('express');
const createError = require('http-errors');
const session = require('express-session'); // подключаем библиотеку + установка npm i express-session *** Dimka ***
const logger = require('morgan');
const path = require('path');
require('dotenv').config(); // подключаем чтение из файла .env + npm i dotenv  *** Dimka ***
// const dbConCheck = require('./db/dbConCheck.js') // Проверка коннекта с БД *** Dimka ***
// const { DataTypes } = require('sequelize/types');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient();

const app = express();
const PORT = 3000;
const indexRouter = require('./routes');

// Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('view engine', 'hbs');
// Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".
app.set('views', path.join(__dirname, 'views'));
const { sequelize } = require('./db/models');

async function DBC() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
}
DBC();
const sessionConfig = { // Скопировал из лекции Ромы *** Dimka ***
  name: 'sid', // название куки
  store: new RedisStore({ client: redisClient }), // подключаем БД для храненя куков
  secret: process.env.COOKIE_SECRET, // ключ для шифрования cookies // require('crypto').randomBytes(10).toString('hex')
  resave: false, // Если true,  пересохраняет сессию, даже если она не поменялась
  saveUninitialized: false, // Если false, куки появляются только при установке req.session
  cookie: {
    secure: process.env.NODE_ENV === 'production', // В продакшне нужно "secure: true" для работы через протокол HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 10, // время жизни cookies, ms (10 дней)
  },
};
app.use(session(sessionConfig)); // req.session.user = {name: '....'}*** Dimka ***

// сохраняем в обьект res.locals.username имя пользователя для использования username в layout.hbs
app.use((req, res, next) => {
  res.locals.useremail = req.session.email; //* ** Dimka ***
  // res.locals.username = req.session.username;
  // console.log(req.session.username);
  // console.log('\n\x1b[33m', 'req.session.email.email:', req.session.email); //* ** Dimka ***
  // console.log('\x1b[35m', 'res.locals.useremail:', res.locals.useremail); //* ** Dimka ***
  next();
});

// Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(logger('dev'));
// Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));
// Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.
app.use(express.json());

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`>>> Server Started at PORT: ${PORT} ...(+)`);
});
