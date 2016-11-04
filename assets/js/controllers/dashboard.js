upnowApp
.controller('DashboardCtrl',function($scope, $http, $window){

	// $scope.labels = ["luni","marti","miercuri"];
	// $scope.data = [[300, 500, 100],[100, 100, 300]];
	// $scope.series = ["site 1","site 2"];

	$scope.labels = [];
	$scope.data = [];
	$scope.series = [];


  $scope.load = function(){
  	$http.get('/siteLog')
	  	.then(function(res){
	  	// 	var siteData = [];
	  	// 	angular.forEach(res.data,function(el,idx){
	  	// 		// if (el.owner.url.indexOf("hotel")<0 && el.owner.url.indexOf("risk")<0){
	  	// 		// 	return;
	  	// 		// }
				// if ($scope.series.indexOf(el.owner.url) < 0){
	  	// 			$scope.series.push(el.owner.url);
	  	// 		}

	  	// 		if (!siteData[el.owner.url]){
	  	// 			siteData[el.owner.url] = [];
	  	// 		}
		  		
	  	// 		siteData[el.owner.url].push(el.responseTime);

	  			
	  	// 		$scope.labels.push(el.createdAt);
	  			
	  	// 	});



	  	// 	Object.keys(siteData).forEach(function(key){
				// $scope.data.push(siteData[key]);
	  	// 	});

	  	// 	console.log($scope.labels);
		  	var minDate = new Date(), maxDate = new Date(0);

	  		function toHour(dt){
	  			return new Date(dt.getFullYear(),dt.getMonth(),dt.getDay(),dt.getHours());
	  		}

	  		angular.forEach(res.data,function(el,idx){

	  			if ($scope.series.indexOf(el.owner.url) < 0){
	  				$scope.series.push(el.owner.url);
	  				$scope.data.push([]);
	  			}
	  			var dt = new Date(el.createdAt);
	  			if ($scope.labels.indexOf(toHour(dt)) < 0){
	  				$scope.labels.push(toHour(dt));
	  			}


	  			// var elDate = new Date(el.createdAt);
	  			// if (elDate.getTime() < minDate.getTime()){
	  			// 	minDate = elDate;
	  			// }

	  			// if (elDate.getTime() > maxDate.getTime()){
	  			// 	maxDate = elDate;
	  			// }
	  		});


			// var crtDate = toHour(minDate);
				  		
	  	});

  }

  // $scope.load();
});