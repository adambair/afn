var player
var canvas
var context
var fps
var log

function setup() {
  fps     = document.getElementById("fps")
  canvas  = document.getElementsByTagName('canvas')[0]
  debug   = document.getElementById('log')
  context = canvas.getContext('2d');

  player = new jaws.Sprite({image: "images/player.png", x: canvas.width / 2, y: canvas.height / 2 - 20, context: context})
  jaws.on_keydown("esc", setup)
  jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
}

function update() {
  if(jaws.pressed("left"))  { player.x -= 2 }
  if(jaws.pressed("right")) { player.x += 2 }
  if(jaws.pressed("up"))    { player.y -= 2 }
  if(jaws.pressed("down"))  { player.y += 2 }
  forceInsideCanvas(player)
}

function draw() {
  jaws.clear()
  player.draw()
  fps.innerHTML = jaws.game_loop.fps
  dimensions = canvas.width + " " + canvas.height
  log.innerHTML = dimensions
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

jaws.assets.add("images/player.png")
jaws.start()
