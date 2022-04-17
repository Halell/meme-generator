'use strict'



// ----------------------vars-------------------//

var gAppState = {
    isMouseDown: false,
    isDrag: false,
    isTextFocus: false,
    isTextInputFucus: false,
    moveStartPos: null,
    focus: null,
    lastInFocus: null,
    canvasWidth: null,
    canvasHeight: null,
    strokeColor: 'black',
    textAlign: 'center',
    fillStyle: 'white',
    strokeStyle: 'black',
    font: 'Impact',
    setFontSize: 10,
    intervalFocusMark: null,
    fontSize() {
        return gElCanvas.width / this.setFontSize
    },
    textAlign: 'center'
}


var gElCanvas
var gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderPics()
    renderTags()
}

// ------------page render and listeners----------------//

function renderPics() {
    var strHtml = ''
    getGimages().map(img => {
        strHtml += `<div class="card" data-name="${img.id}" onclick="onImgClick(this.dataset.name)">
        <img src="${img.imgSrc}" alt="" class="card-image" data-name="${img.id}" />
    </div>`
    })
    document.querySelector('.images-gallery-container').innerHTML = strHtml
}

function renderTags() {
    var strHtml = ''
    getTags().forEach((tag, idx) => {
        if (idx < 4) strHtml += `<li><a href="#">${tag}</a></li>
        `
    })
    document.querySelector('.select-image-filter-by-word').innerHTML = strHtml
}

