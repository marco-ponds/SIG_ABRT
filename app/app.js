function Bar(element) {
    this.canvas = document.getElement
}

function App() {
    this.version = 'v0.0.1';
    this.author = 'Marco Stagni';
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
