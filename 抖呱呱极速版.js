/**
 * 每次约23个金币左右
 */

const perVideoWatchTime=15//每隔视频观看10秒
const halfDeviceHeight=device.height/2
const halfDeviceWidth=device.width/2
const videoSwipeDistance=halfDeviceHeight-100//视频下滑的长度 px

// runOver()
// exit();

// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){

    auto();
    console.show()
    log("开始抖呱呱极速版")
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}

var app = {};
app.main = function (totalTime) {    
    run(totalTime)
  };

  module.exports = app;





function run(totalTime){
    launchApp()
    let watchTime=0;
    for(let i=1;i<totalTime/perVideoWatchTime;i++){
        let waitTime=perVideoWatchTime+random(-7,7)
        log("本条视频观看时长"+waitTime)
        sleep(waitTime/2*1000);
        likeAndfollow(10)
        sleep(waitTime/2*1000);
        watchTime+=waitTime
        log("已观看："+watchTime+"秒")
        swipeVideo()
    }
}

function launchApp(){

    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.uyouqu.disco")
        sleep(8000)
        let mesbox=id("com.uyouqu.disco:id/positive").findOnce()
        if(mesbox){
            mesbox.click()
        }
        isLauchApp=id("com.uyouqu.disco:id/red_packet_float_view").findOnce()
    }
    log("已启动")

}
///swipeCount，累计尝试滑动视频的次数
function swipeVideo(){
    swipeVideoIndexDirection("down")

   
}
/**
 * 指定概率（%），根据概率是否执行双击喜欢操作，
 * 输入的数据不包含…%，如输入30表示30%
 * */
function likeAndfollow(chance){
    let isLike=random(0,100)
    if(isLike<=chance){
        click(halfDeviceWidth,halfDeviceHeight)
        sleep(50)
        click(halfDeviceWidth,halfDeviceHeight)
        log("双击喜欢")
    }

}


function swipeVideoIndexDirection(direction,swipeDelay){
    let offset=random(0,100)
    if(!swipeDelay){swipeDelay=30}
    if(direction=="up"){
        swipe(halfDeviceWidth+random(0,100), halfDeviceHeight-offset, 
        halfDeviceWidth+random(-50,50), halfDeviceHeight+offset+(videoSwipeDistance/2), swipeDelay);
    }else if(direction=="down"){
        swipe(halfDeviceWidth-random(0,100), halfDeviceHeight+offset+(videoSwipeDistance/2), 
        halfDeviceWidth+random(-50,50), halfDeviceHeight-offset-(videoSwipeDistance/2), swipeDelay);
    }
}
function runOver(){
    home()
}