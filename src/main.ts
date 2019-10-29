import * as util from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
const execute = util.promisify(exec);

class App {
    private cssClassNameRegEx = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s?\{{1}/;
    private htmlClassNameRexEx = /class[ \t]*=[ \t]*"[^"]+"/
    constructor() {
        this.main();
    }

    main = async () => {
        const filePath = process.argv[2]
        this.parseCss(filePath, this.func);
        // const HTMLfiles = await this.getFileList(filePath, '*.html');
        // console.log(HTMLfiles);

    }

    getFileList = async (file_path: string, extension: string) => {
        try {
            const { stdout, stderr } = await execute(`find ${file_path} -path ${file_path}/node_modules -prune -o -name '${extension}' -print`);

            if (stderr) {
                console.error(`error: ${stderr}`);
            } else {
                const split = stdout.split('\n');
                return split;
            }

        } catch (e) {
            throw e;
        }
    }

    parseCss = (file_path: string, func: Function) => {
        console.log('called')
        const stream = fs.createReadStream(file_path);
        let remaining = '';

        stream.on('data', (data) => {
            remaining += data;
            var index = remaining.indexOf('\n');
            var last = 0;
            while (index > -1) {
                var line = remaining.substring(last, index);
                last = index + 1;
                const result = line.match(this.cssClassNameRegEx);
                func(result + ' ** ' + line);
                index = remaining.indexOf('\n', last);
            }

            remaining = remaining.substring(last);
        })

        stream.on('end', () => {
            if (remaining.length > 0) {
                func(remaining);
              }
        })
    }

    func(data: any) {
        console.log('Line: ' + data);
    }
}

new App();
