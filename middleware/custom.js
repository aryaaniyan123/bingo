const Game            = require('./../models').Game;
const { to, ReE, ReS } = require('../services/util.service');

let game = async function (req, res, next) {
    let game_id, err, game;
    game_id = req.params.game_id;

    [err, game] = await to(Game.findOne({where:{id:game_id}}));
    if(err) return ReE(res, "err game");

    if(!game) return ReE(res, "game not found with id: "+game_id);
    let user, users_array, users;
    user = req.user;
    [err, users] = await to(game.getUsers());

    users_array = users.map(obj=>String(obj.user));

    if(!users_array.includes(String(user._id))) return ReE(res, "User does not have permission to read app with id: "+app_id);

    req.game = game;
    next();
}
module.exports.game = game;