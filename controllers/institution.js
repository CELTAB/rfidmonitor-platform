var Institution = require('../models/institution');
var InstitutionDao = require('../models/institutiondao');

  // REMEMBER TO VALIDATE/SANITIZE THE SQL STRING
  // VALIDATE OBJ

exports.postInstitution = function(req, res) {
  // Create a new instance of the Beer model
  var institution = new Institution();

  // Set the beer properties that came from the POST data
  institution.name = req.body.name;
  institution.image = req.body.type;
  institution.lat = req.body.lat;
  institution.lng = req.body.lng;
  // institution.date = req.body.date;

  var institutionDao = new InstitutionDao();
  institutionDao.insert(institution, function(err, result){
    if(err)
      console.log(err);
    else{
      console.log(result);
      res.json({ message: 'Instituition added: ' + institution.name});
    }
  });
};