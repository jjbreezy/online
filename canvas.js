// test and reference
//console.log('hello canvas');
var canvas = document.querySelector('canvas');
// console.log(canvas);

// fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// console.log('fullscreen baby');

// context variable
var c =canvas.getContext('2d');

// // rectangles
// c.fillStyle = 'rgba(255,0,0,0.25)';
// c.fillRect( 100, 100, 100, 100);
// c.fillStyle = 'rgba(255,0,0,0.5)';
// c.fillRect( 200, 200, 100, 100);
// c.fillStyle = 'rgba(255,0,0,0.75)';
// c.fillRect( 300, 300, 100, 100);
// c.fillStyle = 'rgba(255,0,0,1)';
// c.fillRect( 400, 400, 100, 100);

// Lines
// c.beginPath();
// c.moveTo(100,400);
// c.lineTo(300,200);
// c.lineTo(400,300);
// c.strokeStyle = 'rgba(255,0,0,0.5)';
// c.stroke();

// Arcs
// c.beginPath();
// c.arc(300,300,30,0,Math.PI*2,false)
// c.strokeStyle = 'blue';
// c.stroke();

// creating multiple circles using a for loop
// for (var i = 0; i < 5; i++) {
// 	var x = Math.random()*window.innerWidth;
// 	var y = Math.random()*window.innerHeight; 
// 	c.beginPath();
// 	c.arc(x,y,30,0,Math.PI*2,false)
// 	c.strokeStyle = 'green';
// 	c.stroke();
// }


// object oriented JS
function Circle(x,y,dx,dy,cradius) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.cradius = cradius;


	this.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)

	this.draw = function() {
		// circle
		c.beginPath();
		c.arc(this.x, this.y, this.cradius,0,Math.PI*2,false);
		c.fillStyle = this.color;
		c.fill();
	}

	this.drawshadow = function() {
		// gradient boy
		var grd = c.createRadialGradient(this.x, this.y, cradius/6, this.x +15, this.y +15, cradius);
		grd.addColorStop(0, "black");
		grd.addColorStop(1, "rgba(0,0,0,0.001)");


		// circle
		c.beginPath();
		c.arc(this.x +5, this.y +5, this.cradius,0,Math.PI*2,false);
		c.fillStyle = grd;
		c.fill();
	}
	
	this.drawhighlight = function() {
		// gradient boy
		var grd = c.createRadialGradient(this.x, this.y, cradius/6, this.x, this.y, cradius);
		grd.addColorStop(0, "rgba(255,255,255,0.001)");
		grd.addColorStop(1, "white");
		grd.addColorStop(0, "rgba(255,255,255,0.001)");


		// circle
		c.beginPath();
		c.arc(this.x -15, this.y -15, this.cradius/3,0,Math.PI*2,false);
		c.fillStyle = grd;
		c.fill();
	}

	this.update=function() {
		// collision
		if (this.x + cradius> innerWidth || this.x - this.cradius < 0) {
			this.dx = -this.dx;
		}

		if (this.y + cradius> innerHeight || this.y - this.cradius < 0) {
			this.dy = -this.dy;
		}

		// velocity
		this.x += this.dx;
		this.y += this.dy;

		this.drawshadow();
		this.draw();
		// console.log('circle updated')
	}
	//console.log('circle instantiated');
}



// for loop to instantiate multiple circles
var circleArray = [];

for (var i = 0; i < 10; i++) {
	// variables
	var x = Math.random()*innerWidth;
	var y = Math.random()*innerHeight;

	var dx = (Math.random()-0.5)*6;
	var dy = (Math.random()-0.5)*6; 

	var cradius = 45;

	// put everything into the array. 
	circleArray.push(new Circle(x, y, dx, dy, cradius));
}

console.log(circleArray);

// // instantiate the circle
// var circle = new Circle(300,300,3,3,45);

//animation function 
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);

	// animate every circle
	for (var i = 0; i < circleArray.length; i++) {
		circleArray[i].update();
	}

	//console.log('animation updating');

}

animate();

console.log('finish');
