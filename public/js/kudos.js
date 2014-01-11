
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

var kudosModule = angular.module('kudos', ['ngRoute', 'ngResource', 'ui.bootstrap']);

kudosModule.config(function($routeProvider) {
    $routeProvider.
    when('/', {
        controller  : 'Kudos',
        templateUrl : 'list.html'
    }).
    when('/user/:id', {
        controller  : 'Kudos',
        templateUrl : 'list.html'
    }).
    otherwise({
        redirectTo: '/'
    });
});

kudosModule.factory('kudo', function($resource) {
    return $resource( 'http://127.0.0.1\\:3000/kudos/:search_string' );
});

kudosModule.factory('user', function($resource) {
    return $resource( 'http://127.0.0.1\\:3000/users' );
});

kudosModule.factory('kudo_up', function($resource) {
    return $resource( 'http://127.0.0.1\\:3000/kudos_up' );
});

kudosModule.controller('Kudos', [ '$scope', '$routeParams', '$location', 'kudo', 'kudo_up', 'user',
    function ($scope, $rtp, $loc, kudo, kudo_up, user) {
        $scope.refreshKudos = function() {
            user.query( {}, function(data, headers){
                $scope.users = data;
            });
            kudo.query( {search_string:$rtp.id}, function(data, headers){
                $scope.kudos = data;

                if ($rtp.id) {
                    $scope.personName = data[0].person;
                };

            });
        };

        $scope.lastN = 10;
        $scope.refreshKudos();

        if ($rtp.id) {
            $scope.user_page = true;
        }

        $scope.addKudo = function() {
            var newKudo = new kudo({
                person : $scope.personName,
                reason : $scope.kudoText,
                date   : getTimeNow()
            });

            newKudo.$save( function(data, headers){
                $scope.refreshKudos();
            });

            $scope.personName = '';
            $scope.kudoText = '';
        };

        $scope.plusKudo = function(kudo_id) {

            var KudoPlus = new kudo_up({
                id : kudo_id
            });

            KudoPlus.$save( function(data, headers){
                $scope.refreshKudos();
            });
        };
}]);
