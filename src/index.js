import "./style.css"

const offset = 8
const rotation = 6

const fuzz = n => Math.random() * n - n / 2

const bumpLink = link => {
	link.style.left = `${fuzz(offset)}px`
	link.style.top = `${fuzz(offset)}px`
	let a = link.querySelector("a")
	a.style.transform = `rotate(${fuzz(rotation)}deg)`
}

document.querySelectorAll(".link").forEach(link => {
	bumpLink(link)
})
