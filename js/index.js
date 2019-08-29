/**
 *@project： JDMobile
 *@package：
 *@date：2019/3/15 0015 15:17
 *@author 郭宝
 *@brief: index 页面的js操作类
 */



/*
* JS的入口函数
* */
window.onload = function () {
    search();
    automaticCarousel();
    countDown();
};

/*
* 搜索栏上下滚动时颜色的渐变动态效果
* */
function search() {

    /*
    * 分析：
    * 1、搜索栏默认是透明的颜色
    * 2、上下滚动时，当滚动的高度<轮播图的高度时，搜索栏的颜色始终处于渐变的状态
    * 3、上下滚动时，当滚动的高度>轮播图的高度时，搜索栏的颜色为京东颜色
    * */
    //获取当前的顶部搜索栏对象
    let jd_search =  document.querySelector(".jd_search");

    /*获取当前轮播图的对象*/
    let jd_banner = document.querySelector(".jd_banner");
    /*获取轮播图的高度*/
    let bannerHeight = jd_banner.offsetHeight;

    /*
    * 监听滚动事件
    * */
    window.onscroll = function () {

        /*
        * 获取当前滚动的高度
        * */
        let scrollHeight =  document.body.scrollTop;
        if (scrollHeight==0){
            scrollHeight  = document.documentElement.scrollTop;
        }
        if (scrollHeight==0){
            scrollHeight =  window.pageYOffset;
        }

        console.log("scrollHeight:"+scrollHeight);

        //透明度默认为完全透明
        let transparency = 0;
        if (scrollHeight<bannerHeight){
            //如果滚动的高度小于轮播图的高度，那么颜色渐变
            transparency = scrollHeight/bannerHeight*0.85;
        }else {
            //如果滚动的高度大于或者等于轮播图的高度，那么将当前的透明度设置为京东红
            transparency = 0.85;
        }

        jd_search.style.backgroundColor = "rgba(201,21,35,"+transparency+")";
    }

};


