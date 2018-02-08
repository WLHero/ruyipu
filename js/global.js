var $topline, $menu, $menu_bg, $menu_fg, $menu_group, $menu_items;
var menu_current = 1;

$(document).ready(function () {
    $topline = $('#top_line');
    $menu = $('#menu');
    $menu_bg = $('#menu_bg');
    $menu_fg = $('#menu_fg');
    $menu_group = $menu_bg.add($menu_fg);
    $menu_items = $menu_fg.find('ul.list li');

    $('#nav,#page_nav').hover(function (event) {
        $(this).toggleClass('hover', event.type == 'mouseenter');
    }).on('touchend click', function () {
        var $this = $(this);
        toggleMenu(!$this.is('.active'));
        return false;
    });

    $menu_items.find('span').on('click',function(){
        var index = $(this).parent().parent().children().index($(this).parent());
        gotoMenu(index);
        return false;
    })

    $menu.swipe({
        swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
            if (direction == 'up') {
                gotoMenu(MENU_INDEX + 1);
            }
            else if (direction == 'down') {
                gotoMenu(MENU_INDEX - 1);
            }
            else if (direction == 'right') {
                if (distance >= $menu.width() / 5)
                    toggleMenu(false);
            }
        },
        threshold: 0,
        fingers: 'all'
    });
    $menu.swipe('disable');

    gotoMenu();
    indexFun()
    indexs();
    
});
$(window).load(function(){
    resizes();
    })
$(window).resize(function(){
    resizes();
})


var MENU_RATIO = 2;
var MENU_INDEX = 1;

function whenResizeMenu() {
    resizeMenu();
    gotoMenu(MENU_INDEX);
}
function whenScrollMenu(event) {
    gotoMenu(event.deltaY > 0 ? MENU_INDEX - 1 : MENU_INDEX + 1);
    return false;
}

function toggleMenu(show) {
    if (typeof(show) != 'boolean') {
        show = !$topline.is('.active');
    }

    $('#nav,#page_nav').toggleClass('active', show);
    $topline.toggleClass('active', show);
    $(document.body).toggleClass('noscroll');
    if (show) {
        whenResizeMenu();
        window.setTimeout(whenResizeMenu, 250);
        $(window)
            .on('mousewheel.menu', whenScrollMenu)
            .on('resize.menu', whenResizeMenu);
        $menu.swipe('enable');
    }
    else {
        $(window)
            .off('mousewheel.menu')
            .off('resize.menu');
        $menu.swipe('disable');
    }
}

function resizeMenu() {
    var menu_height = $menu.height();
    var menu_width = $menu.width();
    var diameter = menu_height * MENU_RATIO;

    $menu_group.css({
        'height': diameter,
        'width': diameter,
        'left': Math.min(menu_width - diameter - $menu_items.filter('.active').find('a').width() - 40, -diameter / 2),
        'top': (menu_height - diameter) / 2
    });

    $menu_items.css('font-size', menu_height / 475 + 'em');
}

function gotoMenu(to_index) {
    if (to_index === MENU_INDEX)return;
    if (typeof(to_index) == 'undefined')to_index = MENU_INDEX;

    to_index = Math.max(0, Math.min($menu_items.length - 1, to_index));
    MENU_INDEX = to_index;

    var menu_height = $menu.height();
    var diameter = menu_height * MENU_RATIO;

    var angle = Math.atan2(menu_height, diameter) / Math.PI * 180 * ($menu_items.length - 1);


    $menu_items.each(function (index) {
        var rotate = (index - to_index) / $menu_items.length * angle + 90;

        $(this)
            .css('transform', 'rotate(' + rotate.toFixed(2) + 'deg) translateY(-10px)')
            .toggleClass('active', index == to_index)
            .children('a').css('transform', 'rotate(' + -rotate.toFixed(2) + 'deg) translateX(3.5em)');

    })
}

function indexs(){
    setTimeout(function(){
        $('.page_banner .page_big').animate({'opacity':1,'top':'0'},1000)
    },800)
    setTimeout(function(){
        $('.page_banner .page_smale').animate({'opacity':1,'top':'0'},1000)
    },900)

    $('.base_pic_list li').hover(function(){
        $(this).find('.base_pic1').css({'z-index':9}).stop().animate({opacity:0})
        $(this).find('.base_pic2').css({'z-index':10}).stop().animate({opacity:1})
    },function(){
         $(this).find('.base_pic1').css({'z-index':10}).stop().animate({opacity:1})
        $(this).find('.base_pic2').css({'z-index':9}).stop().animate({opacity:0})
    })
}

