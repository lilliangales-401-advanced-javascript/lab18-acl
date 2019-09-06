'use strict';

const express = require('express');
const apiRouter = express.Router();

const User = require('./model/user.js');
const Article = require('./model/article.js');
const article = new Article();
const auth = require('./middleware/auth.js');
const oauth = require('./oauth/google.js');

apiRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then((user) => {
      req.token = user.generateToken(user.role);
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    })
    .catch(next);
});

apiRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send({ user: req.user, token: req.token });
});

apiRouter.get('/oauth', (req, res, next) => {
  oauth.authorize(req)
    .then(token => {
      res.status(200).send(token);
    })
    .catch(next);
});

// generates a key for indefinite use.
apiRouter.post('/key', auth(), (req, res, next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

apiRouter.post('/article', auth('create'), (req, res, next) => {
  let article = new Article(req.body);
  article.save()
    .then(article => {
      res.status(200);
      res.send(article);
    })
    .catch(next)
})

apiRouter.get('/public-stuff', (req, res, next) => {
  // article.get()
  //   .then(article => {
  //     res.status(200);
  //     res.send(article);
  //   })
  //   .catch(next)
  res.send('public stuff')
  console.log('public stuff')
})

apiRouter.get('/hidden-stuff', auth('read'), (req, res, next) => {
  res.send('hidden stuff');
  console.log('hidden stuff');
})

apiRouter.delete('/hidden-stuff', auth('delete'), (req, res, next) => {
  res.send('deleted stuff');
  console.log('deleted stuff');
})

module.exports = apiRouter;