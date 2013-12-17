
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

kudosModule.factory('kudo_up', function($resource) {
	return $resource( 'http://127.0.0.1\\:3000/kudos_up' );
});

function Kudos($scope, kudo, kudo_up, user) {
	$scope.lastN = 10;
	$scope.users = user.query();
	$scope.kudos = kudo.query();

	$scope.addKudo = function() {
		var newKudo = new kudo({
			person : $scope.personName,
			reason : $scope.kudoText,
			date   : getTimeNow()
		});

		newKudo.$save();

		$scope.users = user.query();
		$scope.kudos = kudo.query();

		$scope.personName = '';
		$scope.kudoText = '';
	};

	$scope.plusKudo = function(kudo_id) {

		var KudoPlus = new kudo_up({
			id : kudo_id
		});

		KudoPlus.$save();
		$scope.users = user.query();
		$scope.kudos = kudo.query();
	};

	$scope.refreshKudos = function() {
		$scope.users = user.query();
		$scope.kudos = kudo.query();
	};
}
