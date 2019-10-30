import * as util from 'util';
import minimist from 'minimist';
import { exec } from 'child_process';
import {handleCSS, handleHTML} from './parser';
const execute = util.promisify(exec);

class App {
    private cssClassNameRegEx = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s?\{{1}/;
    private htmlClassNameRexEx = /class[ \t]*=[ \t]*"[^"]+"/
    constructor() {
        const argv = minimist(process.argv.slice(2));
        console.log(argv);
        // this.main();
    }

    main = async () => {
        const filePath = process.argv[2]
        const html = await handleHTML(filePath+'.html', this.htmlClassNameRexEx);
        const css = await handleCSS(filePath+'.scss', this.cssClassNameRegEx);
        console.log(css, html);
        
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
    compare = (base: {[key: string]: string}, comparer: {[key: string]: string}) => {

    }
}

new App();
