/**
 * 每次约19个金币左右
 */

const perVideoWatchTime=25//每隔视频观看10秒
const halfDeviceHeight=device.height/2
const halfDeviceWidth=device.width/2
const videoSwipeDistance=halfDeviceHeight-100//视频下滑的长度 px
// test()
onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){
    auto();
    console.show()
    log("开始抖音极速版")
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}

var douyin = {};
douyin.main = function (totalTime) {    
    run(totalTime)
  };

  module.exports = douyin;

function test(){
    auto();
    console.show()
    launchApp()
    watchAd()
    exit();

} 
function run(totalTime){
    launchApp()
    let watchTime=0;
    for(let i=1;i<totalTime/perVideoWatchTime;i++){
        let waitTime=perVideoWatchTime+random(-4,4)
        log("本条视频观看时长"+waitTime)
        sleep(waitTime/2*1000);
        likeAndfollow(30)
        sleep(waitTime/2*1000);
        watchTime+=waitTime
        log("已观看："+watchTime+"秒")
        swipeVideo(i)
    }
}

function launchApp(){
    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.ss.android.ugc.aweme.lite")
        sleep(8000)
        isLauchApp=id("com.ss.android.ugc.aweme.lite:id/kh").findOnce()
    }
    let mesbox=id("com.ss.android.ugc.aweme.lite:id/al3").findOnce()
    if(mesbox){
        mesbox.click()
    }
    log("已启动")

}
//swipeCount，累计尝试滑动视频的次数
function swipeVideo(swipeCount){
    if(swipeCount%6==0){
        //  双数的第6次下滑
    swipeVideoIndexDirection("down")
    }else if(swipeCount%2==0){
        //双数次上滑        
    swipeVideoIndexDirection("up")
    
    }else {
        //单数下滑
    swipeVideoIndexDirection("down")
    }

   
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

function runOver(){
    home()
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