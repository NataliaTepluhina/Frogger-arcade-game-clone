/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available
 */

var Engine = (function(global) {

    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 708;
    canvas.height = 586;
    doc.body.appendChild(canvas);


    function main() {

        if (gameFlag ==='started') {
            var now = Date.now(),
                dt = (now - lastTime) / 1000.0;

            /* Call update/render functions, pass along the time delta to
             * our update function since it may be used for smooth animation.
             */
            update(dt);
            render();


            lastTime = now;
        }
        else if (gameFlag === 'end') {
            endGame();
        }


        win.requestAnimationFrame(main);
    }

    //This function gets executed once you win the game
    function endGame () {

        ctx.fillStyle = 'red';
        ctx.fillRect(0, 240 ,canvas.width,100);
        ctx.font = '25pt Arial Black';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText('YOU WIN!', canvas.width/2, 280);
        ctx.fillText('Refresh page to start a new game', canvas.width/2, 320);
        ctx.strokeStyle = 'black';
        ctx.strokeText('YOU WIN!', canvas.width/2, 280);
        ctx.strokeText('Refresh page to start a new game', canvas.width/2, 320);
    }


    function init() {
        reset();
        lastTime = Date.now();
        main();
    }


    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }


    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        allStones.forEach(function(stone) {
            stone.update(dt);
        });
        player.update(dt);
        key.update(dt);
        door.update(dt);
        princess.update(dt);


    }


    function render() {
        /* relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/grass-block.png',   // Top row is grass
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/stone-block.png',   // Row 4 of 4 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
            ],
            numRows = 6,
            numCols = 8,
            row, col;


        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {

                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }


    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function
         */
        allStones.forEach(function(stone) {
            stone.render();
        });
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        door.render();
        player.render();
        key.render();
        princess.render();
    }


    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug_left.png',
        'images/enemy-bug_right.png',
        'images/enemy-bug_top.png',
        'images/enemy-bug_bottom.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/Rock.png',
        'images/Key.png',
        'images/Selector.png',
        'images/bug_princess.png'

    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);
