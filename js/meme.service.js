'use strict'
console.log('controller is up')
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
var gStartPos


function getSelectedImg(id) {
    const imagIdx = gImages.findIndex(item => item.name === 'John')
    return gImages[imagIdx].imgSrc
}