'use strict'
console.log('service is up')


// ----------------------vars-------------------//

var gAppState = {
    isMouseDown: false,
    isDrag: false,
    currFocusedObj: null,
    canvasWidth: null,
    canvasHeight: null,
    strokeColor: 'black',
    textAlign: 'center',
    fillStyle: 'white',
    strokeStyle: 'black',
    font: 'Impact',
    setFontSize: 10,

    fontSize() {
        return gElCanvas.width / this.setFontSize
    },
    textAlign: 'center'
}

var gIntervalFocusMark
var gElCanvas
var gCtx
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderPics()
}

// ------------page render and listeners----------------//

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

function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
    })
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 7
    gElCanvas.height = elContainer.offsetWidth

    correctMeasures(gAppState.canvasWidth, gElCanvas.width)

    gAppState.canvasWidth = gElCanvas.width
    gAppState.canvasHeight = gElCanvas.height

    renderCanvas()
}

function toggleMenu() {
    document.body.classList.toggle("menu-open")
}

function renderPics() {
    var strHtml = ''
    getGimages().map(img => {
        strHtml += `<div class="card" data-name="${img.id}" onclick="onImgClick(this.dataset.name)">
        <img src="${img.imgSrc}" alt="" class="card-image" data-name="${img.id}" />
    </div>`
    })
    document.querySelector('.images-gallery-container').innerHTML = strHtml
}


// ------------------- On clicks--------------------//

function onSetColor(color) {
    gAppState.filColor = color
    console.log(color)
}

function onImgClick(id) {
    renderEditDisplay()
    var images = Array.from(document.images)
    var img = images[images.findIndex(item => item.dataset.name === id)]
    setNewCanvasObj('img', drawImg, img, 0, 0)
    creatTextObj(gAppState.canvasHeight / 5, gAppState)
    renderCanvas()
}

function getSize(divider) {
    return gElCanvas.width / divider
}

function renderCanvas() {

    getModel().forEach(obj => {
        obj.method()
    })

}

function renderEditDisplay() {
    document.querySelector('.edit-image').style.display = 'block'
    document.querySelector('.images-gallery-container').style.display = 'none'
    resizeCanvas()
}

function onGalleryClick() {
    document.querySelector('.images-gallery-container').style.display = 'grid'
    document.querySelector('.edit-image').style.display = 'none'

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
            console.log('Got back live url:', url)
            onSuccess(url)
        })
        .catch((err) => {
            console.error(err)
        })
}

function outFunc() {
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

// function drawText(txt, x, y, fil, outLine) {
//     gCtx.beginPath()
//     gCtx.lineWidth = gElCanvas.height / 170
//     gCtx.textBaseline = 'top'
//     gCtx.textAlign = gAppState.textAlign
//     gCtx.fillStyle = fil
//     gCtx.font = `${gElCanvas.height / 10}px Impact`
//     gCtx.fillText(txt, x, y)
//     gCtx.strokeStyle = outLine
//     gCtx.strokeText(txt, x, y)
// }

function drawLine(x, y, xEnd, yEnd, color) {
    gCtx.beginPath()
    gCtx.lineWidth = 4
    gCtx.strokeStyle = color
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.stroke()
}

function DrawFocusMarker(txt, pos) {
    drawLine(40, 15, 40, 100, 'green')
}

// function renderCanvas() {
//     drawImgOnCanvas(gAppState.selectedImgId)
//     gAppState.savedText().forEach(str => {
//         drawText(str[0], gElCanvas.width / 2, gElCanvas.height * str[1], gAppState.filColor, gAppState.strokeColor)
//     })
// }

// function drawImgOnCanvas(img) {
//     if (!img) return
//     gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
// }
function startMarkerFocus(cuurFocusPos) {
    var isDrown = false
    var color = 'black'
    var x = (gElCanvas.width / 2) + 5
    var y = gElCanvas.height * cuurFocusPos
    gIntervalFocusMark = setInterval(() => {
        if (!isDrown) {
            color = (color === 'black') ? 'white' : 'black'
            // gCtx.strokeStyle = color
            var cuurTxtWidth = gCtx.measureText((getTextEL().value)).width
            drawLine(x + (cuurTxtWidth / 2), y, x + (cuurTxtWidth / 2), y + 50, color)
        } else {
            var cuurTxtVal = getTextEL().value
            onTextChange(cuurTxtVal)
        }
        isDrown = (isDrown) ? false : true

    }, 350)

}


// --------------Menage MEME text-------------------//


function onTextChange(val) {
    updateModel(gAppState.currFocusedObj, 'body', val)
    renderCanvas()
    // var elText = getTextEL()
    // saveCuurText(elText.value, gAppState)
    // onClearText()
    // var focusTxtPos = getCuurFocus()
    // drawText(val, gElCanvas.width / 2, gElCanvas.height * focusTxtPos, gAppState.filColor, gAppState.strokeColor)
}

function onTxtFocus() {

    gAppState.currFocusedObj = setFocusObj('name', 'text')
    // console.log('txtFocus')
    // var elText = getTextEL()
    // saveCuurText(elText.value)
    // onTextChange(elText.value)
    // startMarkerFocus(gAppState.txtPos())
}

function onTxtOutFocus() {
    if (!gAppState.isMouseDown) gAppState.currFocusedObj = null // in case of mov from focos becos clik on canvvas that triger moovment 


    // var elText = getTextEL()
    // saveCuurText(elText.value)
    // gIntervalFocusMark = clearInterval(gIntervalFocusMark)
    // onClearText()
}

function getTextEL() {
    return document.querySelector("input[name='meme-text']")
}

function onClearText(isClicked) {
    if (isClicked) {
        getTextEL().value = ''
        getTextEL().focus()
    }
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderCanvas()
}


function onSwitchText() {
    var elText = getTextEL()
    saveCuurText(elText.value)
    var focusText = switchFocus().textInFocus
    elText.value = focusText
    onTextChange(focusText)
    elText.focus()
}





// ---------detect movement and clicks on canvas----------//

function onMove(ev) {
    console.log('in moov')
    if (!gAppState.isMouseDown || !gAppState.isDrag) return
    console.log('moov')
    const pos = getEvPos(ev)
    console.log(gAppState.currFocusedObj)
    // debugger
    updateModel(gAppState.currFocusedObj, 'x', pos.x)
    updateModel(gAppState.currFocusedObj, 'y', pos.y)
    renderCanvas()
    // const dx = pos.x - gStartPos.x
    // const dy = pos.y - gStartPos.y
    // drawShape(dx, dy)
    // gStartPos = pos
}

function onDown(ev) {
    const pos = getEvPos(ev)
    var objInFocusIdx = isObjClicked(pos)
    console.log(objInFocusIdx)
    if (objInFocusIdx >= 0) {
        console.log('in and the ide is ', objInFocusIdx)
        gAppState.currFocusedObj = objInFocusIdx
        console.log(gAppState.currFocusedObj)
        gAppState.isDrag = true
    }
    console.log('out of doun')
    gAppState.isMouseDown = true
}

function onUp() {
    gAppState.isMouseDown = false
    gAppState.isDrag = false
    console.log('up')

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




