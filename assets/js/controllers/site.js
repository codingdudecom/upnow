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
						$scope.alertEmails = angular.copy(site.alertEmails) || [];
						$scope.checkInterval = site.checkInterval;

						$scope.freqSettings = [
							{text:"Every 5 minutes",value:5},
							{text:"Every 10 minutes",value:10},
							{text:"Every 15 minutes",value:15},
							{text:"Every 30 minutes",value:30},
							{text:"Every 45 minutes",value:45},
							{text:"Every hour",value:60},
						];

						angular.forEach($scope.freqSettings,function(el){
							if (el.value == $scope.checkInterval){
								$scope.freq = el;
								return;
							}
						});
						$scope.addEmail = function(){
							if ($scope.alertEmails.indexOf($scope.email) < 0){
								$scope.alertEmails.push($scope.email);
							}
						}
						$scope.deleteAlertEmail = function(alertEmail){
							if (confirm("Remove "+alertEmail+" from the alert list?")){
								var idx = $scope.alertEmails.indexOf(alertEmail);
								if (idx >= 0){
									$scope.alertEmails.splice(idx,1);
								}
							}
						}
						$scope.ok = function(){
							site.alertEmails = $scope.alertEmails;
							site.checkInterval = $scope.freq.value;
							$scope.saving = true;
							$http
								.post('/site/'+site.id,site)
								.then(
									function(res){
										$scope.saving = false;
										
									},
									function(res){
										$scope.saving = false;
										
									}
								);
						}
						$scope.cancel = function(){
							$uibModalInstance.dismiss();
							console.log(site);
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