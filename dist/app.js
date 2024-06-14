'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedditData = void 0;
/*
  code executed in main function
  call setup() to set the filename and subreddit and categlory before
  the get the reddit data
*/
const axios = __importStar(require("axios"));
const fs = __importStar(require("node:fs"));
const Category = ['new', 'hot', 'top', 'Rising'];
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRedditData = async (subname, catname, file, responseData) => {
    const req = axios.create({
        baseURL: 'https://www.reddit.com/',
    });
    const queryString = `/r/${subname}.json?sort=${catname}`;
    try {
        const result = await req.get(queryString);
        if (result.status == 200) {
            const obj = result.data.data.children;
            obj.map((value) => {
                if (value === undefined) {
                    console.log('undefined found\n');
                    return;
                }
                console.log('pushing');
                responseData.push({ ...value.data });
            });
        }
        else {
            console.log(result.status);
        }
        console.log(responseData[0].title);
    }
    catch (e) {
        console.log(e);
    }
};
exports.getRedditData = getRedditData;
const writeToFile = (buffer, file) => {
    fs.writeFile(file.filename, buffer, { flag: file.flag }, (err) => {
        if (err)
            console.log(err);
    });
};
const main = async () => {
    let subredditName = 'AmItheAsshole';
    let categlory = Category[2];
    let currentFile = {
        filename: './fetchs.json',
        flag: 'a+',
    };
    let resdata = new Array();
    await (0, exports.getRedditData)(subredditName, categlory, currentFile, resdata);
    // write to file
    // write array of obj
    writeToFile('\n[', currentFile);
    resdata.map((value) => {
        writeToFile(`
            ${JSON.stringify({
            title: value.title,
            selftext: value.selftext,
            ups: value.ups,
            url: value.url,
            over_18: value.over_18,
            permalink: value.permalink,
            author_fullname: value.author_fullname,
        })},`, currentFile);
    });
    writeToFile('\n[', currentFile);
};
main();
//# sourceMappingURL=app.js.map