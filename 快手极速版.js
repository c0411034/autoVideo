/**
 * 3元起提，没有限制，只要求手机验证码
 */

const perVideoWatchTime=5//每隔视频观看10秒
const halfDeviceHeight=device.height/2
const halfDeviceWidth=device.width/2
const videoSwipeDistance=halfDeviceHeight-100//视频下滑的长度 px
// test()
// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){

    auto();
    console.show()
    log("开始快手极速版")
    images.requestScreenCapture(false)
    log("已获得截屏权限") 
    
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}
function test(){

    auto();
    console.show()
    log("开始快手极速测试")
    images.requestScreenCapture(false)
    log("已获得截屏权限") 
    click("我知道了")
    exit()
}
var kuaiShou = {};
kuaiShou.main = function (totalTime) {    
    run(totalTime)
  };
  
module.exports = kuaiShou;
function run(totalTime){
    log("计划时长："+totalTime)
    launchApp()
    let watchTime=0;
    for(let i=1;totalTime>watchTime;i++){
        if(text("拖动滑块").findOnce()){
            log("出现验证码，结束")
            runOver()
            break;
        }
        let waitTime=perVideoWatchTime+random(-4,4)
        log("本视频观看时长"+waitTime)
        sleep(waitTime/2*1000);
        likeAndfollow(7)
        sleep(waitTime/2*1000);
        watchTime+=waitTime
        log("已看："+i+"个视频 "+watchTime+"秒")
        swipeVideo(i)

    }
}

function launchApp(){
    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.kuaishou.nebula")
        sleep(10000)        
        let mesbox=id("com.kuaishou.nebula:id/a4v").findOnce()
        if(mesbox){
            mesbox.click()
        }
        mesbox=id("com.kuaishou.nebula:id/close").findOnce()
        if(mesbox){
            mesbox.click()
        }
        
        mesbox=text("我知道了").findOnce()
        if(mesbox){
            mesbox.click()
        }
        isLauchApp=id("com.kuaishou.nebula:id/circular_progress_bar").findOnce()
    }
    
    log("已启动")
}
//swipeCount，滑动视频的次数
function swipeVideo(swipeCount){
    let offset=random(-100,0)
    if(swipeCount%6==0){
        //  双数的第6次下滑
        swipe(halfDeviceWidth-random(-50,50), halfDeviceHeight+offset+(videoSwipeDistance/2), 
        halfDeviceWidth+random(-50,50), halfDeviceHeight+offset-(videoSwipeDistance/2), 30);
    }else if(swipeCount%2==0){
        //双数次上滑        
        swipe(halfDeviceWidth+random(-50,50), halfDeviceHeight+offset, 
        halfDeviceWidth+random(-50,50), halfDeviceHeight+offset+(videoSwipeDistance/2), 30);
    
    }else {
        //单数下滑
        swipe(halfDeviceWidth-random(-50,50), halfDeviceHeight+offset+(videoSwipeDistance/2), 
        halfDeviceWidth+random(-50,50), halfDeviceHeight+offset-(videoSwipeDistance/2), 30);
    }

}
//有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
function likeAndfollow(range){
    let isLike=random(-1*range,range)
    if(isLike==0){
        click(halfDeviceWidth,halfDeviceHeight)
        sleep(50)
        click(halfDeviceWidth,halfDeviceHeight)
        log("双击喜欢")
        let isFollow=random(-1*range,range)
        if(isFollow==0){
            text("关注").click()
            log("点了关注")
        }else{
            // log("不是点关注的概率:"+isFollow)
        }

    }else{
        // log("不是点喜欢的概率:"+isLike)
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
    let redBag=id(" com.kuaishou.nebula:id/circular_progress_bar").findOnce()
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

