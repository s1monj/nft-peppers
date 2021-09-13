var mySvg; 

function preload(){
	mySvg = loadImage("p1.svg");
    mySvg2 = loadImage("p1b.svg");
}

function setup() {
  createCanvas(600, 600);
}

function draw() {

  translate(width / 2, height / 2);
  rotate(PI / 180 * 45);
  imageMode(CENTER);
  image(mySvg,0,0,500,500);
  tint(1, 50, 32)

  
  
  imageMode(CENTER);
  image(mySvg2,0,0,510,510);
  tint(50, 1, 1)

}