function indexFun(){
   /* var dots_index=0;
    setInterval(function(){
        $('.party_dots span').each(function(){
            if($(this).index('.party_dots span')%3==dots_index){
                $(this).siblings().animate({'opacity':'0'},400)
            
                $(this).animate({'opacity':1},400)
            }                                                            
        });
        dots_index++;
        if(dots_index==3){
            dots_index=0;
        }

    },400);*/
    var video_left=$('#video .video_kk').css('left');
    $('#video .video_kk,#video_control').css({'top':video_left,'bottom':video_left})
    $('.video_control_prev,.video_control_next').hover(function(){
        $(this).addClass('active');
    },function(){
        $(this).removeClass('active');
    })
    $('#share a').hover(function(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
    })

    $('.course_select .course_choic li').on('click',function(){
        var index=$(this).index();
        $(this).find('.course_choic_p2').stop().animate({'top':0,opacity:1},600)
        $(this).siblings().find('.course_choic_p2').stop().animate({'top':40,opacity:0},600)
        $('.course_contro li').eq(index).siblings().hide().find('.course_choic_list a').css({'opacity':0,top:40})
        $('.course_contro li').eq(index).show().find('.course_choic_list a').each(function(index){
            $(this).delay(100*index).animate({top:0,opacity:1},600)
        })
    })

    $('#theme_bottom').on('click',function(){
        var winH=$(window).height();
        $('html,body').animate({scrollTop:winH},500)
    })
}

function resizes(){
    var winH=$(window).height();
    $('.theme_banner').height(winH)
    var top_lineH=$('#top_line').height();
    $('#training_banner').height(winH-top_lineH)
    if($('#page_num').length>0){
        var page_numTop=$('#page_num').offset().top-winH*11/12
    }
    if($('#page_num3').length>0){
        var page_num3Top=$('#page_num3').offset().top-winH*11/12
    }
    var train_bannerFH=$('.train_bannerS').outerHeight();
    $('#train_banner,#train_banner li').height(train_bannerFH)
    var textnum=1;
    var textnum3=1
    $(window).scroll(function(){
        var scrollTop=$(this).scrollTop();
        if(page_num3Top<scrollTop){
            setTimeout(function(){
            if(textnum3==1){
                textnum3=0;
                var texthidval3=$('.change_num3_hide').val();
                var i1=0;
                var timer=setInterval(function(){
                    if(i1<texthidval3){
                        console.log(texthidval3-i1<10)
                        if(texthidval3>1000){
                            if(texthidval3-i1<100 && texthidval3-i1>10){
                                var tennum=texthidval3-i1;
                                i1=i1+10;
                            }else if(texthidval3-i1<10){
                                i1=i1+1;
                            }else{
                                i1=i1+100
                            }
                        }else{
                           i1++; 
                        }
                    }else{
                        clearInterval(timer);
                    }
                    $('.change_num3').html(i1);
                },100)
            }
        },900)
        }
        if(page_numTop<scrollTop){
        setTimeout(function(){
            if(textnum==1){
                textnum=0;
                var texthidval1=$('.change_num1_hide').val();
                console.log(texthidval1)
                var texthidval2=$('.change_num2_hide').val();
                var i1=0;
                var timer=setInterval(function(){
                    if(i1<texthidval1){
                        if(texthidval1>1000){
                            if(texthidval1-i1<100 && texthidval1-i1>10){
                                var tennum=texthidval1-i1;
                                i1=i1+10;
                            }else if(texthidval1-i1<10){
                                i1=i1+1;
                            }else{
                                i1=i1+100
                            }
                        }else{
                           i1++; 
                        }
                    }else{
                        clearInterval(timer);
                    }
                    $('.change_num1').html(i1);
                },100)
                var i2=0
                var timer2=setInterval(function(){
                    if(i2<texthidval2){
                        i2++;
                    }else{
                        clearInterval(timer2);
                    }
                    $('.change_num2').html(i2);
                },100)

            }
        },900)
    }
    })  
    setTimeout(function(){
         $('.theme_banner .theme_pic').animate({'right':0,top:0,opacity:1},1200)
     },600)
   
    
}

(function($) {
    $.fn.scrollFade = function( config ) {
        var defaults = {
            out     : 0,    // 透明度
            duration: 900,  // 時間
            hAnime     : 200    // 上下移動距離
        };
        var config = $.extend( defaults, config );
        var target = this;

        function fade() {
            target.each( function( i, e ) {
                var in_position = $( e ).offset().top + $( window ).height() / 15; // 変化
                var window_bottom_position = $( window ).scrollTop() + $( window ).height();
                if ( in_position < window_bottom_position ) {
                    $( e ).animate({
                        opacity: 1,
                        top:0
                    }, {
                        queue   : false,
                        duration: config.duration,
                    });
                } else {
                    return;
                    if( $( e ).css( 'opacity' ) > config.out ) {
                        return;
                        $( e ).animate( {
                            opacity: config.out,
                            top: config.hAnime
                        }, {
                            queue   : false,
                            duration: config.duration,
                            easing  : 'easeOutQuad'
                        } );
                    }
                }
            } );
        }
        fade();

        $( window ).scroll( function() {
            fade();
        });

        $( window ).resize( function() {
            fade();
        } );
        return target;
    };
} )( jQuery );

$(function(){
    jQuery('.article-block').scrollFade();
})