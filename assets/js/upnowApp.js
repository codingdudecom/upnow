var upnowApp = angular.module('upnowApp',['ngRoute','ui.bootstrap','chart.js','angular-web-notification']);

upnowApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/templates/dashboard.html"
  })
  .when("/sites", {
    templateUrl : "/templates/site/index.html"
  })
  .when("/profile", {
    templateUrl : "/templates/user/profile.html"
  })  
  .when("/site/:id", {templateUrl : "/templates/site/detail.html"})
  .otherwise("/");
}])


.controller("AppCtrl",['$scope', '$location',function($scope, $location){
	$scope.isActive = function(view){
		return view === $location.path();
	}
}]);