require('dotenv').config({path:__dirname + '/.env'});

const dirname = process.env.STARTING_FOLDER;

const phoneRegex = /[\+]?([0-9]){0,3}[\s|\-]{0,1}\(?([0-9]{3})?\)?[\s|\-]{0,1}([0-9]{3})\-?([0-9]{2})\-?([0-9]{2})/g;
const phoneGrouper = /[\+]?([0-9]){0,3}[\s|\-]{0,1}\(?([0-9]{3})?\)?[\s|\-]{0,1}([0-9]{3})\-?([0-9]{2})\-?([0-9]{2})/;

const walk = require('walk');
const fs = require('fs');
let walker = walk.walk(dirname);
let phoneList = [];

function cleanPhone(phone){
    if(phone === null) return phone;
    const groups = phone.match(phoneGrouper);
    const ret = `+${groups[1] || 7} (${groups[2] || 812}) ${groups[3]}-${groups[4]}${groups[5]}`;
    return ret;
}

function filterPhones(phone,index,arr){
    return arr.indexOf(phone) === index && phone !== null
}
 
walker.on("file", function (root, fileStats, next) {
    if(fileStats.name.endsWith('.txt')){
        fs.readFile(root + "/" + fileStats.name, function (err,data) {
            const text = data.toString();
            const telephones = text.match(phoneRegex);
            phoneList = phoneList.concat(telephones);
            next()
        });
    }else{
        next()
    }
});

 
walker.on("end", function () {
    phoneList
        .map(cleanPhone)
        .filter(filterPhones)
        .sort()
        .forEach(el => console.log(el));
});