

const perVideoWatchTime=12//每隔视频观看10秒
const halfDeviceHeight=device.height/2
const halfDeviceWidth=device.width/2
const videoSwipeDistance=halfDeviceHeight-100//视频下滑的长度 px
// test()
// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){

    auto();
    console.show()
    log("开始火山极速版")
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}
var huoshan = {};
huoshan.main = function (totalTime) {    
    run(totalTime)
  };
  
module.exports = huoshan;
function test(){
    auto();
    console.show()
    closeWelcomeMessage()
    exit();

}
function run(totalTime){

    launchApp()
    watchAd()
    watchVideo(totalTime)
    back()
}



function launchApp(){
    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.ss.android.ugc.livelite")
        sleep(8000)
        isLauchApp=id("com.ss.android.ugc.livelite:id/pt").findOnce()
    }
    log("已启动")
}
/**
 * 观看广告，600s有2000个金币
 */
function goWatchAdPage(){
    let buttonA=text("红包").findOnce()
    if(!buttonA){
        log("不在启动页面")
        //TODO可以做完全退出，再启动一次
        return
    }
    let buttonAA=findClickParentt(buttonA)
    buttonAA.click();
    let isLoad=false
    while(!isLoad){
        log("等待加载")
        sleep(2000)
        //“邀请首个好友”弹窗
        // let mesbox=className("android.view.View").clickable(true).indexInParent(2).depth(17).findOnce()
        // if(mesbox){
        //     mesbox.click()
        // }
        isLoad=text("现金余额").findOnce()
    }
    closeWelcomeMessage()
    swipeVideoIndexDirection("down",1000)
}
/**
 * 观看广告,直到找不到“领100金币”的按钮为止
 * @param {Integer} times  需要观看的次数
 */
function watchAd(){
    goWatchAdPage()
    let watchBtn= text("领100金币").findOnce()
    let watchNumber=1;
    while(watchBtn){        
        watchBtnBounds=watchBtn.bounds()
        log("开始看第"+(watchNumber++)+"个广告")      
        click(watchBtnBounds.centerX(), watchBtnBounds.centerY());
        waitAdOverAndBack()
        sleep(2000)
        watchBtn= text("领100金币").findOnce()
        if(watchNumber>40){
            //有时候软件问题
            log("app出现问题，观看广告数量超过40个了")
            break;
        }
    }
    log("没有观看广告的按钮了")
}
/**
 * 等待广告结束并返回
 */
function waitAdOverAndBack(){
    sleep(5000)
    let isLoad=id("com.ss.android.ugc.livelite:id/o").findOnce()
    if(!isLoad){
        log("未加载成功，可能是因为“网络繁忙”")
        return
    }
    let closeAdBtn=undefined
    while(!closeAdBtn){
        sleep(3000)
        log("等待广告结束")
        closeAdBtn=text("关闭广告").findOnce()
        let continueBack=text("继续退出").findOnce()
        if(continueBack){
            continueBack.click()
        }
        
    }
    log("广告已结束")
    closeAdBtn.click()
    sleep(3000)    
    log("广告已结束")
    
    let isBack=text("继续退出").findOnce()
    while(isBack){
        log("还是有继续退出按钮")
        click("继续退出")
        sleep(1000)
        isBack=text("继续退出").findOnce()
    }
    isBack=text("红包").findOnce()
    while(!isBack){
        log("等待返回")
        click("关闭广告")
        click("继续退出")
        sleep(2000)
        isBack=text("红包").findOnce()
    }
}
function goWatchVideoPage(){
    let buttonA=text("视频").findOnce()
    if(!buttonA){
        log("不在启动页面")
        //TODO可以做完全退出，再启动一次
        return
    }
    let buttonAA=findClickParentt(buttonA)
    buttonAA.click();
    sleep(2000)
}
/**
 * 观看小视频
 */
function watchVideo(totalTime){
    goWatchVideoPage()
    let videoBtn=id("com.ss.android.ugc.livelite:id/pt").findOnce()
    videoBtnBounds=videoBtn.bounds()
    click(videoBtnBounds.centerX(), videoBtnBounds.centerY());
    sleep(2000)
    log("进入视频页")
    let watchTime=0;
    for(let i=1;i<totalTime/perVideoWatchTime;i++){
        let isIncome=isNoIncome()
        if(isIncome){
            log("没有收益了，结束运行")
            runOver()
            break;
        }
        let waitTime=perVideoWatchTime+random(-2,4)
        log("本视频观看时长"+waitTime)
        sleep(waitTime/2*1000);
        likeAndfollow(30)
        sleep(waitTime/2*1000);
        watchTime+=waitTime
        log("已看："+i+"个视频 "+watchTime+"秒")
        swipeVideo()

    }
}
function swipeVideo(){
    //火山急速版看过的视频不会累计收益，这里只下滑
    swipeVideoIndexDirection("down")
   
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
    let isIncome=id("com.ss.android.ugc.livelite:id/rr").findOnce()
    if(!isIncome){
        sleep(2000)
        isredBag=id("com.ss.android.ugc.livelite:id/a0s").findOnce()
        if(isredBag){
            log("是广告有红包，准备领取")
            sleep(16000)
            isredBag=findClickParentt(isredBag)
            isredBag.click()

        }else{
            isIncome=id("com.ss.android.ugc.livelite:id/rr").findOnce()
            if(!isIncome){
                log("没有收益了。结束")
                return true;
            }
        }
    }    
    return false;
}
/**
 * 关闭红包页面的欢迎弹窗
 */
function closeWelcomeMessage(){
    // let closeBtn=className("android.view.View").clickable(true).indexInParent(4).depth(18).findOnce()
    sleep(2000)
    let closeBtn=text("javascript:;").findOnce()
    if(closeBtn){
        closeBtn.click()
    }

}
   
function runOver(){
    home()
}


/***********************
 * 工具函数
 */

 //查找控件的最近一个可点击的父控件
function findClickParentt(indexUi){
    let clickParent=indexUi.parent()
    while(!clickParent.clickable()){
        clickParent=clickParent.parent()
    }
    return clickParent;
}