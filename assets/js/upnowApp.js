var upnowApp = angular.module('upnowApp',['ngRoute']);

upnowApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/site/index.html"
  })
  .when("/site/:id", {templateUrl : "/templates/site/detail.html"})
  .otherwise("/");
});