(function () {
  angular.module('Plugins').config(function ($stateProvider) {
    $stateProvider.state('plugins.dataplicity', {
      templateUrl: '/plugins/dataplicity-plugin/views/admin/admin.html',
      controller: 'DataplicityCtrl',
      url: '/dataplicity-plugin',
      title: 'Dataplicity Plugin',
      sidebarMeta: {
        order: 15,
        icon: "fa fa-laptop",
        text: "Dataplicity Plugin",
        href: "plugins.dataplicity"
      }
    })
  })
})()