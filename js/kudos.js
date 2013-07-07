var kudoList = [
		{
			person : 'Bruno Buss',
			reason : 'You\'re nice too =P',
			date   : '2013-07-10T16:30'
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

angular.module('kudos', ['ui.bootstrap']);

function KudosList($scope) {
	$scope.kudos = kudoList;
}

function KudosSubmit($scope) {
	$scope.users = [ 'Bruno Buss', 'Garu', 'Vinicius Japa' ];

	$scope.addKudo = function() {
		kudoList.unshift( { person : $scope.personName, reason : $scope.kudoText, date : 'just now' } );
		$scope.personName = '';
		$scope.kudoText = '';
	};
}