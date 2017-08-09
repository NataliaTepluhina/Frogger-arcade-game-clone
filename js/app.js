//This global variable serves to mark while the game is ended
var gameFlag = 'started';

// Enemies our player must avoid
var Enemy = function(startX, startY, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = startX;
    this.y = startY;
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = Enemy.prototype.selectSprite ();
    //TODO: create an array of enemies sprites and function to randomize
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype = {
    update: function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x += this.speed * dt;
        if (this.x > ctx.canvas.width) {
            // Move the enemy to its start position and randomize its speed and sprite
            this.x = -60;
            this.speed = 65*Math.floor(Math.random() * 5 + 1);
            this.sprite = this.selectSprite();
        }
        this.checkCollisions();
    },

    //Function to detect collisions beetween enemy and player
    checkCollisions: function() {
        var enemyLeftX = this.x - 60;
        var enemyRightX = this.x + 60;
        var enemyTopY = this.y;
        var enemyBottomY = this.y + 120;

            if (player.x > enemyLeftX && player.x < enemyRightX && player.y > enemyTopY && player.y < enemyBottomY) {
                player.resetPosition();
                player.level = 1;
            }
    },

    // Draw the enemy on the screen, required method for game
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    //Function to randomize enemy's picture
    selectSprite: function () {
        var pic;
        var modifier = Math.random()*100;
        if (modifier >= 0 && modifier < 25) {
            pic = 'images/char-boy.png';
        }
        if (modifier >= 25 && modifier < 50) {
            pic = 'images/char-cat-girl.png';
        }
        if (modifier >= 50 && modifier < 75) {
            pic = 'images/char-horn-girl.png';
        }
        if (modifier >= 75 && modifier < 100) {
            pic = 'images/char-pink-girl.png';
        }
        return pic;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function (dt){
    this.startX = 205;
    this.startY = 460;
    this.x = this.startX;
    this.y = this.startY;
    this.sprite = 'images/enemy-bug_right.png';
    this.status = 'stop';
    this.level = 1;
};

Player.prototype = {
        update: function(dt) {
           this.move(dt);
           this.changeSprite();
        },

        //Change player.status status while given key is pressed
        handleInput: function (key) {
            switch (key) {
                case ('left'):
                    this.status = 'moveLeft';
                    break;
                case ('right'):
                    this.status = 'moveRight';
                    break;
                case ('up'):
                    this.status = 'moveTop';
                    break;
                case ('down'):
                    this.status = 'moveBottom';
                    break;
                default: 
                    this.status = 'stop';
            }
        },

        //Move player inside canvas boundaries to the given direction
        move: function (dt) {
            if (this.status === 'moveLeft' && this.x > 0) {
                this.x -= dt * 160;
            }
            if (this.status === 'moveRight' && this.x < ctx.canvas.width - 100) {
                this.x += dt * 160;
            }
            if (this.status === 'moveTop' && this.y > 52) {
                this.y -= dt * 130;
            }
            if (this.status === 'moveBottom' && this.y < ctx.canvas.height - 100) {
                this.y += dt * 130;
            }
        },

        //Change player image while changing movement direction
        changeSprite: function () {
            if (this.status === 'moveLeft') {
                this.sprite = 'images/enemy-bug_left.png';
            }
            if (this.status === 'moveRight') {
                this.sprite = 'images/enemy-bug_right.png';
            }
            if (this.status === 'moveTop') {
                this.sprite = 'images/enemy-bug_top.png';
            }
            if (this.status === 'moveBottom') {
                this.sprite = 'images/enemy-bug_bottom.png';
            }
        },

        //Move player back to its initial position after collision with enemy and dropping the key on the ground
        resetPosition: function () {
            this.x = this.startX;
            this.y = this.startY;
            this.sprite = 'images/enemy-bug_right.png';
            key.status = 'onground';
        },

        // Draw the player on the screen
        render: function () {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
            ctx.font = '40px Arial Black';
            ctx.fillStyle = 'white';
            ctx.fillText('Level ' + this.level, 30, 105);
            ctx.strokeStyle = 'black';
            ctx.strokeText('Level ' + this.level, 30, 105);
        },
};

//Class for the stones which will stop our player character
var Stone = function (y) {
    this.x = 101*(Math.floor(Math.random()*7));
    this.y = y;
    this.sprite = 'images/Rock.png';
};

Stone.prototype = {
    update: function(dt) {
        this.checkCollisions();
    },

    //This function detects the collision between player and stone and stops player movement
    checkCollisions: function () {
        var stoneLeftX = this.x - 90;
        var stoneRightX = this.x + 90;
        var stoneTopY = this.y;
        var stoneBottomY = this.y + 140;
        if (player.x > stoneLeftX && player.x < stoneRightX &&
            player.y > stoneTopY && player.y < stoneBottomY) {
            switch (player.status) {
                case ('moveLeft'):
                    player.status = 'stop';
                    if (Math.abs (player.x - stoneRightX) < Math.abs (player.x - stoneLeftX)) {
                        player.x = stoneRightX;
                    }
                    else {
                        player.x = stoneLeftX;
                    }
                    break;
                case ('moveRight'):
                    player.status = 'stop';
                    if (Math.abs (player.x - stoneLeftX) < Math.abs (player.x - stoneRightX)) {
                        player.x = stoneLeftX;
                    }
                    else {
                        player.x = stoneRightX;
                    }
                    break;
                 case ('moveTop'):
                    player.status = 'stop';
                    if (Math.abs (player.y - stoneBottomY) < Math.abs (player.y - stoneTopY)) {
                        player.y = stoneBottomY;
                    }
                    else {
                        player.y = stoneTopY;
                    }
                    break;
                case ('moveBottom'):
                    player.status = 'stop';
                    if (Math.abs (player.y - stoneTopY) < Math.abs (player.y - stoneBottomY)) {
                        player.y = stoneTopY;
                    }
                    else {
                        player.y = stoneBottomY;
                    }
                    break;                
            }
        }
    },

    //Resets stones positions after level-up
    reset: function () {
        this.x = 101*(Math.floor(Math.random()*7));
    },

    //Draws stones on the screen
    render: function () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

//Class for the key which is needed to open the door between levels - and princess' heart as well
var Key = function(y) {
    this.x = 101*(Math.floor(Math.random()*5) + 1);
    this.y = y;
    this.sprite = 'images/Key.png';
    this.width = 20;
    this.height = 50;
    this.status = 'onground';
};

Key.prototype = {
    update: function(dt) {
        this.checkCollisions();
    },

    //Checks collisions between player and key and "gives" key to the player
    checkCollisions: function () {
        var keyLeftX = this.x - 60;
        var keyRightX = this.x + 60;
        var keyTopY = this.y;
        var keyBottomY = this.y + 120;
        if (player.x > keyLeftX && player.x < keyRightX &&
            player.y > keyTopY && player.y < keyBottomY) {
            this.status = 'picked';
        }
    },

    //Resets key position after level-up
    reset: function () {
        this.x = 101*(Math.floor(Math.random()*5) + 1);
    },

    //Draws the key on the screen
    render: function() {
        if (this.status === 'onground') {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    }
};

//Class for the doors between levels
var Door = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/Selector.png';
};

Door.prototype = {
    update: function (dt) {
        this.checkCollisions();
    },

    //Detects while player is moving through the door and resets stones and key positions.
    //Working only for 2 first levels
    checkCollisions: function () {
        var doorLeftX = this.x - 10;
        var doorRightX = this.x + 10;
        var doorTopY = this.y - 10;
        var doorBottomY = this.y + 10;
        if (player.level < 3 && key.status === 'picked' && player.x > doorLeftX && player.x < doorRightX &&
            player.y > doorTopY && player.y < doorBottomY) {
            key.status = 'onground';
            player.resetPosition();
            player.level++;
            for (var i = 0; i < allStones.length; i++) {
                allStones[i].reset();
            }
            key.reset();
        }
    },

    //Draws the door on the screen
    render: function () {
        if (player.level < 3) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);            
        }
    }
};

//Class for the princess - the goal of the game
var Princess = function(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/bug_princess.png';
};

Princess.prototype = {
    update: function (dt) {
        this.checkCollisions();
    },

    //Checks while player meets his princess and cause a game over status
    checkCollisions: function () {
        var princessLeftX = this.x - 90;
        var princessRightX = this.x + 80;
        var princessTopY = this.y - 80;
        var princessBottomY = this.y + 80;
        if (player.level === 3 && key.status === 'picked' && player.x > princessLeftX && player.x < princessRightX &&
            player.y > princessTopY && player.y < princessBottomY) {
            gameFlag = 'end';
        }
    },

    //Draws the princess for the last level
    render: function () {
        if (player.level === 3) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);            
        }

    }
};




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(0, 60, 290),
                  new Enemy(0, 140, 200),
                  new Enemy(0, 230, 400),
                  new Enemy(0, 320, 320)];
player = new Player();
var allStones = [new Stone (60), new Stone (230), new Stone (310)];
var key = new Key (140);
var door = new Door (505, 50);
var princess = new Princess (606, 50);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'stand',
        38: 'stand',
        39: 'stand',
        40: 'stand'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});




