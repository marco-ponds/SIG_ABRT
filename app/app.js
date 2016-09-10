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

    this.canvas = document.querySelector('#game');
    this.container = document.querySelector('#gameContainer');
    this.canvas.height = 1400;
    this.canvas.width = 1400;

    this.container.style.height = this.canvas.height + 'px;';
    this.container.style.width = this.canvas.width + 'px;';

    this.maze = this.createMaze(this.canvas.height/50, this.canvas.height/50);
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
    	for (var j= 0; j<m.x*2+1; j++) {
    		var line= [];
    		if (0 == j%2)
    			for (var k=0; k<m.y*4+1; k++)
    				if (0 == k%4)
    					line[k]= '+';
    				else
    					if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
    						line[k]= ' ';
    					else
    						line[k]= '-';
    		else
    			for (var k=0; k<m.y*4+1; k++)
    				if (0 == k%4)
    					if (k>0 && m.horiz[(j-1)/2][k/4-1])
    						line[k]= ' ';
    					else
    						line[k]= '|';
    				else
    					line[k]= ' ';
    		if (0 == j) line[1]= line[2]= line[3]= ' ';
    		if (m.x*2-1 == j) line[4*m.y]= ' ';
    		text.push(line.join('')+'\r\n');
    	}
    	return text.join('');
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

var app;
window.onload = function() {
    app = new App();
    app.printVersion();

    // calling render function
    render();
}
