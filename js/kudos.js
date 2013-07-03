var kudoList = [
		{
			person : 'Bruno Buss',
			reason : 'You\'re nice too =P',
			date   : '03/07/2013'
		},
		{
			person : 'Garu',
			reason : 'Great deploy!',
			date   : '02/07/2013'
		},
		{
			person : 'Vinicius Japa',
			reason : 'Awesome bug fix!',
			date   : '01/06/2013'
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