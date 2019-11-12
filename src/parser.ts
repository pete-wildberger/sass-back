import * as fs from 'fs';
import * as path from 'path';

export const handleCSS = async(file_path: string, regExp: RegExp ): Promise<{[key: string]: any[]}> => {
    const cssClasses = await parseFile(file_path, regExp, trimCss);
    return cssClasses;
}

export const handleHTML = async(file_path: string, regExp: RegExp ): Promise<{[key: string]: any[]}> => {
    const htmlClasses = await parseFile(file_path, regExp, trimHTML);
    return htmlClasses;
}

const parseFile = (file_path: string, regExp: RegExp, trimmer: Function): Promise<{[key: string]: any[]}> => {
    const stream = fs.createReadStream(file_path);
    let remaining = '';
    const results: {[key: string]: any} = {
        path: path.parse(file_path).name,
        classes: []
    };
    return new Promise((done, fail) => {
        stream.on('data', (data) => {
            remaining += data;
            let index = remaining.indexOf('\n');
            let last = 0;
            while (index > -1) {
                const line = remaining.substring(last, index);
                last = index + 1;
                const result= line.match(regExp);
                if (result !== null) {
                    const [text] = result;
                    results.classes.push(trimmer(text));
                }
                index = remaining.indexOf('\n', last);
            }
            remaining = remaining.substring(last);
        })
    
        stream.on('end', () => {
            done(results);
        })

        stream.on('error', (error) => {
            fail(error);
        })
    })
    
}

const trimCss = (match: string) => {
    return match.substring(1, match.length-1).trim();
}

const trimHTML = (match: string) => {
    return match.split('"')[1];
}