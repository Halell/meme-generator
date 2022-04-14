'use strict'
console.log('service is up')


// ----------------------vars-------------------//

var gAppState = {
    isMouseDown: false,
    selectedImgId: null,
    savedText() {
        return getSavedTxt()
    },
    txtPos() {
        return getCuurTxtPos()
    },
    filColor: 'white',
    strokeColor: 'black',
    textAlign: 'center'
}
var gIntervalFocus
var gElCanvas
var gCtx


function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderPics()
    resizeCanvas()
    renderCanvas()
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
    var pos = [0, 0]
    var drawImage = gCtx.drawImage
    setNewCanvasObj('img', drawImage, img, pos)
    gAppState.selectedImgId = img
    drawImgOnCanvas(img)
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

function drawText(txt, x, y, fil, outLine) {
    // gCtx.beginPath()
    // debugger
    gCtx.lineWidth = 2.5
    gCtx.textBaseline = 'top'
    gCtx.textAlign = gAppState.textAlign
    gCtx.fillStyle = fil
    gCtx.font = '50px Impact'
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = outLine
    gCtx.strokeText(txt, x, y)
}

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

function startMarkerFocus(cuurFocusPos) {
    var isDrown = false
    var color = 'black'
    var x = (gElCanvas.width / 2) + 5
    var y = gElCanvas.height * cuurFocusPos
    gIntervalFocus = setInterval(() => {
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

function renderCanvas() {
    drawImgOnCanvas(gAppState.selectedImgId)
    gAppState.savedText().forEach(str => {
        drawText(str[0], gElCanvas.width / 2, gElCanvas.height * str[1], gAppState.filColor, gAppState.strokeColor)
    })
}

function drawImgOnCanvas(img) {
    if (!img) return
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

// --------------Menage MEME text-------------------//

function onTextChange(val) {
    var elText = getTextEL()
    saveCuurText(elText.value, gAppState)
    onClearText()
    var focusTxtPos = getCuurFocus()
    drawText(val, gElCanvas.width / 2, gElCanvas.height * focusTxtPos, gAppState.filColor, gAppState.strokeColor)
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

function onTxtFocus() {
    // debugger
    var elText = getTextEL()
    saveCuurText(elText.value)
    onTextChange(elText.value)
    startMarkerFocus(gAppState.txtPos())
}

function onTxtOutFocus() {
    var elText = getTextEL()
    saveCuurText(elText.value)
    gIntervalFocus = clearInterval(gIntervalFocus)
    onClearText()
}

function getTextEL() {
    return document.querySelector("input[name='meme-text']")
}

// ---------detect movement and clicks on canvas----------//

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

function isTxtClick(x, y) {
    var txtWidths = getTxtsWidth()
    txtWidths.find(strWidth => {
        strWidth
    })

}




