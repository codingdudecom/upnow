upnowApp.controller('HomeCtrl',function($scope, $http, $window){
	$scope.sites = [];
	$scope.vm={
		check : function(){
			this.dataLoading = true;
			$http
				.get('/checkStatus/'+encodeURIComponent(this.site))
				.then(function(res){
					
					$scope.vm.dataLoading = false;
					$scope.sites.push(
						{
							url:$scope.vm.site,
							statusCode:res.data.statusCode,
							statusMessage:res.data.statusMessage,
							responseTime:res.data.responseTime

						}
					)
				});
		}
	};
});