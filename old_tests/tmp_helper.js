/*
Carro:
	Código RFID;
	Placa;
	Modelo;
	Marca;
	Dono;
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

var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
})

var Task = sequelize.define('Task', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
})

var Foo = sequelize.define('Foo', {
 // instantiating will automatically set the flag to true if not set
 flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},

 // default values for dates => current time
 myDate: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },

 // setting allowNull to false will add NOT NULL to the column, which means an error will be
 // thrown from the DB when the query is executed if the column is null. If you want to check that a value
 // is not null before querying the DB, look at the validations section below.
 title: { type: Sequelize.STRING, allowNull: false},

 // Creating two objects with the same value will throw an error. The unique property can be either a
 // boolean, or a string. If you provide the same string for multiple columns, they will form a
 // composite unique key.
 someUnique: {type: Sequelize.STRING, unique: true},
 uniqueOne: { type: Sequelize.STRING,  unique: 'compositeIndex'},
 uniqueTwo: { type: Sequelize.INTEGER, unique: 'compositeIndex'}

 // Go on reading for further information about primary keys
 identifier: { type: Sequelize.STRING, primaryKey: true},

 // autoIncrement can be used to create auto_incrementing integer columns
 incrementMe: { type: Sequelize.INTEGER, autoIncrement: true },

 // Comments can be specified for each field for MySQL and PG
 hasComment: { type: Sequelize.INTEGER, comment: "I'm a comment!" },

 // You can specify a custom field name via the "field" attribute:
 fieldWithUnderscores: { type: Sequelize.STRING, field: "field_with_underscores" },

 // It is possible to create foreign keys:
 bar_id: {
   type: Sequelize.INTEGER,

   references: {
     // This is a reference to another model
     model: Bar,

     // This is the column name of the referenced model
     key: 'id',

     // This declares when to check the foreign key constraint. PostgreSQL only.
     deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
   }
 }
})

//Prepara mas nao persiste
var project = Project.build({
  title: 'my awesome project',
  description: 'woot woot. this will make me a rich man'
}) 
var task = Task.build({
  title: 'specify the project idea',
  description: 'bla',
  deadline: new Date()
})

var Employee = sequelize.define('Employee', {
  name:  {
    type     : Sequelize.STRING,
    allowNull: false,
    get      : function()  {
      var title = this.getDataValue('title');
      // 'this' allows you to access attributes of the instance
      return this.getDataValue('name') + ' (' + title + ')';
    },
  },
  title: {
    type     : Sequelize.STRING,
    allowNull: false,
    set      : function(val) {
      this.setDataValue('title', val.toUpperCase());
    }
  }
});

Employee
  .create({ name: 'John Doe', title: 'senior engineer' })
  .then(function(employee) {
    console.log(employee.get('name')); // John Doe (SENIOR ENGINEER)
    console.log(employee.get('title')); // SENIOR ENGINEER
  })

  var ValidateMe = sequelize.define('Foo', {
  foo: {
    type: Sequelize.STRING,
    validate: {
      is: ["^[a-z]+$",'i'],     // will only allow letters
      is: /^[a-z]+$/i,          // same as the previous example using real RegExp
      not: ["[a-z]",'i'],       // will not allow letters
      isEmail: true,            // checks for email format (foo@bar.com)
      isUrl: true,              // checks for url format (http://foo.com)
      isIP: true,               // checks for IPv4 (129.89.23.1) or IPv6 format
      isIPv4: true,             // checks for IPv4 (129.89.23.1)
      isIPv6: true,             // checks for IPv6 format
      isAlpha: true,            // will only allow letters
      isAlphanumeric: true      // will only allow alphanumeric characters, so "_abc" will fail
      isNumeric: true           // will only allow numbers
      isInt: true,              // checks for valid integers
      isFloat: true,            // checks for valid floating point numbers
      isDecimal: true,          // checks for any numbers
      isLowercase: true,        // checks for lowercase
      isUppercase: true,        // checks for uppercase
      notNull: true,            // won't allow null
      isNull: true,             // only allows null
      notEmpty: true,           // don't allow empty strings
      equals: 'specific value', // only allow a specific value
      contains: 'foo',          // force specific substrings
      notIn: [['foo', 'bar']],  // check the value is not one of these
      isIn: [['foo', 'bar']],   // check the value is one of these
      notContains: 'bar',       // don't allow specific substrings
      len: [2,10],              // only allow values with length between 2 and 10
      isUUID: 4,                // only allow uuids
      isDate: true,             // only allow date strings
      isAfter: "2011-11-05",    // only allow date strings after a specific date
      isBefore: "2011-11-05",   // only allow date strings before a specific date
      max: 23,                  // only allow values
      min: 23,                  // only allow values >= 23
      isArray: true,            // only allow arrays
      isCreditCard: true,       // check for valid credit card numbers

      // custom validations are also possible:
      isEven: function(value) {
        if(parseInt(value) % 2 != 0) {
          throw new Error('Only even values are allowed!')
        // we also are in the model's context here, so this.otherField
        // would get the value of otherField if it existed
        }
      }
    }
  }
})

var Pub = Sequelize.define('Pub', {
  name: { type: Sequelize.STRING },
  address: { type: Sequelize.STRING },
  latitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -90, max: 90 }
  },
  longitude: {
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: { min: -180, max: 180 }
  },
}, {
  validate: {
    bothCoordsOrNone: function() {
      if ((this.latitude === null) !== (this.longitude === null)) {
        throw new Error('Require either both latitude and longitude or neither')
      }
    }
  }
})

var Bar = sequelize.define('Bar', { /* bla */ }, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,

  // don't delete database entries but set the newly added attribute deletedAt
  // to the current date (when deletion was done). paranoid will only work if
  // timestamps are enabled
  paranoid: true,

  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored: true,

  // disable the modification of tablenames; By default, sequelize will automatically
  // transform all passed model names (first parameter of define) into plural.
  // if you don't want that, set the following
  freezeTableName: true,

  // define the table's name
  tableName: 'my_very_custom_table_name'
})