function renderCanvas() {

    getModel().forEach(obj => {
        obj.method()
    })

}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
    var textHeight = gElCanvas.height / 10
    document.querySelector('.btn-add-text').addEventListener('click', () => {
        onAddText(textHeight)
        textHeight += gElCanvas.height / 10
        if (textHeight > gElCanvas.height) textHeight = 10
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

    scaleMeasurements(gAppState.canvasWidth, gElCanvas.width)

    gAppState.canvasWidth = gElCanvas.width
    gAppState.canvasHeight = gElCanvas.height

    renderCanvas()
}

function toggleMenu() {
    document.body.classList.toggle("menu-open")
}

// ------------------- On clicks--------------------//

function onSetColor(color) {
    if (gAppState.focus) {
        updateModel(gAppState.focus, 'fillStyle', color)

    }
    gAppState.fillStyle = color
    renderCanvas()
}

function onFontChange(font) {
    if (gAppState.focus) {
        updateModel(gAppState.focus, 'font', font)
    }
    gAppState.font = font
    renderCanvas()
}

function onImgClick(id) {
    renderEditDisplay()
    var images = Array.from(document.images)
    var img = images[images.findIndex(item => item.dataset.name === id)]
    setNewCanvasObj('img', drawImg, img, 0, 0)
    renderCanvas()
}

function renderEditDisplay() {
    document.querySelector('.edit-image').style.display = 'block'
    document.querySelector('.select-image').style.display = 'none'
    resizeCanvas()
}

function onGalleryClick() {
    document.querySelector('.select-image').style.display = 'grid'
    document.querySelector('.edit-image').style.display = 'none'
    clearCanvas()
}

function onDownload(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'water.jpg'
}

// --Copy btn--
function onShareLink() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")

    function onSuccess(uploadedImgUrl) {
        navigator.clipboard.writeText(uploadedImgUrl)
        var tooltip = document.querySelector(".btn-copy-url-tooltiptext")
        tooltip.innerHTML = "Copied: "
    }
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData()
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(res => res.text())
        .then((url) => {
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function onOutCopyBtn() {
    var tooltip = document.querySelector(".btn-copy-url-tooltiptext")
    tooltip.innerHTML = "Copy to clipboard"
}

// ---------------canvas draw && render-----------------//

function drawText() {
    gCtx.beginPath()
    gCtx.lineWidth = gElCanvas.height / 170
    gCtx.textBaseline = 'top'
    gCtx.textAlign = this.textAlign
    gCtx.fillStyle = this.fillStyle
    gCtx.font = `${this.fontSize}px ${this.font}`
    gCtx.fillText(this.body, this.x, this.y)
    gCtx.strokeStyle = this.strokeStyle
    gCtx.strokeText(this.body, this.x, this.y)
}

function drawImg() {
    gCtx.drawImage(this.body, 0, 0, gAppState.canvasWidth, gAppState.canvasHeight)
}

function drawLine(x, y, xEnd, yEnd, color) {
    gCtx.beginPath()
    gCtx.lineWidth = 4
    gCtx.strokeStyle = color
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.stroke()
}




// --------------Menage MEME text-------------------//

function startMarkerFocus() {
    if (gAppState.intervalFocusMark) return
    var isDrown = false
    var color = 'black'
    var charSize = gCtx.measureText('M').width
    var textMargin = charSize * 0.3
    gAppState.intervalFocusMark = setInterval(() => {
        var textPos = getCurrFocusObjPos(gAppState.focus, gCtx)
        if (!gAppState.isTextInputFucus) {
            renderCanvas()
            gCtx.textAlign = 'right'
            gCtx.fillStyle = 'pink'
            gCtx.fillText('→', textPos.startX, textPos.startY + charSize / 2 + textMargin,)
            gCtx.textAlign = 'left'
            gCtx.fillText('←', textPos.endX, textPos.startY + charSize / 2 + textMargin,)
            gCtx.textAlign = 'center'
            gCtx.fillStyle = 'white'
        }
        else if (!isDrown) {
            color = (color === 'black') ? 'white' : 'black'
            drawLine(textPos.endX, textPos.startY + 15, textPos.endX, textPos.endY, color)
        } else {
            renderCanvas()
        }
        isDrown = (isDrown) ? false : true
    }, 350)
}

function onTextChange(val) {
    updateModel(gAppState.focus, 'body', val)
    renderCanvas()
}

function onTxtFocus() {
    startMarkerFocus()
    gAppState.isTextInputFucus = true
}

function onTxtOutFocus() {
    console.log('focus out')
    gAppState.isTextFocus = false
    // gAppState.intervalFocusMark = clearInterval(gAppState.intervalFocusMark)
    // renderCanvas()
    if (!getTextEL().value) checkIfEmpty()
    getTextEL().value = ''
    gAppState.isTextInputFucus = false
}

function onKeyDownText(ev) {
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') ev.preventDefault()
}

function getTextEL() {
    return document.querySelector("input[name='meme-text']")
}

function onAddText(height) {
    creatTextObj(height, gAppState)
    gAppState.focus = getModelLastIdx()
    getTextEL().focus()
}

// ---------detect movement and clicks on canvas----------//

function onMove(ev) {
    if (!gAppState.isMouseDown || !gAppState.isDrag) return
    const pos = getEvPos(ev)
    const actualPos = getActualPos(gAppState.focus)
    const x = actualPos.x + (pos.x - gAppState.moveStartPos.x)
    const y = actualPos.y + (pos.y - gAppState.moveStartPos.y)
    gAppState.moveStartPos = pos
    updateModel(gAppState.focus, 'x', x)
    updateModel(gAppState.focus, 'y', y)
    renderCanvas()
}

function onDown(ev) {
    console.log('on down')
    const pos = getEvPos(ev)
    var objInFocusIdx = isObjClicked(pos)

    if (objInFocusIdx >= 0) { // click on obj === true
        console.log('on down in text')
        gAppState.focus = objInFocusIdx
        gAppState.isDrag = true
        gAppState.moveStartPos = { x: pos.x, y: pos.y }
        if (isTextObj(gAppState.focus)) {
            gAppState.isTextFocus = true
        }
    } else {
        gAppState.intervalFocusMark = clearInterval(gAppState.intervalFocusMark)
        renderCanvas()
        gAppState.focus = null
        gAppState.isTextFocus = false
    }
    gAppState.isMouseDown = true
}

function onUp() {
    console.log('on up')
    gAppState.isMouseDown = false
    gAppState.isDrag = false
    if (gAppState.focus && isTextObj(gAppState.focus)) {
        getTextEL().value = getObjBody(gAppState.focus)
        getTextEL().focus()
    }
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

function isObjClicked(pos) {
    return getObjInRange(pos, gCtx)
}




