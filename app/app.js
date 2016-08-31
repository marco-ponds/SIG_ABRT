function KeyListener() {
  // listening
}

function App() {

}

App.prototype = {
  log: function(params) {
    console.log(params);
  }
}


window.onload = function() {
    var app = new App();
}
