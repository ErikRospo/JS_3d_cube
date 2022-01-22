const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let SHAPE = 1;
let SPEEDSETTER = 2;
let sizeFactor = 1;
let overlay = 0;
let dots = 0;
let UseColor = 1;
let edgeCount=32;
debugFlag=false;
if (urlParams.has("shape")) {
  SHAPE = parseInt(urlParams.get("shape"), 10);

}
if (urlParams.has("speed")) {
  SPEEDSETTER = parseInt(urlParams.get("speed"), 10);
}
if (urlParams.has("size")) {
  sizeFactor = parseFloat(urlParams.get("size"));
}
if (urlParams.has("overlay")) {
  overlay = parseInt(urlParams.get("overlay"), 10);
}
if (urlParams.has("dots")) {
  dots = parseInt(urlParams.get("dots"), 10);
}
if (urlParams.has("color")) {
  UseColor = parseInt(urlParams.get("color"), 10);
}
if (urlParams.has("debug")){
  debugFlag=(parseInt(urlParams.get("debug"))==1)
}
if (urlParams.has("edgecount")&(SHAPE==3)){
  edgeCount=parseInt(urlParams.get("edgecount"));
}
if (debugFlag) {
  console.log(sizeFactor);
  console.log(SPEEDSETTER);
  console.log(SHAPE);
  console.log(overlay);
  console.log(dots);
  console.log(UseColor);
}
const random = Math.random;
const COLOR_BG = "black";
const COLOR_CUBE = "yellow";
switch (SPEEDSETTER) {
  case 1:
    var SPEED_X = random(); // rps
    var SPEED_Y = random(); // rps
    var SPEED_Z = random(); // rps
    break;
  case 2:
    var SPEED_X = 0.05; // rps
    var SPEED_Y = 0.1; // rps
    var SPEED_Z = 0.15; // rps
    break;
  default:
    var SPEED_X = 0.1; // rps
    var SPEED_Y = 0.1; // rps
    var SPEED_Z = 0.1; // rps
    break;
}
const POINT3D = function(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

// set up the canvas and context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// dimensions
var h = document.documentElement.clientHeight;
var w = document.documentElement.clientWidth;
canvas.height = h;
canvas.width = w;

// colours and lines
ctx.fillStyle = COLOR_BG;
ctx.strokeStyle = COLOR_CUBE;
ctx.lineWidth = w / 100;
// ctx.lineCap = "round";

// cube parameters
var cx = w / 2;
var cy = h / 2;
var cz = 0;
var size = (h * sizeFactor) / 4;
if (SHAPE == 1) {
  var vertices = [
    new POINT3D(cx - size, cy - size, cz - size),
    new POINT3D(cx + size, cy - size, cz - size),
    new POINT3D(cx + size, cy + size, cz - size),
    new POINT3D(cx - size, cy + size, cz - size),
    new POINT3D(cx - size, cy - size, cz + size),
    new POINT3D(cx + size, cy - size, cz + size),
    new POINT3D(cx + size, cy + size, cz + size),
    new POINT3D(cx - size, cy + size, cz + size),
  ];
} else if (SHAPE == 2) {
  var vertices = [
    new POINT3D(
      cx - random() * size,
      cy - random() * size,
      cz - random() * size
    ),
    new POINT3D(
      cx + random() * size,
      cy - random() * size,
      cz - random() * size
    ),
    new POINT3D(
      cx + random() * size,
      cy + random() * size,
      cz - random() * size
    ),
    new POINT3D(
      cx - random() * size,
      cy + random() * size,
      cz - random() * size
    ),
    new POINT3D(
      cx - random() * size,
      cy - random() * size,
      cz + random() * size
    ),
    new POINT3D(
      cx + random() * size,
      cy - random() * size,
      cz + random() * size
    ),
    new POINT3D(
      cx + random() * size,
      cy + random() * size,
      cz + random() * size
    ),
    new POINT3D(
      cx - random() * size,
      cy + random() * size,
      cz + random() * size
    ),
  ];
}

if ((SHAPE == 1)||(SHAPE == 2)) {
  var edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0], // back face
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 4], // front face
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7], // connecting sides
  ];
} else if (SHAPE==3) {
  var vertices = [];
  var edges=[];
  for (var i = 0; i < edgeCount; i++) {
    var angle = i * (2*Math.PI / edgeCount);
    vertices.push( new POINT3D(cx,
                               cy + (size * Math.sin(angle)),
                               cz + (size * Math.cos(angle))));

    edges.push([i,(i+1)%edgeCount]);
  }
  // var vertices = Array.apply(null, Array(18))
  //   .map(function(x, i) {
  //     return new POINT3D(0,
  //                       sin(i * Math.PI / 180 / (360 / i)) * size,
  //                       cos(i * Math.PI / 180 / (360 / i)) * size));
  //   });
  //
  //
  // var edges = Array. apply(null, Array(18))
  // .map(function(x, i)) {
  //   return [i, (i+1)%18];
  // });
  if (debugFlag){
  console.log(vertices);
  console.log(edges);
}};

// set up the animation loop
var timeDelta,
  timeLast = 0;
ctx.fillRect(0, 0, w, h);
var colors = [];
for (let index = 0; index < edges.length; index++) {
  var redComponent = Math.round(255 * random());
  var greenComponent = Math.round(255 * random());
  var blueComponent = Math.round(255 * random());
  colors.push(`rgb(${redComponent},${greenComponent},${blueComponent})`);
}
requestAnimationFrame(loop);

function loop(timeNow) {
  // calculate the time difference
  timeDelta = timeNow - timeLast;
  timeLast = timeNow;

  // background
  if (overlay == 0) {
    ctx.fillRect(0, 0, w, h);
  }
  // rotate the cube along the z axis
  let angle = timeDelta * 0.001 * SPEED_Z * Math.PI * 2;
  for (let v of vertices) {
    let dx = v.x - cx;
    let dy = v.y - cy;
    let x = dx * Math.cos(angle) - dy * Math.sin(angle);
    let y = dx * Math.sin(angle) + dy * Math.cos(angle);
    v.x = x + cx;
    v.y = y + cy;
  }

  // rotate the cube along the x axis
  angle = timeDelta * 0.001 * SPEED_X * Math.PI * 2;
  for (let v of vertices) {
    let dy = v.y - cy;
    let dz = v.z - cz;
    let y = dy * Math.cos(angle) - dz * Math.sin(angle);
    let z = dy * Math.sin(angle) + dz * Math.cos(angle);
    v.y = y + cy;
    v.z = z + cz;
  }

  // rotate the cube along the y axis
  angle = timeDelta * 0.001 * SPEED_Y * Math.PI * 2;
  for (let v of vertices) {
    let dx = v.x - cx;
    let dz = v.z - cz;
    let x = dz * Math.sin(angle) + dx * Math.cos(angle);
    let z = dz * Math.cos(angle) - dx * Math.sin(angle);
    v.x = x + cx;
    v.z = z + cz;
  }

  // draw each edge
  for (let ind = 0; ind < edges.length; ind++) {
    var edge = edges[ind];
    if (UseColor == 1) {
      ctx.strokeStyle = colors[ind];
    }
    ctx.beginPath();
    if (dots == 0) {
      ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
      ctx.lineTo(vertices[edge[1]].x, vertices[edge[1]].y);
    } else {
      ctx.moveTo(vertices[edge[0]].x, vertices[edge[0]].y);
      ctx.lineTo(vertices[edge[0]].x, vertices[edge[0]].y);
    }
    ctx.stroke();
  }

  // call the next frame
  requestAnimationFrame(loop);
}
