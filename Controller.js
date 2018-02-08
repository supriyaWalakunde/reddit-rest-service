/**
 * Created by Supriya Walakunde on 07-02-2018.
 */

// create the module and name it app
var app = angular.module('mainapp', ['ngRoute']);

// configure our routes
app.config(function($routeProvider) {
    $routeProvider
        // route for the Display Post page
        .when('/', {
            templateUrl : 'View/DisplayPost.html',
            controller  : 'DisplayPostCtrl'
        })
        // route for the Display comments page
        .when('/comments', {
            templateUrl : 'View/DisplayComments.html',
            controller  : 'CommentController'
        })
});

app.controller("DisplayPostCtrl",function($scope,$http,$rootScope){
    //Get a data object from json
    $http({
        method:"GET",
        url : "https://www.reddit.com/.json"
    }).then( function mySuccess(response){
        $scope.PostData = response.data.data.children;
    },function myError(response){
        $scope.ErrorMsg = response.statusText;
        console.log($scope.ErrorMsg);
    });

    $scope.setCommentURL = function(commentUrl){
        PostDeatilUrl="https://www.reddit.com"+commentUrl+".json";
        $rootScope.commentUrl=PostDeatilUrl;
    };
});

//This method will get the details of Post and Comments for a given url

app.controller('CommentController', function($scope,$http,$rootScope) {
     $scope.expanded=true;
    console.log($rootScope.commentUrl);
    var url=$rootScope.commentUrl;
    $http.get(url).then( function mySuccess(response) {
        $scope.PostInfo=response.data[0].data.children[0].data;
        $scope.Commemnts = response.data[1].data.children;
    },function myError(response){
        $scope.ErrorMsg = response.statusText;
        console.log($scope.ErrorMsg);
    });

});


//To Fix broken image on page (If image not fund they replace with default image)
app.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

angular.module('mainapp').filter('escape', function () {
    var entityMap = {
        // "&amp;": "&",
        "&lt;" : "<",
        "&gt;" : ">",
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;':"/"
    };
    return function(str) {
        return String(str).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
});
