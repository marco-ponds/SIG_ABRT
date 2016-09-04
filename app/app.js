function Coffee() {

}

function Sleep() {

}

function App() {
    this.version = 'v0.0.1';
}

App.prototype = {
    printVersion: function() {
      var container = document.getElementById('version');
      container.innerText = this.version;
    }
}


window.onload = function() {
    var app = new App();
    app.printVersion();
}
