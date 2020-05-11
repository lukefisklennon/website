import rough from "./rough"

const updateInterval = 150

const element = document.getElementById("canvas")
const canvas = element.getContext("2d")
const rc = rough.canvas(element)

setInterval(() => {
	canvas.clearRect(0, 0, innerWidth, innerHeight)
	rc.rectangle(10, 10, 200, 200, {stroke: isDark() ? "white" : "black"})
}, updateInterval)

const resize = () => {
	const dpr = devicePixelRatio || 1
	element.style.width = `${innerWidth}px`
	element.style.height = `${innerHeight}px`
	element.width = innerWidth * dpr
	element.height = innerHeight * dpr
	canvas.scale(dpr, dpr)
}

window.onresize = resize
resize()

function isDark() {
  for (var i = 0; i < document.styleSheets.length; i++) {
    var classes = document.styleSheets[i].rules || document.styleSheets[i].cssRules
    for (var x = 0; x < classes.length; x++) {
      var cssText = classes[x].cssText || classes[x].style.cssText
      if (cssText.includes("rgb(36, 39, 41)")) {
        return true
      }
    }
  }
  return false
}