/*
* 自动轮播的函数
* */
function automaticCarousel() {

    /*
    * 自动轮播图分析
    *1、自动轮播，并且要无缝轮播（利用transform实现切换）
    *2、点随着轮播图而改变（根据当前的索引进行切换）
    *3、当手指按下时，轮播图要跟随着手指来回滑动（利用touch事件来完成该效果）
    *4、当手指滑动的距离小于1/3时，那么当前图片回归到原位（利用transform来实现）
    *5、当手指滑动的距离大于1/3时，那么切换当前的图片（往左切换、往右切换） （可以根据滑动的方向和transform来实现）
    * */


    //获取当前的轮播图容器
    let jd_banner  = document.querySelector(".jd_banner");

    //获取当前轮播图容器的宽度（其实也是屏幕的宽度）
    let screenWidth = jd_banner.offsetWidth;

    //获取轮播图列表
    let imgBox = jd_banner.querySelector("ul:first-child");

    //获取指针容器
    let pointBox = jd_banner.querySelector("ul:last-child");


    //获取所有点
    let points  = pointBox.querySelectorAll("li");


    //定义一个默认的索引值，记录当前轮播时的索引，之所以默认值为1是因为轮播图默认显示的就是translateX(-10%);（也就是第一张图片，而非第8张图片）
    let index = 1;

    /*
    * 添加过渡
    * */
    function addTransition(){
        //过渡  transition 和 webkitTransition 是CSS3的属性。"all 0.2s"表示所有的都执行0.2秒过渡
        //webkitTransition 表示兼容以webkit为核心的浏览器
        imgBox.style.transition = "all 0.2s";
        imgBox.style.webkitTransition = "all 0.2s";
    }

    /*
    位移
     */
    function transform(translateX){
        //图片向左位移
        // "translateX(-"+(10*index)+"%)"  因为默认的情况是显示第一张轮播图，也就是位移 -10% ，那么就以-10%为一个轮播图计算，以下标为图片的个数，显示第几张图片就位移-(10*index)%
        imgBox.style.transform = "translateX("+translateX+"px)";
        imgBox.style.webkitTransform = "translateX("+translateX+"px)";
    }

    /*
    * 清除过渡
    * */
    function clearTransition(){
        imgBox.style.transition = "none";
        imgBox.style.webkitTransition = "none";
    }


    //定时器实现自动轮播
    let timer = setInterval(function () {

        console.log("index:"+index);

        //3秒过后切换到下一张时，也让下标累加
        index++;

        //加过渡
        addTransition();

        //位移
        transform(-index*screenWidth);

    },1000);



    /*
    为了避免出现累计下标超过图片的个数10,出现显示空白的BUG,那么这里需要做处理
        //之所以这里是9，是因为当前总共是10张图片，默认下标是1，也就是从第二张图片开始的，那么这样算下来，最后一张的索引就是9，也就是如果是最后一张图片，
        //也就是如果是最后一张图片，那么就从第二张开始继续轮询
    * 过渡结束的监听器
    * */
    imgBox.addEventListener("transitionend",function () {
        if (index>=9){
            index = 1;

            //清过渡
            clearTransition();

            //位移
            transform(-index*screenWidth);


            //为了防止手指滑动到索引为0的照片时，左边没有图片了，那么这时候就下标瞬间定位到下标为8的图片，
            // 因为下标为8的图片和下标为0的图片是一样的，而下标为8的图片左边还有更多的图片，这样就实现了可以继续往左滑动
            //轮播图的结构为 8，1，2，3，4，5，6，7，8，1
        }else if (index<=0) {
            index = 8;

            //清过渡
            clearTransition();

            //位移
            transform(-index*screenWidth);

        }

        console.log("index---:"+index);
        setPoint();
    });


    /*
    * 设置点跟随图片设置对应的样式
    * */
    function setPoint() {

        //设置之前先清除所有点的样式
        for (let i = 0; i <points.length ; i++) {
            let point = points[i];
            point.classList.remove("now")
        }

        //给当前的图片加上点的样式
        //index-1 之所以是该值，是因为index的取值范围是1~8，而点下标的取值范围是0~7，图片的下标-1其实就是点的索引
        points[index-1].classList.add("now");

    };

    /*
    * 实现手指滑动轮播图的效果
    * */

    //记录当前的触摸的起始点
    let startX = 0;
    //移动的距离
    let distanceX = 0;

    let isMove = false;
    /*
    * 手指按下的触摸的监听
    * */
    imgBox.addEventListener("touchstart",function (e) {
        //当手指触摸轮播图时，清除自动轮播
        clearInterval(timer)

        //获取第一个触摸点对象
        let touchPoint =  e.touches[0];

        //获取触摸点的起始点
        startX = touchPoint.clientX;
        console.log("startX:"+startX);
    });

    /*
    * 手指移动的监听
    * */
    imgBox.addEventListener("touchmove",function (e) {

        //获取第一个触摸点对象
        let touchPoint =  e.touches[0];

        //获取触摸点的移动点
        let moveX  = touchPoint.clientX;

        //计算移动的距离 = 移动的X轴像素值 - 起始的X轴像素值
        distanceX = moveX - startX;

        console.log('distanceX:'+distanceX);

        //元素当前的定位点 = 移动的距离 + 当前定位
        let transition = -index * screenWidth + distanceX;

        console.log('transition:'+transition);

        //清过渡（为了防止出现滑动延迟，那么首先要清过渡，因为过渡有0.2s的执行时间）
        clearTransition();
        //位移
        transform(transition);


        isMove = true;

    });

    /*
    * 手指松开的监听
    * */
    imgBox.addEventListener("touchend",function (e) {

        //为了防止未出现手指移动，而只是轻触了屏幕而导致切换或恢复，那么这里先加判断。因为手指轻触但未移动，最终手指抬起也是会触发该事件监听的
        if (isMove){
            /*
      * 当移动的距离小于1/3，那么图片恢复到原位，否则切换图片（上一张/下一张）
      * */

            if (Math.abs(distanceX)<screenWidth/3){
                //添加过渡
                addTransition();

                //设置位移 为当前位置
                transform(-index * screenWidth);

            }else {
                /*
                手指往左滑动=移动的距离为负数
                手指往有滑动=移动的距离为正数
                那么就可以根据移动的距离的正负数来判断是该上一张还是下一张
                 */

                if (distanceX>0){
                    //显示上一张
                    index--;
                }else {
                    //显示下一张
                    index++;
                }
                //添加过渡
                 addTransition();
                //设置位移
                transform(-index * screenWidth);
            }

        }


        /*
        * 滑动结束以后重置数据
        * */
        startX = 0;
        distanceX = 0;
        isMove = false;

        //添加之前先清除定时器
        clearInterval(timer);
        //滑动结束以后重新启动定时器
        timer = setInterval(function () {

            console.log("index:"+index);

            //3秒过后切换到下一张时，也让下标累加
            index++;

            //加过渡
            addTransition();

            //位移
            transform(-index*screenWidth);

        },1000);

    });


}


/*
* 掌上秒杀倒计时
* */
function countDown() {

    //默认的倒计时时间为2小时
    let time = 2*60*60;

    //获取要显示时间的dom元素(所有span标签)
    let spans = document.querySelector('.time').querySelectorAll('span');


    //1秒1执行
    let timer = setInterval(function () {

        //每执行一次减1秒
        time--;

        //计算出当前的小时;Math.floor表示向下取整
        let h =  Math.floor(time/60/60);

        //分钟
        let m = Math.floor(time%3600/60);

        //秒
        let s = time%60;

        /*
        * 更新小时的数据
        * spans[0] 是小时的十分位数据
        * */
        spans[0].innerHTML = Math.floor(h/10);
        spans[1].innerHTML = h%10;

        /*
        * 更新分钟的数据
        * */
        spans[3].innerHTML = Math.floor(m/10);
        spans[4].innerHTML = m%10;


        /*
        * 更新秒的数据
        * */
        spans[6].innerHTML = Math.floor(s/10);
        spans[7].innerHTML = s%10;

        /*
        * 如果倒计时的时间结束了，那么关闭定时器
        * */
        if (time<=0){
            clearInterval(timer);
        }

    },1000);

}
