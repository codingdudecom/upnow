upnowApp.controller('LoginCtrl',function($scope, $http, $window){
	$scope.vm={
		login : function(){
			$http
				.post('/login',{email:this.email, password:this.password})
				.then(function(res){
					$window.location.href = res.headers("Location");
				});
		},
		signup: function(){
			$http.post('/signup',this.user);
		}
	};
});