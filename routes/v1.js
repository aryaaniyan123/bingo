const express         = require('express');
const router         = express.Router();

const UserController   = require('../controllers/user.controller');
const GameController = require('../controllers/game.controller');
const HomeController   = require('../controllers/home.controller');

const custom           = require('./../middleware/custom');

const passport         = require('passport');
const path              = require('path');
require('./../middleware/passport')(passport)

router.post('/users', UserController.create); //create   
                                               
router.get('/users',passport.authenticate('jwt', {session:false}), UserController.get);  //read
     
router.put('/users',passport.authenticate('jwt', {session:false}), UserController.update); //update
   
router.delete('/users',passport.authenticate('jwt',{session:false}), UserController.remove); //delete
router.post(    '/users/login',     UserController.login);

router.post('/games', passport.authenticate('jwt', {session:false}), GameController.create);
router.get('/games', passport.authenticate('jwt', {session:false}), GameController.getAll);
router.get('/games/:game_id', passport.authenticate('jwt', {session:false}), custom.game, GameController.get);
router.put('/games/:game_id', passport.authenticate('jwt', {session:false}), custom.game, GameController.update);
router.delete('/games/:game_id', passport.authenticate('jwt', {session:false}), custom.game, GameController.remove);
module.exports = router;