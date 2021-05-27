const { Game } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const create = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let err, game;
    let user = req.user;

    let game_info = req.body;


    [err, game] = await to(Game.create(game_info));
    if(err) return ReE(res, err, 422);

    game.addUser(user, { through: { status: 'started' }})

    [err, game] = await to(game.save());
    if(err) return ReE(res, err, 422);

    let game_json = game.toWeb();
    game_json.users = [{user:user.id}];

    return ReS(res,{game:game_json}, 201);
}
module.exports.create = create;



const getAll = async function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let user = req.user;
    let err, games;

    [err, games] = await to(user.getGames());

    let games_json =[]
    for( let i in games){
        let game = games[i];
        let users =  await game.getUsers()
        let game_info = game.toWeb();
        let users_info = []
        for (let i in users){
            let user = users[i];
            // let user_info = user.toJSON();
            users_info.push({user:user.id});
        }
        game_info.users = users_info;
        games_json.push(game_info);
    }

    return ReS(res, {games:games_json});
}
module.exports.getAll = getAll;


const get = function(req, res){
    res.setHeader('Content-Type', 'application/json');
    let game = req.game;

    return ReS(res, {game:game.toWeb()});
}
module.exports.get = get;



const update = async function(req, res){
    let err, game, data;
    game = req.game;
    data = req.body;
    game.set(data);

    [err, game] = await to(game.save());
    if(err){
        return ReE(res, err);
    }
    return ReS(res, {game:game.toWeb()});
}
module.exports.update = update;



const remove = async function(req, res){
    let game, err;
    game = req.game;

    [err, game] = await to(game.destroy());
    if(err) return ReE(res, 'error occured trying to delete the game');

    return ReS(res, {message:'Deleted game'}, 204);
}
module.exports.remove = remove;