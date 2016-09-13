var GLITCHES = {
    'invert_color': {
        color: 'red',
        shape: 'triangle',
        render: function() {
            this.c.clearRect(0, 0, this.w, this.h);
            this.c.beginPath();
            this.c.moveTo(this.pos.x + 5, this.pos.y);
            this.c.lineTo(this.pos.x + 10, this.pos.y + 10);
            this.c.lineTo(this.pos.x, this.pos.y + 10);
            this.c.lineTo(this.pos.x + 5, this.pos.y);
            this.c.lineWidth = 1;
            this.c.strokeStyle = 'red';
            this.c.stroke();
        },
        effect: function() {}
    },
    'lag': {
        color: 'green',
        shape: 'square',
        render: function() {
            this.c.clearRect(0, 0, this.w, this.h);
            this.c.beginPath();
            this.c.moveTo(this.pos.x, this.pos.y);
            this.c.lineTo(this.pos.x + 20, this.pos.y);
            this.c.lineTo(this.pos.x + 20, this.pos.y + 20);
            this.c.lineTo(this.pos.x, this.pos.y + 20);
            this.c.lineTo(this.pos.x, this.pos.y);
            this.c.lineWidth = 1;
            this.c.strokeStyle = 'green';
            this.c.stroke();
        },
        effect: function() {}
    },
    'invisible': {
        color: 'white',
        shape: 'circle',
        render: function() {
            this.c.clearRect(0, 0, this.w, this.h);
            this.c.beginPath();
            //var radius = this.radius + (Math.sin(this.angle))
            this.c.arc(this.pos.x, this.pos.y, 10, 0, 2 * Math.PI, false);
            this.c.fillStyle = '#ffffff';
            this.c.fill();
            this.c.arc(this.pos.x, this.pos.y, 8, 0, 2 * Math.PI, false);
            this.c.fillStyle = '#000000';
            this.c.fill();
            this.c.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI, false);
            this.c.fillStyle = '#ffffff';
            this.c.fill();
        },
        effect: function() {}
    }
}

var GLITCHES_HUMAN = {
    tired: {
        blink: function() {
          // eyes blinking
        },
        wavy: function() {
            // random oscillation of the screen
        },
        wtf: function() {
            // all enemies have the same color and shape and effect
        }
    },
    excited: {
        fast: function() {
            // everything is moving faster
        },
        colors: function() {
            // colors are changing.
        }
    }

}

