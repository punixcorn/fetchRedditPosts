'use strict';

/* 
  code executed in main function 
  call setup() to set the filename and subreddit and categlory before
  the get the reddit data
*/

import * as axios from 'axios';
import { response } from 'express';
import * as fs from 'node:fs';
import { exit } from 'node:process';

interface fileInfo {
    filename: string;
    flag: string;
}

interface responseObj {
    selftext: string;
    author_fullname: string;
    title: string;
    ups: number;
    over_18: boolean;
    permalink: string;
    url: string;
}

interface responseType {
    data: responseObj;
}

const Category: string[] = ['new', 'hot', 'top', 'Rising'];

const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRedditData: any = async (subname: string, catname: string, file: fileInfo, responseData: responseObj[]): Promise<any> => {
    const req = axios.create({
        baseURL: 'https://www.reddit.com/',
    });
    const queryString: string = `/r/${subname}.json?sort=${catname}`;
    try {
        const result: axios.AxiosResponse = await req.get(queryString);
        if (result.status == 200) {
            const obj = result.data.data.children as responseType[];
            obj.map((value: responseType) => {
                if (value === undefined) {
                    console.log('undefined found\n');
                    return;
                }
                responseData.push({ ...value.data } as responseObj);
            });
        } else {
            console.log(result.status);
        }
    } catch (e) {
        console.log(e);
    }
};

const writeToFile = (buffer: string, file: fileInfo) => {
    fs.writeFile(file.filename, buffer, { flag: file.flag }, (err: object) => {
        if (err) console.log(err);
    });
};

const main = async () => {
    let subredditName: string = 'AmItheAsshole';
    let categlory: string = Category[getRandomInt(0, 3)];
    let currentFile: fileInfo = {
        filename: './fetchs.json',
        flag: 'a+',
    };
    let resdata: responseObj[] = new Array();

    await getRedditData(subredditName, categlory, currentFile, resdata);

    // write to file
    // write array of obj
    writeToFile('\n[', currentFile);
    resdata.map((value) => {
        writeToFile(
            `
            ${JSON.stringify({
                title: value.title,
                selftext: value.selftext,
                ups: value.ups,
                url: value.url,
                over_18: value.over_18,
                permalink: value.permalink,
                author_fullname: value.author_fullname,
            } as responseObj)},`,
            currentFile,
        );
    });
    writeToFile('\n]', currentFile);
    console.log('done');
};

main();
