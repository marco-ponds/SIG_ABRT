function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function Bar(element) {
    this.element = element;
    this.canvas = document.getElementById(element);
    this.ctx = this.canvas.getContext('2d');
    this.levels = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    this.angles = [];
    // creating random angles
    for (var i=0; i<this.levels.length; i++) {
        this.angles.push(randomInt(0, 2) - 1);
    }
    this.level = 0.5;
    this.height = this.canvas.height;
    this.width = this.canvas.width;
    this._angle = 0;
}

Bar.prototype = {
    render: function() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);

        var barWidth = 5;
        var barHeight;
        var x = 15;

        for(var i = 0; i < this.levels.length; i++) {
            barHeight = (this.levels[i]*this.height) + (Math.sin(this.angles[i]) * 5);

            this.ctx.fillStyle = 'rgb(255, 255, 255)';
            this.ctx.fillRect(x, this.height-barHeight, barWidth, barHeight);

            x += barWidth + 8;
            this.angles[i] += 0.1;
        }
        // shifting and pushing level
        this.levels.shift();
        this.levels.push(app[this.element].level);
        // increasing angle
        this._angle += 0.1;
    },

    inc: function(amount) {
        // increasing level by 0.1
        this.level += (amount ? amount : 0.1);
    },

    dec: function(amount) {
        // decreasing level by 0.1
        this.level = this.level - (amount ? amount : 0.1);
    }
}

function App() {
    this.version = 'v0.0.1';
    this.author = 'Marco Stagni';

    this.coffee = new Bar('coffee');
    this.sleep = new Bar('sleep');
}

App.prototype = {
    printVersion: function() {
      var container = document.getElementById('version');
      container.innerText = this.version;
    },

    render: function() {
        // rendering bars
        this.coffee.render();
        this.sleep.render();
        // rendering game

        // rendering player

        // rendering enemies

    }


}

function render() {
    // rendering
    app.render();
    // requesting new frame
    app.renderid = requestAnimationFrame(render);
}

window.onload = function() {
    window.app = new App();
    app.printVersion();

    // calling render function
    render();
}