function randomInt(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getMousePosition(element, evt) {
    var rect = element.getBoundingClientRect();
    return {
        x: Math.round((evt.clientX-rect.left)/(rect.right-rect.left)*element.width),
        y: Math.round((evt.clientY-rect.top)/(rect.bottom-rect.top)*element.height)
    }
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

function EnemiesHolder(w, h) {
    this.canvas = document.querySelector('#enemies');
    this.canvas.width = w;
    this.canvas.height = h;
    this.c = this.canvas.getContext('2d');
    this.count = 100;
    this.enemies = [];
    this.types = Object.keys(GLITCHES);
    // creating 100 enemies
    for (var i=0; i<100; i++) {
        this.enemies.push(
            new Enemy(
                this.types[Math.floor(Math.random() * this.types.length)],
                this.c,
                w,
                h
            )
        );
    }
}

EnemiesHolder.prototype = {
    render: function() {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i in this.enemies) {
            if (!this.enemies[i].isAlive()) {
                // if the enemy is dead, remove from list
                this.enemies.splice(i, 1);
            } else {
                this.enemies[i].render();
            }
        }
    },

    handleFire: function(click) {
        for (var i in this.enemies) {
            if (this.enemies[i]._getDistance(this.enemies[i].pos, click) < 10) {
                this.enemies[i].hit(app.player.hit)
            }
        }
    }
}

function Enemy(type, ctx, w, h) {
    this.life = 20;
    this.width = w;
    this.height = h;
    this.type = type;
    this.c = ctx;
    this.pos = {
        x: (Math.random() * (this.width - 100)) + 100,
        y: (Math.random() * (this.height - 100)) + 100
    }
}

Enemy.prototype = {
    isAlive: function() {
        return this.life > 0;
    },

    _getDistance: function(_pos, _pos2) {
        var pos = _pos || this.pos;
        var pos2 = _pos2 || app.player.pos;
        return Math.round(Math.sqrt(Math.pow(pos.x - pos2.x, 2) + Math.pow(pos.y - pos2.y, 2)));
    },

    hit: function(damage) {
        this.life = this.life - damage;
    },

    explode: function() {
        // applying effect then dies
        GLITCHES[this.type].render.bind(this).call();
        this.life = 0;
        // TODO player is damaged
    },

    render: function() {
        var d = this._getDistance();
        // move only if we're close enough\
        if (d < 500) {
            this.dir = {
                x: (app.player.pos.x - this.pos.x)/d,
                y: (app.player.pos.y - this.pos.y)/d
            };
            this.pos.x = this.pos.x + this.dir.x || 0;
            this.pos.y = this.pos.y + this.dir.y || 0;
        }
        GLITCHES[this.type].render.bind(this).call();
        if (d < 20) {
            this.explode();
        }
    }
}

function Player(w, h) {
    this.canvas = document.querySelector('#player');
    this.canvas.width = w;
    this.canvas.height = h;
    this.c = this.canvas.getContext('2d');
    this.life = 100;
    this.hit = 50
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

    document.addEventListener('mousedown', (function(evt) {
        if (!evt.target == this.canvas) return;
        this.click = getMousePosition(this.canvas, evt);
        this.fire();
        app.enemies.handleFire(this.click);
    }).bind(this))

    document.addEventListener('mousemove', (function(evt) {
        if (!evt.target == this.canvas) return;
        this.mouse = getMousePosition(this.canvas, evt);
        var d = this._getDistance();
        this.dir = {
            x: (this.mouse.x - this.pos.x)/d,
            y: (this.mouse.y - this.pos.y)/d
        };
        var next_pos = {
            x: this.pos.x + this.dir.x || 0,
            y: this.pos.y + this.dir.y || 0
        }
        //this.pos.x += this.dir.x || 0;
        //this.pos.y += this.dir.y || 0;
        if ((this._getDistance(next_pos) > this.radius) && this.checkPosition(next_pos)) {
            this._updatePosition();
        }
    }).bind(this))

}

Player.prototype = {
    isAlive: function() {
        return this.life > 0;
    },

    _getDistance: function(_pos) {
        var pos = _pos || this.pos;
        if (!this.mouse) return 0;
        return Math.round(Math.sqrt(Math.pow(pos.x - this.mouse.x, 2) + Math.pow(pos.y - this.mouse.y, 2)));
    },

    _updatePosition: function() {
        var x = this.dir.x || 0,
            y = this.dir.y || 0;
        this.pos.x += x;
        this.pos.y += y;

        //app.updateMaze();
    },

    fire: function(click) {
        if (!this.click || this.firing) return;
        this.firing = true;
        this._drawFire();
        setTimeout((function(){
            this.firing = false;
        }).bind(this), 500);
    },

    _drawFire: function() {
        //this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.c.strokeStyle = '#ffff00';
        this.c.beginPath();
        this.c.moveTo(this.pos.x, this.pos.y);
        this.c.lineTo(this.click.x, this.click.y);
        this.c.lineWidth = 2;
        this.c.stroke();
    },

    checkPosition: function(_pos) {
        var pos = _pos || this.pos;
        if ((pos.x < 10) || (pos.x > this.canvas.width)) return false;
        if ((pos.y < 10) || (pos.y > this.canvas.height)) return false;
        var data = app.c.getImageData(pos.x, pos.y, 4, 4).data;
        //if (data.indexOf(0) == -1) return false;
        //if ((data[0] != 0) && (data[1] != 0) && (data[2] != 0)) return false;
        if (data.indexOf(85) != -1) return false;
        return true;
    },

    render: function() {
        if ((this._getDistance() > this.radius) && this.checkPosition()) {
            this._updatePosition();


            this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.c.beginPath();
            var radius = this.radius + (Math.sin(this.angle))
            this.c.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, false);
            this.c.fillStyle = 'blue';
            this.c.fill();
            // increasing angle for radius animation
            this.angle += 0.05;
            //var next_pos = {
            //    x: this.pos.x + (this.dir.x || 0),
            //    y: this.pos.y + (this.dir.y || 0)
            //}
        }
        if (this.firing) {
            this._drawFire();
        }
    }
}

