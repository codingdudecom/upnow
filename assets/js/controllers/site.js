upnowApp.controller('SiteCtrl',function($scope, $http, $window){
	// $scope.sites = [];
	$scope.vm={
		add : function(){
			this.dataLoading = true;
			$http
				.put('/site/create',this.site)
				.then(function(res){
					// alert(JSON.stringify(res));
					$scope.vm.dataLoading = false;
					console.log(res.data);
					$scope.vm.sites.push(res.data);
				});
		},
		deleteSite:function(site){
			$http
				.delete('site/'+site.id)
				.then(function(res){
					var idx = $scope.vm.sites.indexOf(res.data);
					$scope.vm.sites.splice(idx,1);
				});
		},
		loadSites : function(){
			$http
				.get('/site')
				.then(function(res){
					$scope.vm.sites = res.data;
				});
		}
	};

	$scope.vm.loadSites();
});