$(document).ready(function(){
	scrolltop();

})
$(window).resize(function(){
		scrolltop();

	})
$(window).load(function(){
	aa('.course_php_title',500)
	var bannerbgH=$('#banner_center_indicator .bg .img2').height();
	var bannerbgH3=$('#banner_center_indicator .bg .img3').height();
	console.log(bannerbgH)
	$('#banner_center_indicator .bg .img2').css({'margin-left':-bannerbgH/2+'px','margin-top':-bannerbgH/2+'px'})
	$('#banner_center_indicator .bg .img3').css({'margin-left':-bannerbgH3/2+'px','margin-top':-bannerbgH3/2+'px'})
})
var winH=$(window).height();
function scrolltop(){
	var winW=$(window).width();
	var coursecontentTop,coursetitleTop,videoenTop,commonclub_title,promoteenTop,companytitleTop,videocontrolTop,comphptitleTop,comuititleTop,commonclubtitle,promoteenTop
	$(window).load(function(){
		coursecontentTop=$('.course_php_content').offset().top-winH/3*2;
		coursetitleTop=$('.course_ui_title').offset().top-winH/3*2;
		videoenTop=$('.video_en').offset().top-winH/3*2;
		videocontrolTop=$('.video_control_prev').offset().top-winH/3*2;
		companytitleTop=$('.company_title').offset().top-winH/3*2;
		comphptitleTop=$('.comphp_title').offset().top-winH/3*2;
		comuititleTop=$('.comui_title').offset().top-winH/3*2;
		commonclub_title=$('.commonclub_title').offset().top-winH/3*2;
		promoteenTop=$('.promote_en').offset().top-winH/3*2;
	})
	$(window).scroll(function(){
		var scrollTop=$(this).scrollTop();
		if($('.course_php_content').length>0){
			offsetTop6('.course_php_content')
			offsetTop2('.course_ui_title',$(this),coursetitleTop,aa,'.course_ui_content',200,aa,'.course_ui_bottom',400)
			offsetTop2('.video_en',$(this),videoenTop,aa,'.video_cn',200,aa3,'#video_play_icon',400)
			offsetTop7('.video_control_prev',$(this),videocontrolTop,aa2,'.video_control_next',0)
			offsetTop2('.company_title',$(this),companytitleTop,aa,'.company_content',200,aa,'company_bottom',400)
			offsetTop2('.comphp_title',$(this),comphptitleTop,aa,'.comphp_content',200,aa,'.comphp_bottom',400)
			offsetTop2('.comui_title',$(this),comuititleTop,aa,'.comui_content',200,aa,'.comui_bottom',400)
			offsetTop2('.commonclub_title',$(this),commonclub_title,aa,'.commonclub_content',200,aa,'.commonclub_bottom',400)
			offsetTop('.promote_en',$(this),promoteenTop,aa,'.promote_cn',150)
		}
	})

	
	
}

function aa(obj,time){
	setTimeout(function(){
		$(obj).animate({'top':0,opacity:1},1200)
	},time)
}
function aa1(obj,time){
	setTimeout(function(){
		$(obj).animate({'top':0,opacity:0.5},900)
	},time)
}

function aa2(obj,time){
	setTimeout(function(){
		$(obj).animate({'bottom':0,opacity:1},900)
	},time)
}
function aa3(obj,time){
	setTimeout(function(){
		$(obj).animate({'margin-top':0,opacity:1},900)
	},time)
}

function offsetTop(oo,obj,top,fn,oo1,time){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
			console.log(oo)
	  		if($(oo).css('opacity')==0){
    			$(oo).animate({'top':0,opacity:1},1200);
    			fn(oo1,time)
    		}
	  }
}
function offsetTop1(oo,obj,top,fn,oo1,time){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
	  		if($(oo).css('opacity')==0){
    			$(oo).animate({'top':0,opacity:1},1200);
    			fn(oo1,time)
    		}
	  }
}
function offsetTop2(oo,obj,top,fn,oo1,time,fn2,oo2,time2){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
	  		if($(oo).css('opacity')==0){
    			$(oo).animate({'top':0,opacity:1},1200);
    			fn(oo1,time)
    			fn2(oo2,time2)
    		}
	  }
}

function offsetTop3(oo,fn,oo1,time){
  		if($(oo).css('opacity')==0){
			$(oo).animate({'top':0,opacity:1},1200);
			fn(oo1,time)
		}
}
function offsetTop4(oo,fn,oo1,time,fn2,oo2,time2){
  		if($(oo).css('opacity')==0){
			$(oo).animate({'top':0,opacity:1},1200);
			fn(oo1,time)
			console.log(oo2)
			fn2(oo2,time2)
		}
}
function offsetTop5(oo,obj,top,fn,oo1,time,fn2,oo2,time2,fn3,oo3,time3){
		var scrollTop=obj.scrollTop();
		if(scrollTop>top){
			console.log('进来')
			if($(oo).css('opacity')==0){
				$(oo).animate({'top':0,opacity:1},1200);
				fn(oo1,time)
				console.log(oo2)
				fn2(oo2,time2)
				fn3(oo3,time3)
			}
		}
  		
}
function offsetTop6(oo){
  		if($(oo).css('opacity')==0){
			$(oo).animate({'top':0,opacity:1},1200);
			
		}
}
function offsetTop7(oo,obj,top,fn,oo1,time){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
			console.log(oo)
	  		if($(oo).css('opacity')==0){
    			$(oo).animate({'bottom':0,opacity:1},1200);
    			fn(oo1,time)
    		}
	  }
}
function eachTop(oo,obj,top,each){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
			if($(oo).css('opacity')==0){
				$(oo).each(function(index){
					$(this).delay(index*250).animate({'top':0,opacity:1},1200);
				})
			}
		}
}
function eachTop1(oo,obj,top,each){
	var scrollTop=obj.scrollTop();
	if(scrollTop>top){
			if($(oo).css('opacity')==0){
				$(oo).each(function(index){
					$(this).delay(index*250).animate({'top':0,opacity:0.5},1200);
				})
			}
		}
}
function eachTop2(oo,each){
	if($(oo).css('opacity')==0){
		$(oo).each(function(index){
			$(this).delay(index*250).animate({'top':0,opacity:1},1200);
		})
	}
}