function App() {
    this.version = 'v0.0.1';
    this.author = 'Marco Stagni';

    this.conversation = document.querySelector('#conversation');
    this.printing = false;
    this.queue = [];

    this.canvas = document.querySelector('#game');
    this.container = document.querySelector('#gameContainer');
    this.canvases = this.container.querySelectorAll('canvas');
    this.c = this.canvas.getContext('2d');
    this.container.height = 409;
    this.container.width = 794;
    this.canvas.height = 2500;
    this.canvas.width = 4900;
    this.step = 100;
    this.margin = 200;

    this.container.style.height = this.canvas.height + 'px;';
    this.container.style.width = this.canvas.width + 'px;';

    this.coffee = new Bar('coffee');
    this.sleep = new Bar('sleep');

    this.player = new Player(this.canvas.width, this.canvas.height);

    this.enemies = new EnemiesHolder(this.canvas.width, this.canvas.height);

    this.maze = this.createMaze(12, 12);
    this.drawMaze(this.maze);

    document.addEventListener('mousemove', (function(evt) {
        if (!evt.target == this.container) return;
        //console.log('inside mousemove');
        this.mouse = getMousePosition(this.container, evt);
    }).bind(this));
}

App.prototype = {
    printVersion: function() {
        var container = document.getElementById('version');
        container.innerText = this.version;
    },

    say: function(owner, message) {
        if (this.printing) {
            this.queue.push({o: owner, m: message});
            return;
        }
        var li = document.createElement('li');
        li.className = owner;
        this.conversation.appendChild(li);
        var i = 0;
        app.printing = true;

        function _appendText() {
            li.innerHTML += message[i];
            app.conversation.scrollTop = app.conversation.scrollHeight;
            i++;
            if (i<message.length) {
                setTimeout(_appendText, Math.round(Math.random() * 80))
            } else {
                app.printing = false;
                if (app.queue.length != 0) {
                    var msg = app.queue.shift();
                    app.say(msg.o, msg.m);
                }
            }
        }
        setTimeout(_appendText, Math.round(Math.random() * 80));
    },

    boot: function() {
        for (var i in BOOT) {
            app.say(BOOT[i].o, BOOT[i].m);
        }
    },

    intro: function() {
        for (var i in INTRO) {
            app.say(INTRO[i].o, INTRO[i].m);
        }
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
        ////console.log(text.join(''));
    	//return text.join('');
    },

    updateMaze: function() {
        if (!this.mouse) return;
        if ((app.player._getDistance() < 150) &&
            ((this.mouse.x > (this.container.width - 100))
            ||(this.mouse.y > (this.container.height - 100))
            ||(this.mouse.x > 0 && this.mouse.x < 100)
            ||(this.mouse.y > 0 && this.mouse.y < 100)
            )) {

            var x = app.player.dir.x,
                y = app.player.dir.y;
            // move all canvases
            var top = parseInt(app.canvases[0].style.top.replace('px', '')) || 0;
            var left = parseInt(app.canvases[0].style.left.replace('px', '')) || 0;
            top = top - (y*10);
            left = left - (x*10);
            if (top > 0) {
                top = 0;
            } else if (top < -2000) {
                top = -2000;
            }
            if (left > 0) {
                left = 0;
            } else if (left < -4600) {
                left = -4600;
            }
            var i = 0;
            for (i=0; i<app.canvases.length; i++) {
                // TODO still need to update maze position
                app.canvases[i].style.top = top + 'px';
                app.canvases[i].style.left = left + 'px';
            }
        }
    },

    check: function() {

    },

    render: function() {
        // rendering bars
        this.coffee.render();
        this.sleep.render();
        // rendering game
        this.updateMaze();

        // rendering player
        this.player.render();
        // rendering enemies
        this.enemies.render();
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
    app.boot();
    app.intro();

    // calling render function
    render();
}
