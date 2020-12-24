const fetch = require("node-fetch");
const CSV = require("objects-to-csv");

async function get(url) {
    try {
        const res = await fetch(url);
        const data = await res.text();
        return data;
    } catch (error) {
        console.log('Error: ' + error);
        return null;
    }
}

const fmt = 'https://data.typeracer.com/pit/result?id=|tr:*|&';
const fail = 'Requested data not found.';
const delay = 100;

function sleep(ms){
    return new Promise(function(res){setTimeout(res, ms || delay)});
}

async function dispatch() {
    // usage: 
    // node script.js <typeracer username>
    if(process.argv.length!=3){
        console.log('Incorrect number of arguments.\n');
        process.exit(0);
    }
    const uid = process.argv[2];
    let promises = [];
    let chk = 1;

    console.log('Dispatching get requests.\n');
    for(let i=1;;i++){
        // console.log(`${i}`);
        const url = fmt.replace(/\&/g,i.toString()).replace(/\*/g,uid);
        promises.push(get(url));

        if(i==chk){
            // force the current promise to resolve
            console.log(`Awaiting resolve of request ${i}`);
            const dat = await promises[i-1];
            if(dat.includes(fail)) break;
            else chk *= 2;
        }
        // need to limit rate of dispatch or else socket hang up may occur
        await sleep(5);
    }
    Promise.all(promises).then(record);
}

function parseSpecial(str){
    return str.replace(/&#39;/g, '\'').replace(/&quot;/g, '\"').replace(/&amp;/g, '&').replace(/&gt/g, ">").replace(/&lt/g, "<");
}

async function record(values) {
    console.log('Recording data.\n');
    const wpmRgx = /\d+(?=\sWPM)/g;
    const accRgx = /(?<=<td>)[0-9\.]+(?=\%)/g;
    const txtRgx = /(?<=\<div class="fullTextStr"\>)[\s\S]*?(?=\<\/div\>)/g;
    let res = [];

    for(let i=0;i<values.length;i++){
        const dat = values[i];
        if(dat){
            if(dat.includes(fail)) break;

            const wpm = dat.match(wpmRgx)[0];
            const acc = dat.match(accRgx)[0];
            const txt = parseSpecial(dat.match(txtRgx)[0]);

            // console.log(wpm, acc, txt.length);
            res.push({WPM: wpm, Accuracy: acc, 'Character Count': txt.length});
        }
    }
    const csv = new CSV(res);
    await csv.toDisk('./result.csv');
    console.log('done!');
}

dispatch();