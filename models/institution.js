

var Institution = function(){

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof Institution)) {
        console.warn('Warning: Institution constructor called without "new" operator');
    }

    this.id = 0;
	this.name = '';
	this.image = '';
	this.lat = '';
	this.lng = '';
	this.date = new Date()

 	//this.id = {
	// 	value : 0,
	// 	dbname: 'ID'
	// };
	// this.name = {
	// 	value : 'teste',
	// 	dbname: 'NAME'
	// };
	// this.image = {
	// 	value : '',
	// 	dbname: 'IMAGE'
	// };
	// this.lat = {
	// 	value : '',
	// 	dbname: 'LAT'
	// };
	// this.lng = {
	// 	value : '',
	// 	dbname: 'LNG'
	// };
	// this.date = {
	// 	value : new Date(),
	// 	dbname: 'DATE'
	// };
}


module.exports = Institution;