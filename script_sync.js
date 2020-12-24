// waits for previous get requests to resolve before continuing ("synchronous")
// very slow when processing 100+ races
// used only for debugging

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

function parseSpecial(str){
    return str.replace(/&#39;/g, '\'').replace(/&quot;/g, '\"').replace(/&amp;/g, '&').replace(/&gt/g, ">").replace(/&lt/g, "<");
}

async function main() {
    // usage: 
    // node script.js <typeracer username>
    if(process.argv.length!=3){
        console.log('Incorrect number of arguments.\n');
        process.exit(0);
    }
    const uid = process.argv[2];
    const wpmRgx = /\d+(?=\sWPM)/g;
    const accRgx = /(?<=<td>)[0-9\.]+(?=\%)/g;
    const txtRgx = /(?<=\<div class="fullTextStr"\>)[\s\S]?(?=\<\/div\>)/g;
    const res = [];
    for(let i=1;i<2;i++){
        if(i%10==1){
            console.log(`\nRecording race ${i}\n`);
        }
        const url = fmt.replace(/\&/g,i.toString()).replace(/\*/g,uid);
        const dat = await get(url);
        if(dat.includes(fail)) break;

        const wpm = dat.match(wpmRgx)[0];
        const acc = dat.match(accRgx)[0];
        const txt = parseSpecial(dat.match(txtRgx)[0]);


        // console.log(dat.match(txtRgx));
        // console.log(dat);
        // console.log(wpm, acc);
        res.push({wpm, acc, txt});
    }
    const csv = new CSV(res);
    await csv.toDisk('./result.csv');
    console.log('done!');
}

main();