var player
var canvas
var fps


function setup() {
  fps     = document.getElementById("fps")
  canvas  = document.getElementsByTagName('canvas')[0]
  setup_player()

  jaws.on_keydown("esc", setup)
  jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
}

function update() {
  update_player()
  forceInsideCanvas(player)
}

function draw() {
  jaws.clear()
  player.draw()
  draw_fps()
}

function draw_fps() {
  fps.innerHTML = jaws.game_loop.fps
}

function isOutsideCanvas(item) { 
  return (item.x < 0 || item.y < 0 || item.x > canvas.width || item.y > canvas.height) 
}

function forceInsideCanvas(item) {
  if(item.x < 0)                    { item.x = 0  }
  if(item.right > canvas.width)     { item.x = canvas.width - item.width }
  if(item.y < 0)                    { item.y = 0 }
  if(item.bottom  > canvas.height)  { item.y = canvas.height - item.height }
}

function setup_player() {
  start_x = 10
  start_y = 10
  player = new jaws.Sprite({x:start_x, y:start_y, scale: 1, anchor: "center"})
  
  var anim = new jaws.Animation({sprite_sheet: "images/player_sprite.png", orientation: 'right', frame_size: [20,20], frame_duration: 100})
  player.anim_default = anim.slice(0,1)
  player.anim_up = anim.slice(1,2)
  player.anim_right = anim.slice(2,3)
  player.anim_down = anim.slice(3,4)
  player.anim_left = anim.slice(4,5)
  player.setImage( player.anim_default.next() )
}

function update_player() {
  player.setImage( player.anim_default.next() )
  if(jaws.pressed("left"))  { player.x -= 2; player.setImage(player.anim_left.next())}
  if(jaws.pressed("right")) { player.x += 2; player.setImage(player.anim_right.next())}
  if(jaws.pressed("up"))    { player.y -= 2; player.setImage(player.anim_up.next()) }
  if(jaws.pressed("down"))  { player.y += 2; player.setImage(player.anim_down.next()) }
}

jaws.assets.add("images/player_sprite.png")
jaws.start()
