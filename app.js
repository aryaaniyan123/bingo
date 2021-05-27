const express      = require('express');
const logger       = require('morgan');
const bodyParser   = require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');

const config = require('./config/config.js');

const v1    = require('./routes/v1');
const app   = express();

const CONFIG = require('./config/config');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Passport
app.use(passport.initialize());


const models = require("./models");
models.sequelize.authenticate().then(() => {
    console.log('Connected to SQL database:', CONFIG.db_name);
})
.catch(err => {
    console.error('Unable to connect to SQL database:',CONFIG.db_name);
});
if(CONFIG.app==='dev'){
    models.sequelize.sync();
    
}

app.use(cors());

app.use('/v1', v1);

app.use('/', function(req, res){
   res.statusCode = 200;
   res.json({status:"success", data:{}})
});

// catch 404 forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.port, () => {
  console.info(`server started on port ${config.port} (${config.app})`);
});

module.exports = app;


