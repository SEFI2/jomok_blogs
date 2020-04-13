/** */
const { query, validationResult } = require('express-validator');
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
      default: {
        return [
        ];
      }
    }
  },
  getUsers: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const users = await User.find().limit(req.query.limit).skip(req.query.skip);
      res.send(users);
    } catch (err) {
      res.send(err);
    }
    next();
  },
  addUser: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await new User(req.body).save();
      if (!user) res.send(400);
      else res.send(user);
    } catch (err) {
      res.send(err);
    }
    next();
  },
  getUser: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.params.id);
      if (!user) res.send(400);
      else res.send(user)
    } catch(err) {
      res.send(err)
    }
    next();
  },
  followUser: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) res.send(400);
      else res.send(user)
    } catch(err) {
      res.send(err)
    }
    next();
    //User.findById(req.body.id).then((user) => user.follow(req.body.user_id).then(() => res.json({ msg: 'followed' }))).catch(next);
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
