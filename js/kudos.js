var kudoList = [
		{
			person : 'Bruno Buss',
			reason : 'You\'re nice too =P',
			date   : '2013-07-03T16:30'
		},
		{
			person : 'Garu',
			reason : 'Great deploy!',
			date   : '2013-07-01T09:54'
		},
		{
			person : 'Vinicius Japa',
			reason : 'Awesome bug fix!',
			date   : '2013-06-03T15:33'
		},
	];

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

angular.module('kudos', ['ui.bootstrap']);

function KudosList($scope) {
	$scope.kudos = kudoList;

	$scope.repostKudo = function($index) {
		var newKudo = {
			person : $scope.kudos[$index].person,
			reason : $scope.kudos[$index].reason,
			date   : getTimeNow()
		};

		kudoList.unshift( newKudo );
	};
}

function KudosSubmit($scope) {
	$scope.users = [ 'Bruno Buss', 'Garu', 'Vinicius Japa' ];

	$scope.addKudo = function() {
		var newKudo = {
			person : $scope.personName,
			reason : $scope.kudoText,
			date   : getTimeNow()
		};
		kudoList.unshift( newKudo );

		$scope.personName = '';
		$scope.kudoText = '';
	};
}