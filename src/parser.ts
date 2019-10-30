import * as fs from 'fs';

export const handleCSS = async(file_path: string, regExp: RegExp ): Promise<string[]> => {
    const cssClasses = await parseFile(file_path, regExp, trimCss);
    return cssClasses;
}

const parseFile = (file_path: string, regExp: RegExp, trimmer: Function): Promise<string[]> => {
    const stream = fs.createReadStream(file_path);
    let remaining = '';
    let results: string[] = []
    return new Promise((done, fail) => {
        stream.on('data', (data) => {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                const result= line.match(regExp);
                if (result !== null) {
                    const [text] = result;
                    results.push(trimmer(text));
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