const fetch = require("node-fetch");
const { record } = require('./record');
const { 
    fmt, 
    fail, 
    delay,
} = require('./constants')

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

dispatch();