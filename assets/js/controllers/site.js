upnowApp.controller('SiteCtrl',function($scope, $http, $window){
	// $scope.sites = [];
	$scope.vm={
		add : function(){
			this.dataLoading = true;
			$http
				.put('/site/create',this.site)
				.then(function(res){
					$scope.vm.dataLoading = false;
					console.log(res.data);
					$scope.vm.sites.push(res.data);
				});
		},
		deleteSite:function(site){
			$http
				.delete('/site/'+site.id)
				.then(function(res){
					angular.forEach($scope.vm.sites,function(s,idx){
						if (s.id == site.id){
							$scope.vm.sites.splice(idx,1);
							return;
						}
					});
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