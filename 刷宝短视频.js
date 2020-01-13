

const perVideoWatchTime=10//每隔视频观看10秒
const halfDeviceHeight=device.height/2
const halfDeviceWidth=device.width/2
const videoSwipeDistance=halfDeviceHeight-100//视频下滑的长度 px

// test()
// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){
    auto();
    console.show()
    log("开始刷宝短视频")
    images.requestScreenCapture(false)
    log("已获得截屏权限")
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}

function test(){
    auto();
    console.show()
    log("开始刷宝短视频")
    images.requestScreenCapture(false)
    log("已获得截屏权限")
    
    swipeVideoIndexDirection("up")
    exit();

} 
var app = {};
app.main = function (totalTime) {    
    run(totalTime)
  };

  module.exports = app;

function run(totalTime){
    launchApp()
    log("刷宝短视频需用时："+totalTime)
    let watchTime=0;
    for(let i=1;i<totalTime/perVideoWatchTime;i++){
        let isIncome=isNoIncome()
        if(!isIncome){
            log("没有收益了，结束运行")
            break;
        }
        let waitTime=perVideoWatchTime+random(-5,5)
        log("本条视频观看时长"+waitTime)
        sleep(waitTime/2*1000);
        likeAndfollow(10)
        sleep(waitTime/2*1000);
        watchTime+=waitTime
        log("已看："+i+"个视频 "+watchTime+"秒")
        swipeVideo(i)

    }    
    runOver()
}




function launchApp(){
    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.jm.video")
        sleep(8000)        
        let mesbox=id("com.jm.video:id/cancel").findOnce()
        if(mesbox){
            mesbox.click()
        }
        isLauchApp=id("com.jm.video:id/iv_tab_icon").findOnce()
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
//是否已经不再有收益了
function isNoIncome(){
    let isIncome=findIncomeIcon()
    if(!isIncome){
        sleep(6000)
        isIncome=findIncomeIcon()
        if(!isIncome){
            log("等待6秒，不见收益红包")
            return false
        }
    }
    log("正在收益中")
    return true;
}
//查找收入红包的图标，是收益中的返回true 否则返回false
function findIncomeIcon(){
    let redBag=id("com.jm.video:id/imgUp").findOnce()
    if(redBag){
        let redBagBounds=redBag.bounds()
        let screen=images.captureScreen();
        // log(redBagBounds)
        let p=images.findColorEquals(screen,"#f85050",redBagBounds.left,redBagBounds.top,redBagBounds.width(),redBagBounds.height())
        return p?true:false;
    }
    return false;
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
        sleep(500)
        swipe(halfDeviceWidth+random(0,100), halfDeviceHeight-offset, 
        halfDeviceWidth+random(-50,50), halfDeviceHeight+offset+(videoSwipeDistance/2), swipeDelay);
    }else if(direction=="down"){
        swipe(halfDeviceWidth-random(0,100), halfDeviceHeight+offset+(videoSwipeDistance/2), 
        halfDeviceWidth+random(-50,50), halfDeviceHeight-offset-(videoSwipeDistance/2), swipeDelay);
    }
}