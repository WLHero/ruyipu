$(function(){
	index();
     $("[data-original]").lazyload({effect: "fadeIn",threshold:"100"})
})


function index(){
    $('.commonHoverA a').hover(function() {
        $(this).addClass('active').siblings('a').removeClass('active')
    })
}

function resizes(){
    winH = $(window).height()
}



function imgfadeIn(obj){
    var obj=obj
    var imgL=obj.find('.backLazys').length;
    setTimeout(function(){
        obj.find('.backLazys').each(function(){
            var imgori=$(this).attr('data-original')
            $(this).css({'background-image':'url('+imgori+')'})
        })
    },100)
}
function move (elem) {
    var $owlpagination=elem.find('.owl-pagination .active').index();
    var obj = elem.find('.item').eq($owlpagination)
    imgfadeIn(obj)
}
