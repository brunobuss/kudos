
function getTimeNow () {
	var today = new Date();

	var dd = today.getUTCDate(),
	    MM = today.getUTCMonth() + 1,
	    yy = today.getUTCFullYear(),
	    hh = today.getUTCHours(),
	    mm = today.getUTCMinutes();

	function pad(n){return n<10 ? '0'+n : n};

	return yy + '-' + pad(MM) + '-' + pad(dd)
			  + 'T' + pad(hh) + ':' + pad(mm);

};

var kudosModule = angular.module('kudos', ['ngResource', 'ui.bootstrap']);

kudosModule.factory('kudo', function($resource) {
	return $resource( 'http://127.0.0.1\\:3000/kudos' );
});

kudosModule.factory('user', function($resource) {
	return $resource( 'http://127.0.0.1\\:3000/users' );
});

function KudosList($scope, kudo) {
	$scope.lastN = 10;
	$scope.kudos = kudo.query();

	$scope.repostKudo = function($index) {

		var newKudo = new kudo({
			person : $scope.kudos[$index].person,
			reason : $scope.kudos[$index].reason,
			date   : getTimeNow()
		});

		newKudo.$save();
		$scope.kudos = kudo.query();
	};

	$scope.refreshKudos = function() {
		$scope.kudos = kudo.query();
	};
}

function KudosSubmit($scope, kudo, user) {
	$scope.users = user.query();

	$scope.addKudo = function() {
		var newKudo = new kudo({
			person : $scope.personName,
			reason : $scope.kudoText,
			date   : getTimeNow()
		});

		newKudo.$save();
		$scope.kudos = kudo.query();

		$scope.personName = '';
		$scope.kudoText = '';
	};
}