/**
 * 30元起提，没有限制，只要求手机验证码
 */
const deviceHeight=device.height
const deviceWidth=device.width
const halfDeviceHeight=deviceHeight/2
const halfDeviceWidth=deviceWidth/2
const readTotalTime=2*3600//1小时
const perNewsReadTime=42//每篇文章阅读时长s
const readTotalNum=readTotalTime/perNewsReadTime//需要阅读篇数

// test()

// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){

    auto();
    console.show()
    log("开始刷聚看点")
    launchApp()
    readNews();
}

var juKanDian = {};
juKanDian.main = function (r) {    
    launchApp()
    readNews();
  };
  
module.exports = juKanDian;
function test(){
    // swipe(deviceWidth/2, deviceHeight-300, deviceWidth/2, deviceHeight-(deviceHeight-70), 1500)
    // swipeRight()
    watchSmallVideo()
    // randomSwipeIndexDirection(1)//先往下滑1下，启动计时
    // let isHanveIncome=className("android.view.View").clickable(false).drawingOrder(12).depth(7).findOnce()//是否有收益图标
    // if(!isHanveIncome){
    //     log("这篇是广告")
    // }else{
    //     log("no ad")
    // }
    // let newsTitleArray=getCurrentScreenNews()
    // // readNewsIndexTitleUi(newsTitleArray[0])
    // log(newsTitleArray.length)
    // log(newsTitleArray[0])
    // let NewsIndexFrame=getNewsFrameIndexTitleUi(newsTitleArray[0])
    // NewsIndexFrame.click()
    // for(let i=0;i<=newsTitleArray.length;i++){
        
    //     let NewsIndexFrame=getNewsFrameIndexTitleUi(newsTitleArray[i])
    //     isInScreenIndexFrame(NewsIndexFrame)
    // }

    exit();
}
function launchApp(){
    
    let isLauchApp=false
    while(!isLauchApp){
        log("尝试启动")
        launchPackage("com.xiangzi.jukandian")
        sleep(10000)
        let mesbox=id("com.xiangzi.jukandian:id/dismisstv").findOnce()
        if(mesbox){
            mesbox.click()
            sleep(1000)
        }
        mesbox=id("com.xiangzi.jukandian:id/v2_sign_close_button").findOnce()
        if(mesbox){
            mesbox.click()
            sleep(1000)
        }
        isLauchApp=id("com.xiangzi.jukandian:id/ll_tab1_layout").findOnce()
        
    }
    log("已启动")
}
function readNews(){
    
    device.setBrightness(0)//设置屏幕亮度
    log("开始刷看点")
    //点击“看点”
    id("com.xiangzi.jukandian:id/ll_tab1_layout").click()
    sleep(2000)
    let readResule={
        readTime:0,
        readCount:0
    }
    while(readTotalTime>readResule.readTime||readTotalNum>readResule.readCount){
        let thisReadResule=readCurrentScreenNews()
        readResule.readTime+=thisReadResule.readTime
        readResule.readCount+=thisReadResule.readCount        
        swipe(deviceWidth/2, deviceHeight-300, deviceWidth/2, deviceHeight-(deviceHeight-70), 1500)//上滑x
        sleep(3000)
        log("累计阅读文章数量"+readResule.readCount+"阅读时间"+readResule.readTime)
    }

}
// 阅读当前屏幕显示的新闻,返回阅读时长和数量
function readCurrentScreenNews(){
    let readResule={
        readTime:0,
        readCount:0
    }
    let newsTitleArray=getCurrentScreenNews()
    log("当前页面新闻数量："+newsTitleArray.length)
    for(let i=0;i<=newsTitleArray.length;i++){
        if(newsTitleArray[i]==undefined){
            log("当前屏幕文章已经阅读完")
            return readResule
        }
        
        let NewsIndexFrame=getNewsFrameIndexTitleUi(newsTitleArray[i])
        if(NewsIndexFrame==null)continue
        let newsReadResule=readNewsIndexTitleUi(NewsIndexFrame)
        readResule.readTime+=newsReadResule.readTime
        readResule.readCount+=newsReadResule.readCount
        log("当前屏幕阅读文章数量"+readResule.readCount+"阅读时间"+readResule.readTime)
        isHanveQiandaoBox()
    }
    return readResule
}
function readVideo(){
    
}
//找出当前页面所有文章的标题
function getCurrentScreenNews(){
    let newsTitleArray= id("com.xiangzi.jukandian:id/item_artical_three_title_tv").find()
    return newsTitleArray;
}
//阅读一篇文章，传入文章的title的控件对象
function readNewsIndexTitleUi(NewsIndexFrame){
    NewsIndexFrame.click();
    sleep(1000)
    // let isRead=id("com.cashtoutiao:id/confirm").findOnce()
    // if(isRead){
    //     log("这篇已经看过5次了")
    //     isRead.click()
    //     sleep(1000)
    //     newsBack()
    //     return{
    //         readTime:0,
    //         readCount:0
    //     }
    // }
    
    // let isHanveIncome=className("android.view.View").clickable(false).drawingOrder(12).depth(7).findOnce()//是否有收益图标
    // if(!isHanveIncome){
    //     log("这篇是广告")
    //     newsBack()
    //     return{
    //         readTime:0,
    //         readCount:0
    //     }
    // }
    text("评论得金币").waitFor()
    sleep(1000)
    randomSwipeIndexDirection(1)//先往下滑1下，启动计时
    randomSwipe(perNewsReadTime)
    //有时候文章中会出现消息框
    let mesbox=id("com.xiangzi.jukandian:id/dismisstv").findOnce()
    if(mesbox){
        mesbox.click()
    }
    newsBack()
    return{
        readTime:perNewsReadTime,
        readCount:1
    }
}
function newsBack(){
    let isHomePage=null
    while(!isHomePage){
        log("尝试返回")
        back()
        sleep(2000)
        isHomePage=id("com.xiangzi.jukandian:id/ll_tab1_layout").findOnce()
    }
    log("返回成功")
}
//传入文章的title的控件对象,返回文章的可点击对象frame
function getNewsFrameIndexTitleUi(titleUi){
    let frame=titleUi
    while(!frame.clickable()){
        frame=frame.parent()
        if(frame==null){
            log("没有可点击的框架"+titleUi.text())
            return null
        }
    }
    // log("找到了")
    return frame
}
//随机滑动指定的时间
function randomSwipe(indexTime){
    let intervalTime=6//5秒
    for(let useTime=0;useTime<indexTime;useTime+=intervalTime){
        sleep(intervalTime*1000)
        log("已观看："+useTime+"/"+indexTime)
        let direction=random(-1,1)
        direction=direction==0?1:direction;
        randomSwipeIndexDirection(direction)
        //ToDo 1圈金币翻倍卡
    }
}
//随机滑动，指定方向，-1为向上滑，1为上滑
function randomSwipeIndexDirection(direction){
    let swipeDistance=150//1次滑150px
    let offset=random(-100,100)
    swipe(halfDeviceWidth-random(-100,100), halfDeviceHeight+offset+(swipeDistance/2*direction), 
    halfDeviceWidth+random(-100,100), halfDeviceHeight+offset-(swipeDistance/2*direction), 500);
    //ToDo 1圈金币翻倍卡
    
}
//是否有签到提醒
function isHanveQiandaoBox(){
    let qiandao=text("每天提醒签到赚金币，连续签到").findOnce()
    if(qiandao){
        log("有签到提醒")
        id("com.xiangzi.jukandian:id/iv_cancel").click()
        sleep(1000)
    }
}

