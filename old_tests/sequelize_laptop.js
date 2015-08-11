/*
Carro:
	Código RFID;
	Placa;
	Modelo;
	Marca;
	Motorista;
		Nome;
		Idade;

Peixes Marcados;
	Código RFID;
	Nome;
	Espécie;
		Foto;
	Coordenadas;

Peixes Encontrados;
	Código RFID;
	Peixes Marcados;
	Data em que foi encontrado;

*/

var Sequelize = require('sequelize');

var connectionString = 'postgres://rfidplatform:rfidplatform@localhost:5432/rfidplatform';

var sequelize = new Sequelize(connectionString);

var Carro = sequelize.define('Carro',{
	"Código RFID": Sequelize.STRING,
	"Placa" : Sequelize. STRING
});

var Dono = sequelize.define('Dono', {
	"Nome" : Sequelize.STRING,
	"Idade" : Sequelize.INTEGER
});


// Dono.hasOne(Carro);
Carro.belongsTo(Dono, {
	foreignKey : {
		allowNull : false
	}
});


sequelize.sync({force: true}).then(function(){
	
	var d1 = Dono.create({"Nome" : "Oi", "Idade" : 12}).then(function(dono){
		var c1 = Carro.build({"Código RFID" : "123"});
		c1.setDono(dono).then(function(carro){
			console.log("Deuuuuuuuuuuuuuuuuuuuuuuuuuuu");
		});
	});	
});

