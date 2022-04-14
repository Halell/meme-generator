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

function setNewCanvasObj(name, method, body, pos) {
    gModel.push({
        name,
        method,
        body,
        pos,
    })
}