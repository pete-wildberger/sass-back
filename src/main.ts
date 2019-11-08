import * as util from 'util';
import minimist from 'minimist';
import { exec } from 'child_process';
import {handleCSS, handleHTML} from './parser';
const execute = util.promisify(exec);

class App {
    private cssExtension = '';
    private globalCSSFile = 'styles'
    private cssClassNameRegEx = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s?\{{1}/;
    private htmlClassNameRexEx = /class[ \t]*=[ \t]*"[^"]+"/
    constructor() {
        const argv:{[key: string]: any} = minimist(process.argv.slice(2));
        this.cssExtension = argv.e;
        this.main(argv);
    }

    main = async (args: {[key: string]: any}): Promise<void> => {
        const filePath = args.d;
        const html_files = await this.getFileList(filePath, '.html');
        const style_files = await this.getFileList(filePath, '.scss');

        
        // const HTMLfiles = await this.getFileList(filePath, '*.html');
        // console.log(HTMLfiles);

    }

    compare = async (base: {[key: string]: string}, comparer: {[key: string]: string}, global_CSS: {[key: string]: string}) => {
        // const html = await handleHTML(filePath, '.html', this.htmlClassNameRexEx);
        // const css = await handleCSS(filePath, this.cssExtension, this.cssClassNameRegEx);
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

    validateArgs = (args: {[key: string]: any}): {[key: string]: any} => {
        return args;
    }

    help = (args: {[key: string]: any}): void => {

    }
}

new App();
