const fmt = 'https://data.typeracer.com/pit/result?id=|tr:*|&';
const fail = 'Requested data not found.';
const delay = 100;

const wpmRgx = /\d+(?=\sWPM)/g;
const accRgx = /(?<=<td>)[0-9\.]+(?=\%)/g;
const txtRgx = /(?<=\<div class="fullTextStr"\>)[\s\S]*?(?=\<\/div\>)/g;

module.exports = {
    fmt,
    fail,
    delay,
    wpmRgx,
    accRgx,
    txtRgx,
};