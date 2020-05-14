import "./style.css"

const element = document.getElementById("canvas")
let canvas = element.getContext("2d")

const radiusRange = [100, 150]
// const velocityRange = [0.2, 0.8]
const velocityRange = [0.04, 0.16]
const totalCircles = 150

let circles = []

class Circle {
	constructor() {
		this.position = [random(innerWidth), random(innerHeight)]
		this.velocity = [random(...velocityRange, true), random(...velocityRange, true)]
		this.radius = random(...radiusRange)
		this.fill = `hsl(${random(15, 345)}, 100%, 50%)`
		this.hue = random(15, 345)
		this.hueVelocity = random(0.08, 0.16, true)
	}

	render() {
		this.position[0] += this.velocity[0]
		this.position[1] += this.velocity[1]

		if (this.position[0] > innerWidth + this.radius) {
			this.position[0] = 0 - this.radius
		}

		if (this.position[0] < 0 - this.radius) {
			this.position[0] = innerWidth + this.radius
		}

		if (this.position[1] > innerHeight + this.radius) {
			this.position[1] = 0 - this.radius
		}

		if (this.position[1] < 0 - this.radius) {
			this.position[1] = innerHeight + this.radius
		}

		this.hue += this.hueVelocity
		if (this.hue > 360) this.hue = 0
		if (this.hue < 0) this.hue = 360

		canvas.fillStyle = `hsl(${this.hue}, 100%, 50%)`
		canvas.beginPath()
		canvas.arc(this.position[0], this.position[1], this.radius, 0, 2 * Math.PI)
		canvas.fill()
		canvas.closePath()
	}
}

for (let i = 0; i < totalCircles; i++) {
	circles.push(new Circle())
}

const render = () => {
	canvas.clearRect(0, 0, innerWidth, innerHeight)
	canvas.globalCompositeOperation = "hard-light" // xor, hard-light, luminosity
	circles.forEach(circle => circle.render())
	requestAnimationFrame(render)
}
render()

function random(a, b, mirror) {
	if (b === undefined) {
		b = a
		a = 0
	}
	let factor = 1
	if (mirror) {
		factor = Math.floor(random(2)) * 2 - 1
	}
	return (a + Math.random() * (b - a)) * factor
}

function resize() {
	const dpr = devicePixelRatio || 1
	element.style.width = `${innerWidth}px`
	element.style.height = `${innerHeight}px`
	element.width = innerWidth * dpr
	element.height = innerHeight * dpr
	canvas.scale(dpr, dpr)
}

window.onresize = resize
resize()
