import "./style.css"

const element = document.getElementById("canvas")
let canvas = element.getContext("2d")

const blur = 8
const shrink = 20
const fps = 10
const totalCircles = 50

const radiusRange = [150 / shrink, 250 / shrink]
const velocityRange = [15 / shrink / fps, 30 / shrink / fps]
const hueRange = [15, 345]
const hueVelocityRange = [4 / fps, 8 / fps]

element.style.transform = `translate(-50%, -50%) scale(${shrink + 2})`
element.style.filter = `blur(${blur}px) contrast(0.5) saturate(0.7) brightness(1.8)`

const mouseDeltaFactor = 0.15
let mouseLast = null
let mouseStopTimer = null
let mouseDelta = 0

const isMobileOrTablet = checkMobileOrTablet()

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

window.onmouseout = event => {
	if (event.target == element) {
		mouseLast = null
	}
}

document.addEventListener("mousewheel", event => {
	if (event.ctrlKey == true) {
		event.preventDefault()
	}
}, {
	passive: false
})

document.addEventListener("keydown", event => {
	if (event.ctrlKey && [61, 107, 173, 109, 187, 189].includes(event.which)) {
		event.preventDefault()
	}
})

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

function render() {
	const now = Date.now()
	// todo: scale stuff over time
	canvas.clearRect(0, 0, innerWidth, innerHeight)
	circles.forEach(circle => circle.render(1 + mouseDelta * mouseDeltaFactor))
}

render()
if (!isMobileOrTablet) {
	setInterval(render, 1000 / fps)
}

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

	if (isMobileOrTablet) {
		render()
	}
}

window.onresize = resize
resize()

function checkMobileOrTablet() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera)
  return check
}
