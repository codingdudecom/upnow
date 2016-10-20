var upnowApp = angular.module('upnowApp',['ngRoute','ui.bootstrap']);

upnowApp.config(function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/site/index.html"
  })
  .when("/site/:id", {templateUrl : "/templates/site/detail.html"})
  .otherwise("/");
});