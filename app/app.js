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

function Player(w, h) {
    this.canvas = document.querySelector('#player');
    this.canvas.width = w;
    this.canvas.height = h;
    this.c = this.canvas.getContext('2d');
    this.life = 100;
    this.pos = {
        x: 50,
        y: 50
    },
    this.dir = {
        x: 0,
        y: 0
    }
    this.radius = 20;
    this.speed = 1;
    this.angle = 0;

    document.addEventListener('mousemove', (function(evt) {
        if (!evt.target == this.canvas) return;
        var rect = this.canvas.getBoundingClientRect();
        this.mouse = {
            x: Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*this.canvas.width),
            y: Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*this.canvas.height)
        }
        var d = this._getDistance();
        this.dir = {
            x: (this.mouse.x - this.pos.x)/d,
            y: (this.mouse.y - this.pos.y)/d
        };
        this.pos.x += this.dir.x || 0;
        this.pos.y += this.dir.y || 0;

    }).bind(this))

}

Player.prototype = {
    isAlive: function() {
        return this.life > 0;
    },

    _getDistance: function() {
        if (!this.mouse) return 0;
        return Math.round(Math.sqrt(Math.pow(this.pos.x - this.mouse.x, 2) + Math.pow(this.pos.y - this.mouse.y, 2)));
    },

    render: function() {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.c.beginPath();
        var radius = this.radius + (Math.sin(this.angle))
        this.c.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, false);
        this.c.fillStyle = 'blue';
        this.c.fill();
        // increasing angle for radius animation
        this.angle += 0.05;
        if ((this.dir.x != NaN) && (this.dir.y != NaN) && (this._getDistance() > this.radius)) {
            this.pos.x += this.dir.x || 0;
            this.pos.y += this.dir.y || 0;
        }
    }
}

function App() {
    this.version = 'v0.0.1';
    this.author = 'Marco Stagni';

    this.canvas = document.querySelector('#game');
    this.container = document.querySelector('#gameContainer');
    this.c = this.canvas.getContext('2d');
    this.canvas.height = 2500;
    this.canvas.width = 4900;
    this.step = 100;
    this.margin = 200;

    this.container.style.height = this.canvas.height + 'px;';
    this.container.style.width = this.canvas.width + 'px;';

    this.coffee = new Bar('coffee');
    this.sleep = new Bar('sleep');

    this.player = new Player(this.canvas.height, this.canvas.width);

    this.maze = this.createMaze(12, 12);
    this.drawMaze(this.maze);
}

App.prototype = {
    printVersion: function() {
        var container = document.getElementById('version');
        container.innerText = this.version;
    },

    // maze generation thanks to http://rosettacode.org/wiki/Maze_generation#JavaScript
    createMaze: function(x,y) {
    	var n=x*y-1;
    	if (n<0) {alert("illegal maze dimensions");return;}
    	var horiz =[]; for (var j= 0; j<x+1; j++) horiz[j]= [],
    	    verti =[]; for (var j= 0; j<x+1; j++) verti[j]= [],
    	    here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)],
    	    path = [here],
    	    unvisited = [];
    	for (var j = 0; j<x+2; j++) {
    		unvisited[j] = [];
    		for (var k= 0; k<y+1; k++)
    			unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
    	}
    	while (0<n) {
    		var potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
    		    [here[0]-1, here[1]], [here[0],here[1]-1]];
    		var neighbors = [];
    		for (var j = 0; j < 4; j++)
    			if (unvisited[potential[j][0]+1][potential[j][1]+1])
    				neighbors.push(potential[j]);
    		if (neighbors.length) {
    			n = n-1;
    			next= neighbors[Math.floor(Math.random()*neighbors.length)];
    			unvisited[next[0]+1][next[1]+1]= false;
    			if (next[0] == here[0])
    				horiz[next[0]][(next[1]+here[1]-1)/2]= true;
    			else
    				verti[(next[0]+here[0]-1)/2][next[1]]= true;
    			path.push(here = next);
    		} else
    			here = path.pop();
    	}
    	return {x: x, y: y, horiz: horiz, verti: verti};
    },

     drawMaze: function(m) {
    	var text= [];
        var pos = {
            x: 0,
            y: 0
        };
        this.c.fillStyle = '#555555';
    	for (var j= 0; j<m.x*2+1; j++) {
    		var line= [];
    		if (0 == j%2)
    			for (var k=0; k<m.y*4+1; k++)
    				if (0 == k%4) {
                        line[k]= '+';
                        // moving to the right of 50px
                        this.c.fillRect(pos.x, pos.y, 8, 8);
                        pos.x += this.step;
                        // new
                        this.c.moveTo(pos.x, pos.y);
                    }
    				else
    					if (j>0 && m.verti[j/2-1][Math.floor(k/4)]) {
                            line[k]= ' ';
                            pos.x += this.step;
                            this.c.moveTo(pos.x, pos.y);
                        } else {
    						line[k]= '-';
                            this.c.fillRect(pos.x - 90, pos.y, 190, 8);
                            pos.x += this.step;
                            //new
                            this.c.moveTo(pos.x, pos.y);
                        }
    		else
    			for (var k=0; k<m.y*4+1; k++)
    				if (0 == k%4)
    					if (k>0 && m.horiz[(j-1)/2][k/4-1]) {
    						line[k]= ' ';
                            pos.x += this.step;
                            this.c.moveTo(pos.x, pos.y);
                        }
    					else {
    						line[k]= '|'; //verticalwall
                            this.c.fillRect(pos.x, pos.y - 90, 8, 190);
                            pos.x += this.step;
                            // new
                            this.c.moveTo(pos.x, pos.y);
                        }
    				else {
    					line[k]= ' ';
                        pos.x += this.step;
                        this.c.moveTo(pos.x, pos.y);
                    }
    		if (0 == j) {
                line[1]= line[2]= line[3]= ' ';
                pos.x += this.step;
                this.c.moveTo(pos.x, pos.y);
            }
    		if (m.x*2-1 == j) {
                line[4*m.y]= ' ';
                pos.x += this.step;
                this.c.moveTo(pos.x, pos.y);
            }
    		text.push(line.join('')+'\r\n');
            // moving down one line, resetting x position
            pos.x = 0;
            pos.y += this.step;
    	}
        console.log(text.join(''));
    	//return text.join('');
    },

    check: function() {

    },

    render: function() {
        // rendering bars
        this.coffee.render();
        this.sleep.render();
        // rendering game
        this.check();

        // rendering player
        this.player.render();
        // rendering enemies

    }
}

function render() {
    // rendering
    app.render();
    // requesting new frame
    app.renderid = requestAnimationFrame(render);
}

var app;
window.onload = function() {
    app = new App();
    app.printVersion();

    // calling render function
    render();
}
