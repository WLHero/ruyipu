/**
 * Author hkuclion
 * hkuclion@163.com
 */

(function($){
	//below jquery 1.7;
	if(!$.fn.prop)$.fn.prop=$.fn.attr;	
	
	$.fn.hkuc_fs_trans=function(opt){
		return new $.hkuc_fs_trans(this,opt);
	}
	
	var defaults={
		'auto':5000,//自动间隔时间
		'duration':800,//切换花费时间
		'container':'ul',//container标签
		'element':'li',//container的子级选择器
		'buttonPrev':null,//null,jquery选择器
		'buttonNext':null,//null,jquery选择器
		'showNumber':true,//true,jquery选择器
		'buttonNumer':'<span></span>',//{$index}会被替换为为当前页码,此为false时不自动生成页码链接,使用showNumber的子元素作为页码
		//to:function
		
		'numberCallback':true,//true,自定义函数,具体写法见hkuc_fs_refresh_number,此为true时的默认处理函数
		'transCallback':null,
		'numberCurrentClass':'current',//当前页码的class
		'numberEvent':'click',//click,页面的事件
		'pause':true,//在移上时是否暂停
		'zIndex':1000,//基础zindex,内容zindex,当前内容为zindex+1,页码为zindex+2
		'type':'slide',//slide,fade
		'cacheImage':false,//是否在图片读取完成后才显示
		'loading':false,//在读取过程中显示的图片
		'cacheTimeout':10000,//读取超过多少时间后放弃读取,直接显示
		'adjustHeight':false,//根据内容最高高度将所有元素高度调整为统一高度
		'stopAnimation':false,//如果进入新的事件则停止已经存在的动画
		'fsCode':false,//全屏时加入代码结构
		
		'dummy':'dummy'
	};
	
	$.hkuc_fs_trans=function(wrapper,opt){
		var cache=this.cache=[];
		cache['this']=this;
		
		this.options    = $.extend({}, defaults, opt || {});
		this.locked     = false;
		this.$wrapper   = null;
		this.$container = null;
		this.$elements  = null;
		this.buttonNext = null;
        this.buttonPrev = null;
		
		this.$wrapper = $(wrapper);
		if(this.$wrapper.is(this.options['container'])){
			this.$container=this.$wrapper;
			this.$wrapper=this.$container.parent();
		}
		else{
			this.$container=this.$wrapper.children(this.options['container']);
		}
		
		if(typeof(this.options['numberCallback'])!='function'){this.options['numberCallback']=hkuc_fs_refresh_number;}
		if(typeof(this.options['transCallback'])!='function'){this.options['transCallback']=null;}
		
		this.$wrapper.data('this',this);
		if(this.options['cacheImage'])
			this.$container.css('visibility','hidden');
		
		this.$elements = this.$container.find(this.options['element']);
		this.length    = this.$elements.size();
		
		this.$wrapper.css({ 'width':'100%', 'overflow':'hidden', 'position':'relative','z-index':cache['this'].options.zIndex }).addClass('hkuc_fs_trans');
		this.$container.css({ 'position':'relative','z-index':cache['this'].options.zIndex });
		this.$elements.each(function(index){
			switch(cache['this'].options.type){
				case 'fade':
					$(this).css({ 'width':'100%', 'overflow':'hidden', 'left':0, 'position':'absolute','z-index':(index?cache['this'].options.zIndex:cache['this'].options.zIndex+1) });
					if(index!=0)$(this).hide();
					break;
				case 'slide':
				default:
					$(this).css({ 'width':'100%', 'overflow':'hidden', 'left':'0%', 'position':'absolute','z-index':(index?cache['this'].options.zIndex:cache['this'].options.zIndex+1) });
			}
			if(cache['this'].options.fsCode){
				$(this).html('<div class="hkuc_fs_center_wrapper" style="width: 100%; position: relative; left: 50%; height:100%;"><div class="hkuc_fs_center_outer" style="position: absolute;"><div class="hkuc_fs_center_inner" style="margin-left: -50%; *position: relative; *margin-left: 0px; *left: -50%;">'+$(this).html()+'</div></div></div>');
				
				$(this).css({ height:cache['this'].$wrapper.height() })
			}			
		})
		
		cache['image_srcs']=[];
		this.$elements.find('img').each(function(index){
			cache['image_srcs'][index]=$(this).attr('src');
		})
		cache['image_count']=cache['image_srcs'].length;
		cache['image_ready_count']=0;
		
		cache['element_count']=this.$elements.length;
		cache['image_objs']=[];
		cache['image_sizes']=[];
		
		if(this.options['cacheImage'] && cache['image_count']){
			for(var i=0; i<cache['image_srcs'].length; i++){
				cache['image_objs'][i]=new Image();
				$(cache['image_objs'][i]).data('cache',cache).data('index',i);
				
				$(cache['image_objs'][i]).bind('load',function(){
					var cache=$(this).data('cache');
					//if(!cache)cache=$(this).data().cache;//for IE6
					
					cache['image_sizes'][$(this).data('index')]={
						'width':this.width,
						'height':this.height
					};
					cache['image_ready_count']+=1;
					
					cache['this'].$wrapper.find('.img_loaded_count').html(cache['image_ready_count'])
					
					if(cache['image_ready_count']==cache['image_count']){
						cache['this'].$wrapper.find('.loading').hide();
						window.clearTimeout(cache['image_cache_timeout']);
						$.hkuc_fs_trans_init.call(cache['this']);
					}
				});
				
				cache['image_objs'][i].src=cache['image_srcs'][i];
			}
			
			this.$wrapper.append('<div class="loading">'+(this.options['loading']?'<img align="absmiddle" src="'+this.options['loading']+'">':'')+' 读取中 <span class="img_loaded_count">0</span>/'+cache['image_count']+' ...</div></div>');
			cache['image_cache_timeout']=window.setTimeout($.proxy(function(){
				$(this.cache['image_objs']).unbind('load');
				cache['this'].$wrapper.find('.loading').hide();
				$.hkuc_fs_trans_init.call(this);
			},this),this.options['cacheTimeout']);
		}
		else{
			$.hkuc_fs_trans_init.call(cache['this']);
		}
	}
	
	$.hkuc_fs_trans_init=function(){
		var cache=this.cache;
		
		if(this.options['adjustHeight']){
			var _maxHeight=0;
			
			this.$elements.each(function(){
				var cur_height=$(this).height();
				if(cur_height>_maxHeight)
					_maxHeight=cur_height;
			});
					
			this.$elements.height(_maxHeight);
			this.$wrapper.height(_maxHeight);
		}
		
		if(this.options['showNumber']){
			if(this.options['showNumber']===true){
				var numberStr='<div class="hkuc_fs_number_wrap"><ul class="hkuc_fs_number grid">';
				numberStr+='</ul></div>';
				this.$wrapper.append($(numberStr));
				var $numberWrapper=this.$wrapper.find('.hkuc_fs_number');
				this.$wrapper.find('.hkuc_fs_number_wrap').css('z-index',this.options['zIndex']+1);
			}
			else{
				var $numberWrapper=$(this.options['showNumber']);
			}
			
			
			$numberWrapper.css('z-index',this.options['zIndex']+1);
			
			if(this.options['buttonNumer']){
				var number_tag=$(this.options['buttonNumer']).prop('nodeName').toLowerCase();
				
				numberStr='';
				for(var i=0; i<cache['element_count']; i++){
					numberStr+=this.options['buttonNumer'].replace(/\{\$index\}/g,i+1);
				}
				$numberWrapper.append(numberStr);
				this.$number=$numberWrapper.children(number_tag);
			}
			else{
				this.$number=$numberWrapper.children();
			}
			
			this.$number.css('z-index',this.options['zIndex']+2).each(function(index){
				$(this).data('this',cache['this']);
				
				if(cache['this'].options['numberEvent']=='hover'){
					$(this).data('index',index).hover(function(){
						var $this=$(this);
						var back_this=$this.data('this');					
						hkuc_fs_trans_to.call(back_this,{ 'index':$this.data('index') });
					},$.noop);
				}
				else{
					$(this).data('index',index).click(function(){
						var $this=$(this);
						var back_this=$this.data('this');					
						hkuc_fs_trans_to.call(back_this,{ 'index':$this.data('index') });
					});
				}
			});
			
			this.options['numberCallback'].call(this,$(),this.$number.eq(0));
		}
		
		if(this.options['transCallback']){
			this.options['transCallback'].call(this,-1,0);
		}
		
		this.$container.css('visibility','visible');
		if(this.options['auto'])
			cache['TransTimeout']=window.setTimeout(jQuery.proxy(hkuc_fs_trans_to,this),this.options['auto']);
		cache['next']=1%cache['element_count'];
		cache['prev']=(cache['element_count']-1)%cache['element_count'];
		
		if(this.options['buttonPrev']){
			$(this.options['buttonPrev']).click(
				jQuery.proxy(
					function(){
						hkuc_fs_trans_to.call(this,{ 'index':'prev' });
					},this
				)
			)
		}
		if(this.options['buttonNext']){
			$(this.options['buttonNext']).click(
				jQuery.proxy(
					function(){
						hkuc_fs_trans_to.call(this,{ 'index':'next' });
					},this
				)
			)
		}		
		
		cache['current']=0;
		cache['lock']=false;
		cache['hover']=false;
		cache['recover']=false;
		
		if(this.options['pause'] && this.options['auto']){
			this.$wrapper.hover(
				jQuery.proxy(function(){
					var cache=this.cache;
					//window.clearTimeout(cache['TransTimeout']);
					cache['hover']=true;
				},this),
				jQuery.proxy(function(){
					var cache=this.cache;
					cache['hover']=false;
					if(cache['recover']){
						cache['recover']=false;
						cache['TransTimeout']=window.setTimeout(jQuery.proxy(hkuc_fs_trans_to,this),this.options['auto']);
					}
				},this)
			)
		}
		
		if(this.options['buttonNumber']){
			hkuc_fs_refresh_number.call(this);
		}
		
	}
	
	var hkuc_fs_trans_to=function(param){
		var cache=this.cache;

		if(this.$elements.filter(':animated').length){
			if(cache['this'].options['stopAnimation']){
				this.$elements.filter(':animated').stop(true,true);
			}
			else{
				return;
			}
		}
		
		if(cache['lock'])return;
		if(cache['hover'] && typeof(param)!='object'){
			cache['recover']=true;
			return;
		}
		cache['lock']=true;
		if(typeof(param)=='undefined')param={'index':'next'};

		
		if(typeof(param)=='object' && typeof(param['index'])!='undefined'){
			if(param['index']=='prev'){
				cache['next']=cache['prev'];
				
			}
			else if(param['index']=='next'){
				cache['next']=cache['next'];
			}
			else if(typeof(param['index'])=='number'){
				if(param['index']>=0 && param['index']<=cache['element_count']){
					cache['next']=param['index'];
				}
			}
			window.clearTimeout(cache['TransTimeout']);
		}
		
		if(this.options.type=='fade'){
			var $current=this.$elements.eq(cache['current']);
			var $next=this.$elements.eq(cache['next']);
			
			if(cache['current']==cache['next']){
				cache['next']=(cache['current']+1)%cache['element_count'];
				cache['prev']=(cache['element_count']+cache['current']-1)%cache['element_count'];
			}
		}
		if(cache['current']==cache['next']){
			cache['lock']=false;
			return;
		}
		
		var org_active=cache['current'];
		cache['current']=cache['next'];
		
		if(this.options.type=='fade'){
			$next.show();
			$current.fadeOut(this.options.duration,jQuery.proxy(function(){
				this.$elements.css('z-index',cache['this'].options['zIndex']);
				$next.css('z-index',cache['this'].options['zIndex']+1);
					if(this.options['auto'] && (!this.options['pause'] || !cache['hover'])){
						this.cache['TransTimeout']=window.setTimeout(jQuery.proxy(hkuc_fs_trans_to,this),this.options['auto']);
					}
					this.cache['lock']=false;
				},this)
			)
		}
		else{
			var dir;
			if(param.index=='next')dir='next';
			else if(param.index=='prev')dir='prev';
			else{
				if(cache['current'] > org_active)dir='next';
				else if(cache['current'] < org_active)dir='prev';
				else dir='next';
			}
			
			if(dir=='next'){
				this.$elements.eq(org_active).css({'left':'0%'});
				this.$elements.eq(cache['current']).css({'left':'100%'});

				this.$container.animate(
					{ 'left' : '-100%' },
					this.options.duration,
					jQuery.proxy(function(){
						if(this.options['auto'] && (!this.options['pause'] || !cache['hover'])){
							this.cache['TransTimeout']=window.setTimeout(jQuery.proxy(hkuc_fs_trans_to,this),this.options['auto']);
						}
						this.$container.css({'left':'0%'});
						this.$elements.eq(cache['current']).css({'left':'0%','z-index':cache['this'].options['zIndex']+1});
						this.$elements.eq(org_active).css({'z-index':cache['this'].options['zIndex']});
						this.cache['lock']=false;
					},this)
				);
			}
			else if(dir=='prev'){
				this.$elements.eq(org_active).css({'left':'0%'});
				this.$elements.eq(cache['current']).css({'left':'-100%'});
				
				this.$container.animate(
					{ 'left' : '100%' },
					this.options.duration,
					jQuery.proxy(function(){
 						if(this.options['auto'] && (!this.options['pause'] || !cache['hover'])){
							this.cache['TransTimeout']=window.setTimeout(jQuery.proxy(hkuc_fs_trans_to,this),this.options['auto']);
						}
						this.$container.css({'left':'0%'});
						this.$elements.eq(cache['current']).css({'left':'0%','z-index':cache['this'].options['zIndex']+1});
						this.$elements.eq(org_active).css({'z-index':cache['this'].options['zIndex']});
						this.cache['lock']=false;
					},this)
				);
			}
		}
		
		if(this.options['showNumber']){
			var $currentNumber=this.$number.filter('.'+this.options['numberCurrentClass']);
			var $targetNumber=this.$number.eq(cache['current']);
			
			this.options['numberCallback'].call(this,$currentNumber,$targetNumber);
		}

		if(this.options['transCallback']){
			this.options['transCallback'].call(this,org_active,cache['current']);
		}

		cache['next']=(cache['current']+1)%cache['element_count'];
		cache['prev']=(cache['element_count']+cache['current']-1)%cache['element_count'];
	}
	
	var hkuc_fs_refresh_number=function($currentNumber,$targetNumber){
		$currentNumber.removeClass(this.options['numberCurrentClass']);
		$targetNumber.addClass(this.options['numberCurrentClass']);
	}
})(jQuery);