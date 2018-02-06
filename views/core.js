var doorBuzz = angular.module('doorBuzz', []);

doorBuzz.controller('mainController', ($scope, $http) => {
  
  var updateSensors = () => {
    $http.get('/api/sensors').then( data => {
      $scope.sensors = data.data;
      console.log(data);
    })
  }

  var socket = io();
  
  socket.on('data updated', () => {
    console.log('Socket: data updated');
    updateSensors();
  });
  
  updateSensors();
  //$scope.$on('newSensor', updateSensors());
  $scope.evaluateStyle = mounted => {
    if(mounted){
      return {
        "color": "green"
      }
    } else {
      return {
        "color": "red"
      }
    }
  };

  $scope.toggleMount = (name, mount) => {
    $http.post('/api/toggle_mount', {name: name, mount: mount}).then(updateSensors());
  };
});

doorBuzz.controller('formController', ($scope, $http) => {
  $scope.sensorName = "";
  $scope.sendNewSensor = () => {
    $http.post('/api/register', {topicName: $scope.sensorName}).then( data => {
      $scope.$emit('newSensor');
    })
  }
})