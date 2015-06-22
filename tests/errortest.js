var PlatformError = require('../utils/platformerror');

new PlatformError("Foi"); //Should not show the 'Voltou' message
console.log("Voltou");