global.__base = __dirname + './../server/';
var sequelize = require(__base + 'controller/database/platformsequelize');

sequelize.query("select now() from tb_plat_user limit 1", { type: sequelize.QueryTypes.SELECT})
  .then(function(users) {
    process.exit(0);
  }).catch(function(err){
    console.log(err);
    process.exit(1);
  })
