export default class Render {
    static time = {
        start: null,
        end: null
    };
    static currentData = {
        block: null,
        transaction: null,
        uncle: null,
        time: null
    };

    static start(){
        this.time.start = new Date().getTime();
    }

    static end(){
        this.time.end = new Date().getTime();
    }

    static write(data){
        this.clearLine();
        this.cursorTo(0);
        process.stdout.write(data);
    }

    static newLine(){
        process.stdout.write(`\n`);
    }

    static clearLine(dir, callback){
        process.stdout.clearLine(dir, callback);
    }

    static cursorTo(index){
        process.stdout.cursorTo(index);
    }

    static error(data){
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(utc + (KR_TIME_DIFF));

        process.stdout.write(`\n`);
        console.log(kr_curr);
        console.error(data);
    }
}