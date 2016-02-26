'use strict';
var customRoute = function(method, route, handler, middler){
  this.route = route;
  this.method = method;
  this.handler = handler;
  if(middler)
    this.middler = middler;
};

module.exports = customRoute;