function watchSmallVideo(){
    log("开始看视频")
    let video=findClickUiIndexText("视频")
    video.click()
    log("点击了视频")
    sleep(2000)
    swipeRight()
    log("进入了小视频")
    sleep(2000)
    click(deviceWidth- 200,200)
    let perVideoWatchTime=10
    let totalWatchTime=1*3600//1小时
    let watchTime=0
    for(let i=0;i<totalWatchTime/perVideoWatchTime;i++){
        sleep(3000)
        let isAd=text("精选推荐").findOnce()
        if(!isAd){
            let waitTime=perVideoWatchTime-3000+random(-5,5)//减去之前休息的上3000毫秒
            log("本条视频观看时长"+waitTime)
            sleep(waitTime/2*1000);
            likeAndfollow(2)
            sleep(waitTime/2*1000);
            watchTime+=waitTime
            log("已累计观看时长"+watchTime+"秒")
        }else{
        }
        swipeVideo()
    
    }

}

function swipeVideo(){

    let videoSwipeDistance=device.height-650//视频下滑的长度 px
    let offset=random(-100,0)
    swipe(halfDeviceWidth+random(-100,100), halfDeviceHeight+offset+(videoSwipeDistance/2), 
    halfDeviceWidth+random(-100,100), halfDeviceHeight+offset-(videoSwipeDistance/2), 500);
    sleep(1000)
}

//有range*2+1分之一的概率点喜欢,range*4+1分之一的概率点关注,关注必定喜欢
function likeAndfollow(range){
    let isLike=random(-1*range,range)
    if(isLike==0){        
        id("com.xiangzi.jukandian:id/small_video_like_layout").click()
        log("点了喜欢")

    }else{
        log("不是点喜欢的概率:"+isLike)
    }

}
function findClickUiIndexText(indexText){
    let textUI=text(indexText).findOne()
    if(!textUI){
        log("未找到指定文字的控件")
        return null
    }
    if(!textUI.clickable()){
        textUI=textUI.parent()
    }
    return textUI;
}

function swipeRight(){
    swipe(deviceWidth-100, halfDeviceHeight,  100, halfDeviceHeight, 500);
    sleep(1000)
}
