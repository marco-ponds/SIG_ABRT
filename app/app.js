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
    app.log('ciao');
    app.log('aggiungiamo una modifica a caso');
}
