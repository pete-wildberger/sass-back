import * as util from 'util';
import minimist from 'minimist';
import { exec } from 'child_process';
import { handleCSS, handleHTML } from './parser';
import { ObjectAny } from './models';
const execute = util.promisify(exec);

class App {
    private cssExtension = '';
    private globalCSSFile = 'styles'
    private cssClassNameRegEx = /\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s?\{{1}/;
    private htmlClassNameRexEx = /class[ \t]*=[ \t]*"[^"]+"/
    constructor() {
        const argv: { [key: string]: any } = minimist(process.argv.slice(2));
        this.cssExtension = argv.e;
        this.main(argv);
    }

    main = async (args: { [key: string]: any }): Promise<void> => {
        const filePath = args.d;
        const [html_files, style_files] = await Promise.all([this.getFileList(filePath, '.html'), this.getFileList(filePath, '.scss')]);
        const htmlList = await this.buildClassList(html_files!, true, false);
        const cssList = await this.buildClassList(style_files!, false, true);
        const { styles } = cssList;
        Object.entries(htmlList).forEach(([key, value]) => {
            if (cssList[key]) {
                const { unmatched_html, unmatched_css } = this.compare(value, cssList[key], styles);
                if (unmatched_html.length > 0 || unmatched_css.length > 0) {
                    console.log("\x1b[32m", key);
                    console.log("\x1b[32m", '---------------------');
                    console.log("\x1b[36m", unmatched_html.join('\n'));
                    console.log("\x1b[35m", unmatched_css.join('\n'));
                    console.log("\x1b[32m", '\n');
                }

            }

        });

    }

    buildClassList = async (files: string[], html: boolean, css: boolean): Promise<ObjectAny> => {
        const list = files.reduce((acc: Array<Promise<any>>, file: string) => {
            if (file !== '') {
                acc.push(new Promise(async (done, fail) => {
                    try {
                        if (html) {
                            const res = await handleHTML(file, this.htmlClassNameRexEx);
                            done(res)
                        }
                        if (css) {
                            const res = await handleCSS(file, this.cssClassNameRegEx);
                            done(res)
                        }
                    } catch (error) {
                        fail(error);
                    }
                }));
            }
            return acc;
        }, []);

        const results = await Promise.all(list);
        const flattened = results.reduce((acc, { path, classes }) => {
            acc[path] = classes;
            return acc;
        }, {});
        return flattened;
    }

    compare = (html_classes: string[], css_classes: string[], global_CSS: string[]) => {
        const result = html_classes.reduce((acc: { [key: string]: string[] }, html: string) => {
            const found = css_classes.some(css => {
                return html === css;
            });

            if (found) {
                acc.matches.push(html);
            } else {
                const found_global = global_CSS.some(css => {
                    return html === css;
                });
                if (found_global) {
                    acc.matches.push(html);
                } else {
                    acc.unmatched_html.push(html)
                }
            }
            return acc;
        }, { matches: [], unmatched_html: [], unmatched_css: [] })
        result.unmatched_css = css_classes.filter(x => !html_classes.includes(x));
        return result;
    }

    getFileList = async (file_path: string, extension: string) => {
        try {
            const { stdout, stderr } = await execute(`find ${file_path} -name '*${extension}' -not -path "*/node_modules/*" -not -path "*/dist/*" -print`);

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

    validateArgs = (args: { [key: string]: any }): { [key: string]: any } => {
        return args;
    }

    help = (args: { [key: string]: any }): void => {

    }
}

new App();
