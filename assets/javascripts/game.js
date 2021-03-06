jaws.TileMap.prototype.rm = function(obj) {
  var col = parseInt(obj.x / this.cell_size[0])
  var row = parseInt(obj.y / this.cell_size[1])
  return this.cells[col][row] = []
}

jaws.Sprite.prototype.init_life = function() {
  this.alive = true
}

jaws.Sprite.prototype.is_alive = function() {
  this.alive
}

jaws.Sprite.prototype.kill = function() {
  this.alive = false
}

function Example() {
  var player
  var blocks
  var fps
  var viewport
  var tile_map

  // Called once when a game state is activated. 
  // Use it for one-time setup code.
  this.setup = function() {
    live_info = document.getElementById("live_info")

    var block_image = "images/block.png"
    blocks = new jaws.SpriteList()

    var world = new jaws.Rect(0,0,320*2,320*2)
    
    for(var x = 0; x < world.width; x += 16 ) {
      for(var y = world.height-16; y > world.height / 1.5; y -= 16){
        blocks.push( new Sprite({image: block_image, x: x, y: y}) )
      }
    }

    blocks.push( new Sprite({image: block_image, x: 64, y: world.height / 1.5 - 10}) )
    blocks.push( new Sprite({image: block_image, x: 64, y: world.height / 1.5 - 26}) )

    // Later on we can look them up really fast (see player.move)
    tile_map = new jaws.TileMap({size: [200,200], cell_size: [16,16]})
    tile_map.push(blocks)

    viewport = new jaws.Viewport({max_x: world.width, max_y: world.height})
    player = new jaws.Sprite({x:world.width/2, y:world.height/1.5, scale: 1, anchor: "center_bottom"})

    player.move = function() {
      player.friction()
      player.gravity()
      if(this.x < 15){this.x = 15}
      if(this.x > world.width-15){this.x = world.width-15}
      if(this.y > world.height){this.y = 0}

      this.x += this.vx
      if(tile_map.atRect(player.rect()).length > 0) { this.x -= this.vx }

      this.y += this.vy
      var block = tile_map.atRect(player.rect())[0]
      if(block) { 
        // Heading downwards
        if(this.vy > 0) { 
          this.can_jump = true 
          this.y = block.rect().y - 1
        }
        // Heading upwards (jumping)
        else if(this.vy < 0) {
          this.y = block.rect().bottom + this.height
        }
        this.vy = 0
      }
    }

    player.friction = function() {
      if(this.vx > 0) {
        this.vx -= 0.15
      }
      if(this.vx > 0 && this.vx < 0.1){
        this.vx = 0
      }

      if(this.vx < 0) {
        this.vx += 0.15
      }
      if(this.vx < 0 && this.vx > -0.1){
        this.vx = 0
      }
    }

    player.gravity = function() {
      if(this.vy > -50){this.vy += 0.4}
    }

    player.chop = function() {
      if(jaws.pressed('down')){
        block = tile_map.at(player.x, player.y+1)
        if(block[0] != undefined){
          tile_map.rm(block[0])
          block[0].x = -5
          block[0].y = -5
        }
      } else if(jaws.pressed('up')){
        block = tile_map.at(player.x, player.y-20)
        if(block[0] != undefined){
          tile_map.rm(block[0])
          block[0].x = -5
          block[0].y = -5
        }
      } else if(jaws.pressed('left')){
        block = tile_map.at(player.x-15, player.y)
        if(block[0] != undefined){
          tile_map.rm(block[0])
          block[0].x = -5
          block[0].y = -5
        }
      } else if(jaws.pressed('right')){
        block = tile_map.at(player.x+15, player.y)
        if(block[0] != undefined){
          tile_map.rm(block[0])
          block[0].x = -5
          block[0].y = -5
        }
      } else {
        jaws.log("")
      }
    }

    var anim = new jaws.Animation({sprite_sheet: "images/droid_11x15.png", frame_size: [11,15], frame_duration: 100})
    player.anim_default = anim.slice(0,5)
    player.anim_up = anim.slice(6,8)
    player.anim_down = anim.slice(8,10)
    player.anim_left = anim.slice(10,12)
    player.anim_right = anim.slice(12,14)
    player.vx = player.vy = 0
    player.can_jump = true

    player.setImage( player.anim_default.next() )
    // jaws.context.mozImageSmoothingEnabled = false;  // non-blurry, blocky retro scaling
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }

  /* update() will get called each game tick with your specified FPS. Put game logic here. */
  this.update = function() {
    player.setImage( player.anim_default.next() )

    if(jaws.pressed("left"))  { if(player.vx > -3){player.vx -= 0.3}; player.setImage(player.anim_left.next()) }
    if(jaws.pressed("right")) { if(player.vx < 3){player.vx += 0.3};  player.setImage(player.anim_right.next()) }
    if(jaws.pressed("up"))    { if(player.can_jump) { player.vy = -9; player.can_jump = false } }
    if(jaws.pressed("space")) {
      player.chop()
    }

    // apply vx / vy (x velocity / y velocity), check for collision detection in the process.
    player.move()

    // Tries to center viewport around player.x / player.y.
    // It won't go outside of 0 or outside of our previously specified max_x, max_y values.
    viewport.centerAround(player)

    // debugging
    live_info.innerHTML = "Viewport: " + parseInt(viewport.x) + "/" + parseInt(viewport.y) + ". "
    live_info.innerHTML += jaws.game_loop.fps + " fps. Player: " + 
                          parseInt(player.x) + "/" + 
                          parseInt(player.y) + ". <br/>" + 
                          "vy: " + player.vy + "<br/>" + 
                          "vx: " + player.vx + "<br/>"
  }

  // Directly after each update draw() will be called. 
  // Put all your on-screen operations here.
  this.draw = function() {
    jaws.clear()
    // the viewport magic. 
    // wrap all draw()-calls inside viewport.apply 
    // and it will draw those relative to the viewport.
    viewport.apply( function() {
      blocks.draw()
      player.draw()
    });
  }
}

jaws.onload = function() {
  jaws.unpack()
  jaws.assets.add(["images/droid_11x15.png","images/block.png"])
  jaws.start(Example)  
  // Our convenience function jaws.start() will load assets, 
  // call setup and loop update/draw in 60 FPS
}
