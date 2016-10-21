upnowApp.controller('SiteCtrl',function($scope, $http, $window, $timeout, $uibModal){
	// $scope.sites = [];
	$scope.vm={
		alerts : [],
		add : function(){
			var that = this;
			this.dataLoading = true;

			var alreadyAdded = false;

			angular.forEach($scope.vm.sites, function(site,idx){
				if (site.url == that.site.url){
					alreadyAdded = true;
					return;
				}
			});

			if (alreadyAdded){
				$scope.vm.dataLoading = false;
				$scope.vm.alert({type:'danger',msg:that.site.url+" already added"});
				return;
			}

			$http
				.put('/site/create',this.site)
				.then(
					function(res){
						$scope.vm.dataLoading = false;
						$scope.vm.sites.push(res.data);
						$scope.vm.alert({type:'success',msg:that.site.url+" added"});
						$scope.vm.site = {};
					},
					function(res){
						$scope.vm.dataLoading = false;
						$scope.vm.alert({type:'danger',msg:that.site.url+" is an invalid URL"});
					}
				);
		},
		editSite:function(site){
			var sites = $scope.vm.sites;
			var modal = $uibModal.open(
				{
					templateUrl:'/templates/site/edit.html',
					controller:function($scope, $uibModalInstance){
						$scope.site = site.url;
						$scope.freqSettings = [
							{text:"Every 5 minutes",value:5},
							{text:"Every 10 minutes",value:10},
							{text:"Every 15 minutes",value:15},
							{text:"Every 30 minutes",value:30},
							{text:"Every 45 minutes",value:45},
							{text:"Every hour",value:60},
						];



						$scope.ok = function(){
						
						}
						$scope.cancel = function(){
							$uibModalInstance.dismiss();
						}
					}
				}
			);
		},
		deleteSite:function(site){
			var sites = $scope.vm.sites;
			var modal = $uibModal.open(
				{
					templateUrl:'/templates/site/confirmDeleteSite.html',
					controller:function($scope, $uibModalInstance){
						$scope.site = site.url;

						$scope.ok = function(){
							$scope.deleting = true;
							$http
								.delete('/site/'+site.id)
								.then(function(res){
									angular.forEach(sites,function(s,idx){
										if (s.id == site.id){
											sites.splice(idx,1);
											return;
										}
									});
									$scope.deleting = true;
									$uibModalInstance.close();
								});
							
						}
						$scope.cancel = function(){
							$uibModalInstance.dismiss();
						}
					}
				}
			);


			
			
		},
		loadSites : function(){
			$http
				.get('/site')
				.then(function(res){
					$scope.vm.sites = res.data;
				});
		},
		alert: function(alert){
			$scope.vm.alerts.push(alert);
		},
		closeAlert:function(index){
			$scope.vm.alerts.splice(index,1);
		}
	};

	$scope.vm.loadSites();
});