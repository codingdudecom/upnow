upnowApp
.controller('DashboardCtrl',function($scope, $http, $window, $location, $filter){

	// $scope.labels = ["luni","marti","miercuri"];
	// $scope.data = [[300, 500, 100],[100, 100, 300]];
	// $scope.series = ["site 1","site 2"];

	$scope.labels = [];
	$scope.data = [];
	$scope.series = [];

	$scope.datasetOverride = [];
	var chartOptions =
		{
			lineTension: 0.1,
			fill:false
		};

	$scope.sites = [];
	$scope.siteUpCount = 0;
	$scope.siteDownCount = 0;

  $scope.load = function(){
  	$http.get('/siteLog')
	  	.then(function(res){
		  	var minDate = new Date(), maxDate = new Date(0);

	  		function toHour(dt){
	  			return new Date(dt.getFullYear(),dt.getMonth(),dt.getDay(),dt.getHours());
	  		}

	  		function toMin(dt){
	  			return new Date(dt.getFullYear(),dt.getMonth(),dt.getDay(),dt.getHours(),dt.getMinutes());
	  		}

	  		var groupFn = toMin;

	  		angular.forEach(res.data,function(el,idx){

	  			if ($scope.series.indexOf(el.owner.url) < 0){
	  				$scope.series.push(el.owner.url);
	  				$scope.data.push([]);
	  				$scope.datasetOverride.push(chartOptions);
	  			}
	  			var dt = new Date(el.createdAt);
	  			if ($scope.labels.indexOf(groupFn(dt).getTime()) < 0){
	  				$scope.labels.push(groupFn(dt).getTime());

	  			}
	  		});

			angular.forEach(res.data,function(el,idx){
	  				angular.forEach(
	  					$scope.data,
	  					function(data){
	  						data.push(0);
	  					}
	  				);
			});

			angular.forEach(res.data,function(el){
				var dt = new Date(el.createdAt);
				var siteIndex = $scope.series.indexOf(el.owner.url);

				var timeIndex = $scope.labels.indexOf(groupFn(dt).getTime());

				if ($scope.data[siteIndex][timeIndex] ){
		  			$scope.data[siteIndex][timeIndex] = ($scope.data[siteIndex][timeIndex] + el.responseTime)/2;
		  		} else {
		  			$scope.data[siteIndex][timeIndex] = el.responseTime;
		  		}
			});

			angular.forEach($scope.labels,function(el,idx){
				$scope.labels[idx] = $filter('date')(new Date(el), 'short');
			});

				  		
	  	});

	$http.get('/site')
	  	.then(function(res){
	  		$scope.sites = res.data;
	  		if ($scope.sites.length == 0){
	  			$location.path('/sites');
	  			return;
	  		}

	  		angular.forEach($scope.sites,function(el,idx){

	  			if (el.lastStatusCode!=200){
	  				$scope.siteDownCount++;
	  			} else {
					$scope.siteUpCount++;
	  			}
	  		});
	  	});
  }

  $scope.load();
});