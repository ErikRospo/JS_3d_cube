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
var canvas = document.createElement("canvas");
