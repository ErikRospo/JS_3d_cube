// constants
const COLOR_BG = "black";
const COLOR_CUBE = "yellow";
const SPEED_X = 0.05; //rps
const SPEED_Y = 0.1; //rps
const SPEED_Z = 0.15; //rps
class POINT3D {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
// canvas and context setup
var canvas = document.getElementById("cnv");
var ctx = canvas.getContext("2d");

//get document dimensions
var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;
canvas.height = h;
canvas.width = w;

//colors and lines
ctx.fillStyle = COLOR_BG;
ctx.strokeStyle = COLOR_CUBE;
ctx.lineWidth = w / 100;
ctx.lineCap = "round";

//cube parameters
var cx = w / 2;
var cy = h / 2;
var cz = 0;
var size = h / 4;
var vertices = [
  new POINT3D(cx - size, cy - size, cz - size),
  new POINT3D(cx + size, cy - size, cz - size),
  new POINT3D(cx + size, cy + size, cz - size),
  new POINT3D(cx - size, cy + size, cz - size),
  new POINT3D(cx - size, cy - size, cz - size),
  new POINT3D(cx + size, cy - size, cz + size),
  new POINT3D(cx + size, cy + size, cz + size),
  new POINT3D(cx - size, cy + size, cz + size),
];
var edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0], //back face
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4], //front face
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7], //connecting sides
];
//set up animation loop
var timeDelta,
  timeLast = 0;
requestAnimationFrame(loop);
function update_angles() {
  let angle = timeDelta * cubeSpeed * SPEED_Z * Math.PI * 2;
  for (let v of vertices) {
    let dx = v.x - cx;
    let dy = v.y - cy;
    let x = dx * Math.cos(angle) - dy * Math.sin(angle);
    let y = dx * Math.sin(angle) + dy * Math.cos(angle);
    v.x = x + cx;
    v.y = y + cy;
  }
  angle = timeDelta * cubeSpeed * SPEED_X * Math.PI * 2;
  for (let v of vertices) {
    let dz = v.z - cz;
    let dy = v.y - cy;
    let z = dz * Math.cos(angle) - dy * Math.sin(angle);
    let y = dz * Math.sin(angle) + dy * Math.cos(angle);
    v.z = z + cz;
    v.y = y + cy;
  }
  angle = timeDelta * cubeSpeed * SPEED_Y * Math.PI * 2;
  for (let v of vertices) {
    let dx = v.x - cx;
    let dz = v.z - cz;
    let x = dx * Math.cos(angle) - dz * Math.sin(angle);
    let z = dx * Math.sin(angle) + dz * Math.cos(angle);
    v.x = x + cx;
    v.z = z + cz;
  }
}
function loop(timeNow) {
  timeDelta = timeNow - timeLast;
  timeLast = timeNow;
  //Background
  ctx.fillRect(0, 0, w, h);
  update_angles();
  // draw each edge
  for (let edge of edges) {
    ctx.beginPath();
    ctx.moveTo(vertices[edge[0]].x, vertices[edges[0]].y);
    ctx.moveTo(vertices[edge[1]].x, vertices[edges[1]].y);
    ctx.stroke();
  }
  //call next frame
  requestAnimationFrame(loop);
}
