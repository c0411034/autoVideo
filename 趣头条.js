/**
 * 1元起提，没有限制，只要求手机验证码
 */
const deviceHeight=device.height
const deviceWidth=device.width
const halfDeviceHeight=deviceHeight/2
const halfDeviceWidth=deviceWidth/2
const readTotalNum=20//需要阅读20篇
const perNewsReadTime=30//每篇文章阅读时长s

// test()
// onlyRun()
//只允许本脚本时，将上行解除注释
function onlyRun(){

    auto();
    console.show()
    log("开始刷趣头条")
    let totalTime=2*60*60 //刷2小时
    run(totalTime)
}

var quTouTiao = {};
quTouTiao.main = function (totalTime) {        
    run(totalTime)
  };
  
module.exports = quTouTiao;
function test(){
    
    watchSmallVideo()   
    exit();
}
function run(totalTime){

    launchApp()
    device.setBrightness(0)//设置屏幕亮度
    readNews(totalTime/2);
    watchSmallVideo(totalTime/2)   
// watchVideo()
}
function launchApp(){
    try {
        launchPackage("com.jifen.qukan")
        sleep(3000)
        text("我的").waitFor()
        log("已启动")
    } catch (error) {
        log("启动失败,再次启动")
        sleep(1000)
        launchApp()
    }
}
function readNews(totalTime){
    
    log("开始刷头条")
    //点击“看点”
    click(100,deviceHeight-200)
    sleep(2000)
    let readResule={
        readTime:0,
        readCount:0
    }
    while(totalTime>readResule.readTime||readTotalNum>readResule.readCount){
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
        // isHanveQiandaoBox()
    }
    return readResule
}
function readVideo(){
    
}
//找出当前页面所有文章的标题
function getCurrentScreenNews(){
    // let newsTitleArray= id("com.jifen.qukan:id/amd").find()
    let newsTitleArray= id("com.jifen.qukan:id/an2").find()
    return newsTitleArray;
}
//阅读一篇文章，传入文章的title的控件对象
function readNewsIndexTitleUi(NewsIndexFrame){
    NewsIndexFrame.click();
    sleep(1000)
    
    text("我来说两句...").waitFor()

    // let isHanveIncome=id("com.jifen.qukan:id/bnj").findOnce()//是否有收益图标
    // if(!isHanveIncome){
    //     log("没有收益图标")
    //     sleep(1000)
    //     newsBack()
    //     return{
    //         readTime:0,
    //         readCount:0
    //     }
    // }
    sleep(1000)
    randomSwipeIndexDirection(1)//先往下滑1下，启动计时
    let readTime=randomSwipe(perNewsReadTime)
    newsBack()
    return{
        readTime:readTime,
        readCount:1
    }
}
function newsBack(){
    let isHomePage=null
    while(!isHomePage){
        log("尝试返回")
        back()
        sleep(2000)
        isHomePage=text("小视频").findOnce()
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
        
        let replay= text("重播").findOnce()
        if(replay!=null){
            log("视频已经看完")
            return useTime;
        }
        //ToDo 1圈金币翻倍卡
    }
    return indexTime
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
        // id("com.xiangzi.jukandian:id/iv_cancel").click()
        sleep(1000)
    }
}
///////////////////////////////////////
function watchSmallVideo(totalTime){
    log("开始看视频")
    text("小视频").findOne().click()
    let perVideoWatchTime=10
    let totalWatchTime=1*3600//1小时
    let watchTime=0
    for(let i=0;i<totalTime/perVideoWatchTime;i++){
        // let isIncome=isNoIncome()
        // if(!isIncome){
        //     log("没有收益了，结束运行")
        //     runOver()
        // }
        sleep(3000)
        let isAd=text("查看详情").findOnce()
        if(!isAd){
            let waitTime=perVideoWatchTime-3+random(-5,5)//减去之前休息的上3000毫秒
            log("本条视频观看时长"+waitTime)
            sleep((waitTime-5)*2*1000);
            likeAndfollow(2)
            sleep(5*2*1000);
            watchTime+=waitTime
            log("已累计观看时长"+watchTime+"秒")
        }else{
            let isFuli=text("广告").findOnce()
            if(isFuli){
                //如果是惊喜福利限时领则不管
            }else{
                //正常广告
                sleep(18000);
            }
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
        click(halfDeviceWidth,halfDeviceHeight)
        sleep(50)
        click(halfDeviceWidth,halfDeviceHeight)
        log("双击喜欢")
        let isFollow=random(-1*range,range)
        if(isFollow==0){            
        id("com.jifen.qukan:id/s_").click()
            log("点了关注")
        }else{
            log("不是点关注的概率:"+isFollow)
        }

    }else{
        log("不是点喜欢的概率:"+isLike)
    }

}
function watchVideo(){
    text("视频").click()
    sleep(2000)

}