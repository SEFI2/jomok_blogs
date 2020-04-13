/** */
const { query } = require('express-validator/check');
const User = require('../models/User');
const Article = require('../models/Article');

module.exports = {
  validate: (method) => {
    switch (method) {
      case 'getUsers': {
        return [
          query('limit').optional().isInt().toInt(),
          query('skip').optional().isInt().toInt(),
        ];
      }
    }
  },
  getUsers: async (req, res, next) => {
    User.find().limit(req.query.limit).skip(req.query.skip).then((err, users) => {
      if (err) res.send(err);
      else res.send(users);
      next();
    })
  }
  addUser: (req, res, next) => {
    new User(req.body).save((err, newUser) => {
      if (err) res.send(err);
      else if (!newUser) res.send(400);
      else res.send(newUser);
      next();
    });
  },
  getUser: (req, res, next) => {
    User.findById(req.params.id).then((err, user) => {
      if (err) res.send(err);
      else if (!user) res.send(404);
      else res.send(user);
      next();
    });
  },
  /**
     * user_to_follow_id, user_id
     */
  followUser: (req, res, next) => {
    User.findById(req.body.id).then((user) => user.follow(req.body.user_id).then(() => res.json({ msg: 'followed' }))).catch(next);
  },
  getUserProfile: (req, res, next) => {
    User.findById(req.params.id).then((_user) => User.find({ following: req.params.id }).then((_users) => {
      _users.forEach((user_) => {
        _user.addFollower(user_);
      });
      return Article.find({ author: req.params.id }).then((_articles) => res.json({ user: _user, articles: _articles }));
    })).catch((err) => console.log(err));
  },
};
