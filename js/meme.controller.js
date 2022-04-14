'use strict'
console.log('service is up')

var gAppState = {
    isMouseDown: false,
    selectedImgId: null,
    savedText() {
        return getSavedTxt()
    },
    txtPos() {
        return getCuurTxtPos()
    }
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
    renderPage()
}

function renderPics() {
    var strHtml = ''
    getGimages().map(img => {
        strHtml += `<div class="card" data-name="${img.id}" onclick="onImageClick(this.dataset.name)">
        <img src="${img.imgSrc}" alt="" class="card-image" data-name="${img.id}" />
    </div>`
    })
    document.querySelector('.images-gallery-container').innerHTML = strHtml

}
// name
function onImageClick(id) {
    renderEditDisplay()
    var images = Array.from(document.images)
    var img = images[images.findIndex(item => item.dataset.name === id)]
    gAppState.selectedImgId = img
    drawImgOnCanvas(img)
}

function onGalleryClick() {
    document.querySelector('.images-gallery-container').style.display = 'grid'
    document.querySelector('.edit-image').style.display = 'none'

}

function renderEditDisplay() {
    document.querySelector('.edit-image').style.display = 'block'
    document.querySelector('.images-gallery-container').style.display = 'none'
    resizeCanvas()
}


function onDownload(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'water.jpg'

}





// --------------------------Copy to  clip board-------------------

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

// -------------------------------------------------------





function renderPage() {
    drawImgOnCanvas(gAppState.selectedImgId)
    gAppState.savedText().forEach(str => {
        drawText(str[0], gElCanvas.width / 2, gElCanvas.width * str[1])
    })
}

function drawImgOnCanvas(img) {
    if (!img) return
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}


function drawText(txt, x, y) {
    // gCtx.font = '48px serif';
    // gCtx.fillText(txt, x, y);
    gCtx.textBaseline = 'top'
    gCtx.textAlign = 'center'
    // gCtx.lineWidth = 2;
    gCtx.fillStyle = 'white'
    gCtx.font = '50px Impact'
    // console.log(gCtx.measureText(txt).width)
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = 'black'
    gCtx.strokeText(txt, x, y)

}



function onTextChange(val) {
    onClearText()
    var focusTxtPos = getCuurFocus()
    drawText(val, gElCanvas.width / 2, gElCanvas.height * focusTxtPos)
}


function onClearText(isClicked) {
    if (isClicked) {
        getTextEL().value = ''
        getTextEL().focus()
    }
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderPage()
}

function onSwitchText() {
    // debugger
    var elText = getTextEL()
    saveCuurText(elText.value)
    var focusText = switchFocus().textInFocus
    elText.value = focusText
    onTextChange(focusText)
    elText.focus()
}

function getTextEL() {
    return document.querySelector("input[name='meme-text']")
}


function DrawFocusMarker(txt, pos) {
    //    var endText gCtx.measureText(txt).width
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
            gCtx.strokeStyle = color
            var cuurTxtWidth = gCtx.measureText((getTextEL().value)).width
            drawLine(x + (cuurTxtWidth / 2), y, x + (cuurTxtWidth / 2), y + 50)
        } else {
            var cuurTxtVal = getTextEL().value
            onTextChange(cuurTxtVal)
        }
        isDrown = (isDrown) ? false : true

    }, 350)

}


function drawLine(x, y, xEnd, yEnd) {
    gCtx.beginPath()
    gCtx.lineWidth = 4
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.stroke()
}


function onTxtFocus() {
    // gAppState.txtPos()
    startMarkerFocus(gAppState.txtPos())
}
function onTxtOutFocus() {
    gIntervalFocus = clearInterval(gIntervalFocus)
    onClearText()
}



function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
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

