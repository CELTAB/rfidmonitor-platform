var PlatformError = require('../utils/platformerror');

throw new PlatformError("Foi"); //Should not show the 'Voltou' message
console.log("Voltou");