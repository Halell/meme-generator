'use strict'
console.log('service is up')

var gAppState = {
    isMouseDown: false,
    selectedImageId: null
}
var gElCanvas
var gCtx

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    resizeCanvas()
    renderPage()
}



function onImageClick(id) {

    var images = Array.from(document.images)
    var img = images[images.findIndex(item => item.dataset.name === id)]
    gAppState.selectedImageId = img
    drawImgOnCanvas(img)
}

function renderPage() {
    drawImgOnCanvas(gAppState.selectedImageId)
}

function drawImgOnCanvas(img) {
    if (!img) return
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height) //img,x,y,xend,yend
}


function drawText(txt, x, y) {
    // gCtx.font = '48px serif';
    // gCtx.fillText(txt, x, y);
    gCtx.textBaseline = 'middle'
    gCtx.textAlign = 'center'
    // gCtx.lineWidth = 2;
    gCtx.fillStyle = 'white'
    gCtx.font = '50px Impact'
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = 'black'
    gCtx.strokeText(txt, x, y)
}

function onTextChange(val) {
    onClearText()
    drawText(val, gElCanvas.width / 2, gElCanvas.height / 5)
}


function onClearText() {
    gCtx = gElCanvas.getContext("2d")
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    gCtx.beginPath()
    renderPage()
}


















function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        // resizeCanvas()
        renderPage()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 7
    gElCanvas.height = elContainer.offsetWidth
}

function onMove(ev) {
    if (!gAppState.isMouseDown) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    drawShape(dx, dy)
    gStartPos = pos
}


function onDown(ev) {
    const pos = getEvPos(ev)
    gStartPos = pos
    setIsMouseDown(true)

}

function onUp() {
    setIsMouseDown(false)

}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }

    return pos
}

function toggleMenu() {
    document.body.classList.toggle("menu-open")
}