var app = angular.module("gameOfLife", []);
app.controller("myCtrl", function($scope) {
    var self = this;
    self.gridData = Array(10000).fill(0).map(function(i){
      return 0;
    });
    self.running = false;
    self.fps = '';
    self.steps = '';
    self.avgFps = '';
    var posistions = [-101,-100,-99,-1,1,99,100,101];
    self.steps = 0;

    self.clickCell = function(age, index) {
      console.log(age);
      self.gridData[index] = age?0:1;
    };

    self.step = function(){
      var oldData = self.gridData.slice();
      for(var i = 0,len = self.gridData.length;i < len;i++){
        var alive = checkLife(i,oldData);
        if(oldData[i]){
          if(alive){
            if(oldData[i] < 4){
              var age = oldData[i] + 1;
              self.gridData[i] = age;
            }
          }else{
            self.gridData[i] = 0;
          }
        }else{
          if(alive){
            self.gridData[i] = 1;
          }
        }
      }
      ++self.steps;
      setTimeout(function(){
        $scope.$apply();
      },0);
    };

    function checkLife(index,data){
      var neighbors = 0;
      for(var j = 0, lenj = posistions.length; j < lenj; j++){
        if(data[index + posistions[j]]){
          neighbors++;
          if(neighbors === 4){
            j = lenj;
          }
        }
      }
      switch(neighbors){
        case 2:
          return data[index];
        case 3:
          return 1;
        default:
          return 0;
      }
    }

    self.run = function(){
      self.running = true;
      var frames = 0;
      var totalFrames = 0;
      var timeStart = new Date().getTime();

      var fpsCounter = setInterval(function(){
        totalFrames += frames;
        self.fps = frames;
        var timeNow = new Date().getTime();
        self.avgFps = (totalFrames/((timeNow - timeStart)/1000)).toFixed(2);
        frames = 0;
        if(!self.running){
          clearInterval(fpsCounter);
        }
      },1000);
      function frame(){
        if(self.running){
          frames++;
          self.step();
          setTimeout(function(){
            frame();
          },0);
        }
      }
      frame();
    };

    self.stop = function(){
      self.running = false;
    };

    self.placeRandom = function(){
      self.gridData.forEach(function(cell,index){
        if(Math.random() < 0.2){
          self.gridData[index] = 1;
        }
      });
    };

    self.reset = function(){
      self.gridData = Array(10000).fill(0).map(function(i){
        return 0;
      });
      self.steps = 0;
      self.fps = '';
      setTimeout(function(){
        $scope.$apply();
      },0);
    };
});
