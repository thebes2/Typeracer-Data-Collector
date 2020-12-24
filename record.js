const CSV = require("objects-to-csv");
const {
    fail,
    wpmRgx,
    accRgx,
    txtRgx,
} = require('./constants');

function parseSpecial(str){
    return str.replace(/&#39;/g, '\'').replace(/&quot;/g, '\"').replace(/&amp;/g, '&').replace(/&gt/g, ">").replace(/&lt/g, "<");
}

async function record(values, log=null) {
    console.log('Recording data.\n');
    let res = [];

    for(let i=0;i<values.length;i++){
        const dat = values[i];
        if(dat){
            if(dat.includes(fail)) break;

            const wpm = dat.match(wpmRgx)[0];
            const acc = dat.match(accRgx)[0];
            const txt = parseSpecial(dat.match(txtRgx)[0]);

            if(log) log(i, dat, wpm, acc, txt);
            // console.log(wpm, acc, txt.length);
            res.push({WPM: wpm, Accuracy: acc, 'Character Count': txt.length});
        }
    }
    const csv = new CSV(res);
    await csv.toDisk('./result.csv');
    console.log('done!');
}

module.exports = {
    record
};