var testObj_complexFiveDeep = [
    {
        "field" : "One",
        "type" : "ENTITY",
        "unique" : [],
        "structureList" : [
            {
                "field" : "Test",
                "type" : "TEXT",
                "description" : "NOTHING",
                "allowNull" : false
            },
            {
                "field" : "Two",
                "type" : "ENTITY",
                "unique" : [],
                "structureList" : [
                    {
                        "field" : "Test",
                        "type" : "TEXT",
                        "description" : "NOTHING",
                        "allowNull" : false
                    },
                    {
                        "field" : "Three",
                        "type" : "ENTITY",
                        "unique" : [],
                        "structureList" : [
                            {
                                "field" : "Test",
                                "type" : "TEXT",
                                "description" : "NOTHING",
                                "allowNull" : false
                            },
                            {
                                "field" : "Four",
                                "type" : "ENTITY",
                                "unique" : [],
                                "structureList" : [
                                    {
                                        "field" : "Test",
                                        "type" : "TEXT",
                                        "description" : "NOTHING",
                                        "allowNull" : false
                                    },
                                    {
                                        "field" : "Five",
                                        "type" : "ENTITY",
                                        "unique" : [],
                                        "structureList" : [
                                            {
                                                "field" : "Test",
                                                "type" : "TEXT",
                                                "description" : "NOTHING",
                                                "allowNull" : false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

var testObj_complexValidObject = [
    {
        "field" : "Peixes Marcados",
        "type" : "ENTITY",
        "description" : "São os carros que trafegam no parque",
        "unique" : [
            ["Código RFID" ,"Espécie"]
        ],
        "structureList" : [
            {
                "field" : "Código RFID",
                "type" : "RFIDCODE",
                "description" : "teste",
                "allowNull" : false
            },
            {
                "field" : "Espécie",
                "type" : "ENTITY",
                "description" : "Alguma descrição sobre os Especies.",
                "unique" : [],
                "structureList" : [
                    {
                        "field" : "Nome",
                        "type" : "TEXT",
                        "description" : "",
                        "allowNull" : false
                    },
                    {
                        "field" : "Foto",
                        "type" : "IMAGE",
                        "description" : "",
                        "allowNull" : false
                    }
                ]
            },
            {
                "field" : "Instituição",
                "type" : "TEXT",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Local de Captura",
                "type" : "TEXT",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Local de Soltura",
                "type" : "TEXT",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Comprimento total do peixe",
                "type" : "NUMBER",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Data de Captura",
                "type" : "DATETIME",
                "description" : "",
                "allowNull" : false
            }
        ]
    },
    {
        "field" : "Carros",
        "type" : "ENTITY",
        "unique" : [],
        "structureList" : [
            {
                "field" : "Código RFID",
                "type" : "RFIDCODE",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Ano de Fabricação",
                "type" : "DATETIME",
                "description" : "",
                "allowNull" : false
            },
            {
                "field" : "Motorista",
                "type" : "ENTITY",
                "unique" : [],
                "structureList" : [
                    {
                        "field" : "Nome Completo",
                        "type" : "TEXT",
                        "description" : "",
                        "allowNull" : false
                    },
                    {
                        "field" : "Idade",
                        "type" : "NUMBER",
                        "description" : "",
                        "allowNull" : false
                    }
                ]
            }
        ]
    }
]




[
  {
    "field" : "Carro",
    "type" : "ENTITY",
    "structureList" : [
      {
        "field" : "teste",
        "type" : "TEXT",
        "allowNull" : true
      }
    ] 
  },
  {
    "field" : "Carro2",
    "type" : "ENTITY",
    "structureList" : [
      {
        "field" : "teste",
        "type" : "TEXT",
        "allowNull" : true
      }
    ] 
  }
]


[
  {
    "field" : "Carro",
    "type" : "ENTITY",
    "structureList" : [
      {
        "field" : "teste",
        "type" : "TEXT",
        "allowNull" : true
      },
      {
        "field" : "teste2",
        "type" : "TEXT",
        "allowNull" : false
      }
    ] 
  }
]