'use strict'

var gImages = [
    {
        id: 1,
        name: '1.jpg',
        imgSrc: `img/meme-imgs (square)/1.jpg`,
        category: 'FUNNY'
    },
    {
        id: 2,
        imgSrc: `img/meme-imgs (square)/2.jpg`,
        category: 'CUTE'
    },
    {
        id: 3,
        imgSrc: `img/meme-imgs (square)/3.jpg`,
        category: 'SOPHISTICATED'
    },
    {
        id: 4,
        imgSrc: `img/meme-imgs (square)/4.jpg`,
        category: 'WORK'
    },
    {
        id: 5,
        imgSrc: `img/meme-imgs (square)/5.jpg`,
        category: 'HOME'
    },
]

var gTags = ['work', 'home', 'sophisticate', 'cute', 'funny']
var gModel = []


function getTags() {
    return gTags
}

function getModel() {
    return gModel
}

function getGimages() {
    return gImages
}

function setNewCanvasObj(name, method, body, x, y, fontSize, fillStyle = 'white', strokeStyle = 'black', font = 'Impact', textAlign = 'center', defaultPos = null) {
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
        pos(ctx) { return getObjPos(this, ctx) },
        defaultPos,
    })
}

function scaleMeasurements(LastSize, currSize) {
    var changePercentage = currSize / LastSize
    gModel.forEach(obj => {
        obj.x *= changePercentage
        obj.y *= changePercentage
        obj.fontSize *= changePercentage
    })
}

function getCurrFocusObjPos(idx, ctx) {
    return gModel[idx].pos(ctx)
}

function clearCanvas() {
    gModel = []
}

function getObjPos(obj, ctx) {
    if (obj.name === 'text') {
        var charSize = ctx.measureText('M').width
        var textMargin = charSize * 0.3
        var textWidth = ctx.measureText(obj.body).width + textMargin
        var textHeight = charSize + textMargin

        var pos = {
            startY: obj.y - textMargin,
            endY: obj.y + textHeight
        }

        if (!obj.body) {
            pos.startX = obj.x
            pos.endX = obj.x
            return pos
        } else {
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
        }

        return pos
    } else {
        return obj.defaultPos
    }

}

function updateModel(idx, prop, val) {
    gModel[idx][prop] = val
}

function getObjBody(idx) {
    return gModel[idx].body
}

function getModelLastIdx() {
    return gModel.length - 1
}

function creatTextObj(height, appState) {
    var x = getPosX(appState)
    setNewCanvasObj('text', drawText, '', x, height, appState.fontSize(), appState.fillStyle, appState.strokeStyle, appState.font, appState.textAlign)
}

function getActualPos(idxCurrInFocus) {
    return { x: gModel[idxCurrInFocus].x, y: gModel[idxCurrInFocus].y }
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

function isTextObj(idx) {
    if (!gModel[idx]['name']) return false
    return gModel[idx].name === 'text'
}

function checkIfEmpty() {
    var emptyIdx = null
    gModel.map((obj, idx) => {
        if (obj.name === 'text' && !obj.body) emptyIdx = idx
    })
    if (emptyIdx > 0) gModel.splice(emptyIdx, 1)
}