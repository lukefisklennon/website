import "./style.css"

const element = document.getElementById("canvas")
let canvas = element.getContext("2d")

const blur = 7
const shrink = 20
const fps = 10
const totalCircles = 50

const radiusRange = [150 / shrink, 250 / shrink]
const velocityRange = [15 / shrink / fps, 30 / shrink / fps]
const hueRange = [15, 345]
const hueVelocityRange = [4 / fps, 8 / fps]

element.style.transform = `translate(-50%, -50%) scale(${shrink + 2})`
element.style.filter = `blur(${blur}px) contrast(0.5) saturate(0.7) brightness(1.8)`

const mouseDeltaFactor = 0.2
let mouseLast = null
let mouseStopTimer = null
let mouseDelta = 0

window.onmousemove = event => {
	if (mouseLast) {
		mouseDelta = Math.sqrt((event.clientX - mouseLast[0]) ** 2 + (event.clientY - mouseLast[1]) ** 2)
	} else {
		mouseDelta = 0
	}
	mouseLast = [event.clientX, event.clientY]
	clearTimeout(mouseStopTimer)
	mouseStopTimer = setTimeout(() => {
		mouseDelta = 0
	}, 50)
}

let circles = []

class Circle {
	constructor() {
		this.position = [random(innerWidth / shrink), random(innerHeight / shrink)]
		this.velocity = [random(...velocityRange, true), random(...velocityRange, true)]
		this.radius = random(...radiusRange)
		this.hue = random(...hueRange)
		this.hueVelocity = random(...hueVelocityRange, true)
	}

	render(delta) {
		this.position[0] += this.velocity[0] * delta
		this.position[1] += this.velocity[1] * delta

		if (this.position[0] > innerWidth / shrink + this.radius) {
			this.position[0] = 0 - this.radius
		}

		if (this.position[0] < 0 - this.radius) {
			this.position[0] = innerWidth / shrink + this.radius
		}

		if (this.position[1] > innerHeight / shrink + this.radius) {
			this.position[1] = 0 - this.radius
		}

		if (this.position[1] < 0 - this.radius) {
			this.position[1] = innerHeight / shrink + this.radius
		}

		this.hue += this.hueVelocity * delta
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

setInterval(() => {
	// todo: scale stuff over time
	canvas.globalCompositeOperation = "source-over" // xor, hard-light, luminosity
	canvas.clearRect(0, 0, innerWidth, innerHeight)
	canvas.globalCompositeOperation = "hard-light" // xor, hard-light, luminosity
	circles.forEach(circle => circle.render(1 + mouseDelta * mouseDeltaFactor))
}, 1000 / fps)

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
	const dpr = 1//devicePixelRatio || 1
	element.style.width = `${innerWidth / shrink}px`
	element.style.height = `${innerHeight / shrink}px`
	element.width = innerWidth / shrink * dpr
	element.height = innerHeight / shrink * dpr
	canvas.scale(dpr, dpr)
}

window.onresize = resize
resize()
