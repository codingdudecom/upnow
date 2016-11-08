upnowApp
.controller('DashboardCtrl',['$scope', '$http', '$window', '$location', '$filter',function($scope, $http, $window, $location, $filter){


	$scope.labels = [];
	$scope.data = [];
	$scope.series = [];

	$scope.datasetOverride = [];

	
	var chartOptions =
		{
			lineTension: 0.1,
			fill:false,
			borderWidth:2,
			pointRadius:4,
			pointHoverRadius:4,
			pointHoverBorderWidth:0,
			pointStyle:'rect'
		};

	$scope.options = {
        responsive:true,
        maintainAspectRatio:false,
        legend:{
        	display:true
        },
		scales:{
			xAxes:[
				{	
					type:'time',
					time: {
	                    displayFormats: {
	                        hour: 'hA'
	                    }
	                },
	                ticks:{
	                	maxRotation:0,
	                	maxTicksLimit:5
	                }
            	}
			],
			yAxes:[
				{
					scaleLabel:{
						labelString:'Avg response time (ms)',
						display:true
					},
					ticks:{
						callback:function(value){
							return value/1000 + " s";
						}
					}			
				}
			]
		}        

	};

	$scope.pieOptions = {
		cutoutPercentage:80,
		circumference:4 * Math.PI/3,
		rotation: -Math.PI/2 - 2 * Math.PI/3,
		tooltips:{
			callbacks:{
				label:function(tooltipItem,data){

					return "Up Time: "
					 +(100 * data.datasets[0].data[0] / (data.datasets[0].data[0] + data.datasets[0].data[1])).toFixed(4)+"%"
					;
				}
			}
		}
	}

	$scope.sites = [];
	$scope.siteUpCount = 0;
	$scope.siteDownCount = 0;


	var last24h = new Date();
	last24h = new Date(last24h.getTime() - 24 * 3600 * 1000);

	$scope.uptimes = {};
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

	  		var groupFn = toHour;

	  		

	  		angular.forEach(res.data,function(el,idx){

	  			if (new Date(el.createdAt).getTime() < last24h.getTime()){
		  			return;
		  		}

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
				if (timeIndex > 0){
					if ($scope.data[siteIndex][timeIndex] ){
			  			$scope.data[siteIndex][timeIndex] = Math.round(($scope.data[siteIndex][timeIndex] + el.responseTime)/2);
			  		} else {
			  			$scope.data[siteIndex][timeIndex] = el.responseTime;
			  		}
			  	}
			});

			angular.forEach($scope.labels,function(el,idx){
				$scope.labels[idx] = $filter('date')(new Date(el), 'short');
			});

	  		angular.forEach(res.data,function(el){
	  			if (!$scope.uptimes[el.owner.url]){
	  				$scope.uptimes[el.owner.url] = {
	  					data:[0,0],
	  					labels:["Up","Down"]
	  				};
	  			}
				
				var downTime = el.checkInterval;
	  			if (el.statusCode != 200){
	  				//DOWN
	  				$scope.uptimes[el.owner.url].data[1] += downTime;
	  			} else {
	  				//UP
					$scope.uptimes[el.owner.url].data[0] += downTime;
					$scope.uptimes[el.owner.url].value = 100 * $scope.uptimes[el.owner.url].data[0] / ($scope.uptimes[el.owner.url].data[0] + $scope.uptimes[el.owner.url].data[1]);
	  			}
	  		});

	  		$scope.siteLogLoaded = true;

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

	  		$scope.siteLoaded = true;
	  	});

	
	
  }

  $scope.load();
}])

.filter('percent',function(){
	return function(input, decimals){
		var integerPart = Math.floor(input);
		var decimalPart = (input - integerPart).toFixed(decimals);
		return "<span class='integerPart'>"+integerPart+"</span><span class='decimalPart'>."+decimalPart+"</span>";
	};
})
.directive('asPercent', function() {
  return {
    restrict: 'AE',
    template:"<span class='integerPart'>{{integerPart}}</span><span class='decimalPart'>.{{decimalPart}}%</span>",
    link: function (scope, el, attrs) {
    	var input = attrs.number;
		scope.integerPart = Math.floor(input);
		scope.decimalPart = (""+(input - scope.integerPart).toFixed(4)).split(".")[1];
    }
  };
})
;