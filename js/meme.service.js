'use strict'

var gImages = [
    {
        id: 1,
        name: '1.jpg',
        imgSrc: `img/meme-imgs (square)/1.jpg`,
        category: 'funny'
    },
    {
        id: 2,
        imgSrc: `img/meme-imgs (square)/2.jpg`,
        category: 'funny'
    },
    {
        id: 3,
        imgSrc: `img/meme-imgs (square)/3.jpg`,
        category: 'funny'
    },
    {
        id: 4,
        imgSrc: `img/meme-imgs (square)/4.jpg`,
        category: 'funny'
    },
    {
        id: 5,
        imgSrc: `img/meme-imgs (square)/5.jpg`,
        category: 'funny'
    },
]

var gModel = []

var gMeme = {
    text: {
        textInFocus: 0,
        strings: ['', ''],
        positionHightDividers: [0.1, 0.8],
        textAligns: ['', '']
    },
}
// var gStartPos


function getModel() {
    return gModel
}



function switchFocus() {
    gMeme.text.textInFocus = (!gMeme.text.textInFocus) ? 1 : 0
    var textInFocus = gMeme.text.strings[gMeme.text.textInFocus]
    gMeme.text.strings[gMeme.text.textInFocus] = ''
    return { textInFocus, cuurFocusPos: gMeme.text.textInFocus }
}

function saveCuurText(str, appState) {
    gMeme.text.strings[gMeme.text.textInFocus] = str
    gMeme.text.textAligns[gMeme.text.textInFocus] = appState.textAligns
}
function getCuurFocus() {
    return gMeme.text.positionDividers[gMeme.text.textInFocus]
}

function getSavedTxt() {
    return gMeme.text.strings.map((str, idx) => {
        return [str, gMeme.text.positionHightDividers[idx]]
    })
}

function getCuurTxtPos() {
    return gMeme.text.positionDividers[gMeme.text.textInFocus]
}

function getGimages() {
    return gImages
}


function getTxtsWidth(ctx) {
    return gMeme.text.strings.map(str => {
        return Math.ceil(ctx.measureText(str))
    })
}

function setNewCanvasObj(name, method, body, x, y, fillStyle = 'white', strokeStyle = 'black', font = 'Impact', fontSize = '50px', textAlign = 'center') {
    gModel.push({
        name,
        method,
        body,
        x,
        y,
        fillStyle,
        strokeStyle,
        font,
        fontSize,
        textAlign,
        pos(ctx) { return getObjPos(this, ctx) }
    })
}

function correctMeasures(LastSize, currSize) {
    var changePercentage = currSize / LastSize
    gModel.forEach(obj => {
        obj.x *= changePercentage
        obj.y *= changePercentage
        obj.fontSize *= changePercentage
    })
}
function getObjPos(obj, ctx) {
    if (!obj.body) return
    var charSize = ctx.measureText('M').width
    var textMargin = charSize * 0.3
    var textWidth = ctx.measureText(obj.body).width + textMargin
    var textHeight = charSize + textMargin

    var pos = {
        startY: obj.y - textMargin,
        endY: obj.y + textHeight
    }
    if (obj.textAlign !== 'center') {
        if (obj.textAlign === 'left') {
            pos.startX = obj.x - textMargin
            pos.endX = obj.x + textWidth
        } else { // textAlign = right
            pos.startX = obj.x - textWidth
            pos.endX = obj.x + textMargin
        }
    } else {
        pos.startX = obj.x - (textWidth / 2)
        pos.endX = obj.x + (textWidth / 2)
    }
    return pos
}

function updateModel(idx, prop, val) {
    gModel[idx][prop] = val
}

function setFocusObj(prop, val, pos = null) {
    if (!pos) {
        return gModel.findIndex(obj => obj[prop] === val)
    }
}

function creatTextObj(y, appState) {
    var x = getPosX(appState)
    // console.log(x)
    setNewCanvasObj('text', drawText, '', x, y, appState.fillStyle, appState.strokeStyle, appState.font, appState.fontSize(), appState.textAlign)
}


function getPosX(appState) {
    var posX
    if (appState.textAlign !== 'center') {
        posX = (appState.textAlign === 'left') ? 10 : appState.canvasHeight - 10
    } else posX = appState.canvasHeight / 2
    return posX
}

function getObjInRange(pos, ctx) {
    // if (gModel.length === 1) return
    var isInRange = gModel.reverse().findIndex(obj => {
        var objPos = obj.pos(ctx)
        if (!objPos) return
        if (pos.x > objPos.startX && pos.x < objPos.endX &&
            pos.y > objPos.startY && pos.y < objPos.endY
            && getObjInRange.name !== 'img') return true
    })
    gModel.reverse()
    isInRange = gModel.length - 1 - isInRange
    if (isInRange === gModel.length) isInRange = -1
    return isInRange
}
