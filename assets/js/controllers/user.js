upnowApp.controller('LoginCtrl',function($scope, $http){
	$scope.vm={
		login : function(){
			$http.post('/login',{email:this.email, password:this.password})
		},
		signup: function(){
			$http.post('/signup',this.user)	
		}
	};
});