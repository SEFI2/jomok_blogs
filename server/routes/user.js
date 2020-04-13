const userController = require('../controllers/user.ctrl');

module.exports = (router) => {
  router.route(
    '/user/:id',
  ).get(
    userController.validate('getUser'),
    userController.getUser,
  );
  router.route(
    '/users',
  ).get(
    userController.validate('getUsers'),
    userController.getUsers,
  );
  router
        .route('/user')
        .post(userController.addUser)


  /*
     router
        .route('/user/profile/:id')
        .get(usercontroller.getUserProfile)
       router
        .route('/user/follow')
    .post(usercontroller.followUser)
    */
};
