upnowApp.controller('DashboardCtrl',function($scope, $http, $window){

  $scope.labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  $scope.data = [300, 500, 100];


	$scope.sites = [];
	$scope.vm={
		// check : function(){
		// 	this.dataLoading = true;
		// 	$http
		// 		.get('/site')
		// 		.then(function(res){
		// 			$scope.vm.sites = res.data;
		// 		});
		// }
	};
});