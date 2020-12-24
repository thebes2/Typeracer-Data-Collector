// waits for previous get requests to resolve before continuing ("synchronous")
// very slow when processing 50+ races
// used only for debugging

const fetch = require("node-fetch");
const {
    fmt,
    fail,
} = require('./constants');
const { record } = require('./record');


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

async function main() {
    // usage: 
    // node script.js <typeracer username>
    if(process.argv.length!=3){
        console.log('Incorrect number of arguments.\n');
        process.exit(0);
    }
    const uid = process.argv[2];
    const raw = [];
    for(let i=1;;i++){
        if(i%10==1){
            console.log(`Dispatching get request ${i}`);
        }
        const url = fmt.replace(/\&/g,i.toString()).replace(/\*/g,uid);
        const dat = await get(url);
        if(dat.includes(fail)) break;

        raw.push(dat);
    }
    record(raw, function(idx=null, data=null, wpm=null, acc=null, txt=null) {
        console.log(`${idx}: ${wpm} ${acc} ${txt.length}`);
    });
}

main();