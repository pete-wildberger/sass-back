import * as util from 'util';
import { exec } from 'child_process';
import * as fs from 'fs';
const execute = util.promisify(exec);

class App {
    constructor(){
        this.main();
    }

    main = async () => {
        const filePath = process.argv[2]
        const HTMLfiles = await this.getFileList(filePath, '*.html');
        console.log(HTMLfiles);
        
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
}

new App();
