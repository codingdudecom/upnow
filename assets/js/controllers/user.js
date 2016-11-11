upnowApp.controller('LoginCtrl',['$scope', '$http', '$window',function($scope, $http, $window){
	$scope.vm={
		login : function(){
			$http
				.post('/login',{email:this.email, password:this.password})
				.then(function(res){
					$window.location.href = res.headers("Location");
				},
					function(res){
						$scope.vm.error = res.data;
					}
				);
		},
		signup: function(){
			$http
				.post('/signup',this.user)
				.then(function(res){
					$window.location.href = res.headers("Location");
				},
				function(res){
					$scope.vm.error = res.data.message;
				});
		}
	};
}])

.controller('ProfileCtrl',['$scope','$http','$window',function($scope,$http,$window){
	$scope.vm = {};
	$scope.load = function(){
		$http
			.get('/me')
			.then(
				function(res){
					delete res.data.password;
					$scope.vm.user = res.data;
				}
			);
	};
	$scope.save = function(){
		$http
			.post('/me',$scope.vm.user)
			.then(
				function(res){
					$window.location.reload();
				}
			);
	};


	$scope.load();
}]);