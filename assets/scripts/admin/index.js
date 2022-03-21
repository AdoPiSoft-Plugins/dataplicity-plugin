(function () {
  angular.module('Plugins').config(function ($stateProvider) {
    $stateProvider.state('plugins.dataplicity', {
      templateUrl: '/plugins/dataplicity-plugin/views/admin/admin.html',
      controller: 'DataplicityCtrl',
      url: '/dataplicity-plugin',
      title: 'Dataplicity Plugin'
    })
  })
})()
