angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $http, $ionicModal, $timeout,$window,$ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};
  $scope.signupData = {};
  $scope.signUpForm = false;
  $scope.formErr = [];
  $scope.currentCreatedFolder = {};
  $scope.apiDomain = 'http://dev.fileshare';

  $scope.folders = {};

  $scope.notificationMessage = '';

  $scope.auth = JSON.parse($window.localStorage.getItem('user'));
  if($scope.auth)
      $window.location.href = '/#/app/dashboard';

  $scope.getFolders = function(){
    $http({
      method: 'GET',
      url: $scope.apiDomain+'/user/folders/'+$scope.auth.id,
    }).then(function successCallback(response) {
          console.log(response);
          $scope.folders = response.data;
      }, function errorCallback(response) {
        $scope.notificationMessage = 'Something went wrong fetching folder lists.';
        $scope.toaster($scope.notificationMessage);
      });
  }
  //This is used for check user is logged or not;
  $scope.checkAuth =  function(){
      if($window.localStorage.getItem('user'))
        return true;

    return false;
  }

  //User Logout
  $scope.logout = function(){
    $window.localStorage.removeItem('user');
    $window.location.href = '/';
  }

  //Notification
  $scope.toaster = function(message){
    $ionicLoading.show({ template:message, noBackdrop: true, duration: 2000 });
  };

  $scope.signUpFormStatus = function(status){
      $scope.signUpForm = status;
  }

  $scope.doSignup = function(){

      $http({
        method: 'POST',
        url: $scope.apiDomain+'/user',
        data:$scope.signupData
      }).then(function successCallback(response) {
          console.log(response);
          $scope.signUpForm = false;
          $scope.notificationMessage = 'You have successfully register.';
          $scope.toaster($scope.notificationMessage);
        }, function errorCallback(response) {
            $scope.serverFormVal('signupF',response);
        });
  }

  $scope.serverFormVal = function(form,serverResponse){
        serverResponse  = serverResponse.data.errors
        $scope.formErr = {};
        for (var fieldName in serverResponse) {
            if (serverResponse.hasOwnProperty(fieldName)) {
              var temp = {};
              temp[fieldName] = true;
              temp['serverMessage'] = serverResponse[fieldName][0];
              $scope.formErr[fieldName] = temp;
            }
        }
  }

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log($scope.loginData);
      $http({
        method: 'POST',
        url: $scope.apiDomain+'/login',
        data:$scope.loginData
      }).then(function successCallback(response) {
          $scope.notificationMessage = 'You are logged successfully.';
          $scope.toaster($scope.notificationMessage);
          $window.localStorage.setItem('user',JSON.stringify(response.data.user));
          $scope.closeLogin();
          $window.location.href = '/#/app/dashboard';
        }, function errorCallback(response) {
            $scope.serverFormVal('loginF',response);
            $scope.notificationMessage = 'Wrong credential provided.';
            $scope.toaster($scope.notificationMessage);
        });
  };
})

.controller('DashboardCtrl',function($scope){

})

.controller('CreateCtrl',function($scope,$http,$window){
  console.log($scope.auth);
  $scope.setFilePassword = false;
  $scope.createfileData = {};
  $scope.createfolderData = {};
  $scope.createfolderData['user_id'] = $scope.auth.id;
  $scope.createfileData['user_id'] = $scope.auth.id;
  console.log($scope.createfolderData);
  $scope.createFolderFormStatus = false;
  $scope.createFileFormStatus = true;

  $scope.openCreateFolderForm = function(){
    $scope.createFolderFormStatus = true;
    $scope.createFileFormStatus = false;
  }

  $scope.openCreateFileForm = function(){
      $scope.getFolders();
      $scope.createFileFormStatus = true;
      $scope.createFolderFormStatus = false;
  }

  $scope.showPasswordInput = function(_this){
      $scope.setFilePassword = _this;
  }

  $scope.createFile = function(){
    $http({
      method: 'POST',
      url: $scope.apiDomain+'/file',
      data:$scope.createfileData
    }).then(function successCallback(response) {
        $scope.notificationMessage = 'File created successfully.';
        $scope.toaster($scope.notificationMessage);
        $scope.currentCreatedFolder = response;
      }, function errorCallback(response) {
          $scope.serverFormVal('createFileForm',response);
      });
  }

  $scope.createFolder = function(){
    $http({
      method: 'POST',
      url: $scope.apiDomain+'/folder',
      data:$scope.createfolderData
    }).then(function successCallback(response) {
        $scope.notificationMessage = 'Folder created successfully.';
        $scope.toaster($scope.notificationMessage);
        $scope.currentCreatedFolder = response;
      }, function errorCallback(response) {
          $scope.serverFormVal('createFileForm',response);
      });
  }


})

.controller('PlaylistsCtrl', function($scope,$window) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
  if($window.localStorage.getItem('user')){
    $window.location.href = '/#/app/dashboard';
  }
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
});
