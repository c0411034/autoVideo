auto();
console.setGlobalLogConfig({
    "file": "/sdcard/网赚.txt"
});
console.show()
images.requestScreenCapture(false)
log("已获得截屏权限")
const perAppRunTime=3.5*60*60 //每隔应用刷2小时
//快手极速版
log("开始启动")
main()
let totalTimeInThread=0;//每个线程使用的时间，用于线程之间共享的变量

function main(){
    // // startThread(kuaishou,"快手",4*3600)
    // startThread(huoshan,"火山",1.2*3600)
    // startThread(douguagua,"抖呱呱",2*3600)
    startThread(shuabao,"刷宝",2*3600)
    startThread(douyin,"抖音",2*3600)
    startThread(juKanDianFunc,"聚看点",2*3600)
    startThread(quTouTiaoFunc,"趣头条",2*3600)
    startThread(xueXiQiangGuoFunc,"学习强国",1*3600)    
    log("任务完成")


}
//启动指定以方法为主体的线程，同时传入线程名,运行最大时长(S)
function startThread(functionName,name,appRunTime){
    totalTimeInThread=appRunTime;
    let indexThread=threads.start(functionName)
    for(let i=0;i<appRunTime/10;i++){
        //总共等待2小时，每次循环等待10s
         sleep(10000)
        if(!indexThread.isAlive()){
             log(name+"线程已死")
             break;
         }
         log("总线程等待"+(i+1)+"0秒")
    }
    indexThread.interrupt()
    log(name+"线程结束了")
    home()
}
function kuaishou(){
    try {
        var kuaishouJS = require('快手极速版.js');
        kuaishouJS.main(totalTimeInThread)
    } catch (error) {
        log("快手出现问题")
        log(error)
        return
    }
}

function huoshan(){
    try {
        var app = require('火山极速版.js');
        app.main(totalTimeInThread)
    } catch (error) {
        log("火山出现问题")
        log(error)
        return
    }
}
function douyin(){
    try {
        var app = require('抖音极速版.js');
        app.main(totalTimeInThread)
    } catch (error) {
        log("抖音出现问题")
        log(error)
        return
    }
}

function shuabao(){
    try {
        var app = require('刷宝短视频.js');
        app.main(totalTimeInThread)
    } catch (error) {
        log("刷宝出现问题")
        log(error)
        return
    }
}

function douguagua(){
    try {
        var app = require('抖呱呱极速版.js');
        app.main(totalTimeInThread)
    } catch (error) {
        log("抖呱呱出现问题")
        log(error)
        return
    }
}
function xueXiQiangGuoFunc(){
    try {
        var xueXiQiangGuo = require('学习强国.js');
        xueXiQiangGuo.main(totalTimeInThread)
    } catch (error) {
        log("学习强国出现问题")
        log(error)
        return
    }
}


function juKanDianFunc(){
    try {
        var juKanDian = require('聚看点.js');
        juKanDian.main(totalTimeInThread)
    } catch (error) {
        log("聚看点出现问题")
        log(error)
        return
    }
}


function quTouTiaoFunc(){
    try {
        var quTouTiao = require('趣头条.js');
        quTouTiao.main(totalTimeInThread)
    } catch (error) {
        log("趣头条出现问题")
        log(error)
        return
    }
}