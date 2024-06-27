const express = require('express');
const passport = require('passport');
const session = require('express-session');

const app = express();

require('dotenv').config();
require('./passport-setup'); // Importa a configuração do passport

app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Login with Google</a>');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Sucesso no login
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.send(`Olá, ${req.user.displayName}`);
  console.log(req);
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
