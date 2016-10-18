var upnowApp = angular.module('upnowApp',['ngRoute']);

upnowApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "templates/site/index.html"
  })
});