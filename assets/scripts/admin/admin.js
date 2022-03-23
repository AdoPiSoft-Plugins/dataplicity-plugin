
angular.module('Plugins')
  .controller('DataplicityCtrl', function ($scope, $http, SettingsSavedToastr, CatchHttpError, toastr) {
    $scope.config = {}

    $scope.load = () => {
      $http.get('/api/config').then(res => {
        $scope.config = res.data
        $scope.old_config = angular.copy(res.data)
      }).catch(CatchHttpError)
    }

    $scope.addDevice = (data) => {
      $scope.loading = true
      $http.post('/api/auth', data).then((res) => {
        $scope.loading = false

        if (res.data.error) {
          return toastr.error(res.data.error)
        }

        toastr.success('Device Successfully added to ' + $scope.config.email + ' account.')
        $scope.load()
      })
        .catch((e) => {
          CatchHttpError(e)
          $scope.loading = false
        })
    }

    $scope.register = (email) => {
      $scope.loading = true
      $http.post('/api/register', {email})
        .then(() => {
          toastr.success('Successfully registered. Check your email to verify your account.', {fadeAway: 2000 })
          $scope.load()
          $scope.loading = false
          $scope.is_register = false
        })
        .catch((e) => {
          $scope.loading = false
          CatchHttpError(e)
        })
    }

    $scope.updateSettings = (dt) => {
      $http.post('/api/enable-dataplicity', {enable_dataplicity: dt})
        .then(() => {
          SettingsSavedToastr()
          $scope.load()
        })
        .catch(CatchHttpError)
    }

    $scope.load()
  })
