/*!
 * Amaretti v2.0.0
 * https://foxythemes.net
 *
 * Copyright (c) 2018 Foxy Themes
 */

var App = (function () {
  'use strict';

  //Basic Config
  var config = {
    assetsPath: 'assets',
    imgPath: 'img',
    jsPath: 'js',
    libsPath: 'lib',
    leftSidebarSlideSpeed: 200,
    enableSwipe: true,
    swipeTreshold: 100,
    scrollTop: true,
    openLeftSidebarClass: 'open-left-sidebar',
    openRightSidebarClass: 'open-right-sidebar',
    removeLeftSidebarClass: 'am-nosidebar-left',
    openLeftSidebarOnClick: false,
    openLeftSidebarOnClickClass: 'am-left-sidebar--click',
    enableLeftSidebarOpenSubMenuDelay: false,
    enableLeftSidebarOpenSubMenuDelayClass: 'am-left-sidebar--delay',
    leftSidebarOpenSubMenuDelay: 500,
    leftSidebarCloseSubMenuDelay: 400,
    transitionClass: 'am-animate',
    openSidebarDelay: 400,
    syncSubMenuOnHover: false
  };

  var colors = {};
  var scrollers = {};
  var body, wrapper, mainContent, leftSidebar, rightSidebar;
  var closeMenuDelay, closeSubMenuDelay, openSubMenuDelay;
  var openSidebar = false;
  var isRtl = $('html').hasClass('rtl');
  var asideDiv = $('.am-scroller-aside');
  var chatSection = $('#chat-section');

  //Perfect scrollbar variables
  var ps_am_scroller,
      ps_fixed_left_sidebar_scroll,
      ps_top_messages_scroll,
      ps_notifications_scroll,
      ps_announcement_scroll,
      ps_chat_scroll,
      ps_page_chat_scroll,
      ps_faqs_scroll,
      ps_ticket_scroll,
      ps_messages_scroll,
      ps_page_messages_scroll,
      ps_aside_scroll;

  // Refresh scroller
  function updateScroller(ps_object){
    ps_object.update();
  }

  // Destroy scroller
  function destroyScroller(ps_object){
    ps_object.destroy();
  }

  // Initialize scroller
  function initScroller(domObject) {
    return new PerfectScrollbar(domObject[0], {
      wheelPropagation: false
    });
  }

  //Core private functions
  function leftSidebarInit(){
    var firstAnchor = $(".sidebar-elements > li > a", leftSidebar);
    var subMenus = $(".sidebar-elements > li > ul", leftSidebar);
    var openLeftSidebarOnClick = leftSidebar.hasClass( config.openLeftSidebarOnClickClass ) || config.openLeftSidebarOnClick ? true : false;
    var enableLeftSidebarOpenSubMenuDelay = leftSidebar.hasClass( config.enableLeftSidebarOpenSubMenuDelayClass ) || config.enableLeftSidebarOpenSubMenuDelay ? true : false;

    function syncSubMenu( item ){
      var elements = $(".sidebar-elements > li", leftSidebar);

      if( typeof item !== "undefined" ) {
        elements = item;
      }

      $.each( elements, function(i, v){

        var title = $(this).find("> a span").html();
        var ul = $(this).find("> ul");
        var subEls = $("> li", ul);
        var title = $('<li class="title">' + title + '</li>');
        var subContainer = $('<li class="nav-items"><div class="am-scroller"><div class="content"><ul></ul></div></div></li>');

        if( !ul.find("> li.title").length > 0 ){
          ul.prepend( title );
          subEls.appendTo( subContainer.find(".content ul") );
          subContainer.appendTo( ul );
        }
      });
    }

    /*Create sub menu elements*/
      syncSubMenu();

    function oSidebar(){
      body.addClass( config.openLeftSidebarClass + " " + config.transitionClass );
      openSidebar = true;
    }

    function cSidebar(){
      body.removeClass( config.openLeftSidebarClass ).addClass( config.transitionClass );
      sidebarDelay();
    }

    function closeOpenSubMenu(){
      $("ul.visible", leftSidebar).removeClass("visible").parent().removeClass('open');
    }

    function openSubMenu( el, event, click ){
      var li = $(el).parent();
      var subMenu = li.find("> ul");
      var scroller = subMenu.find(".am-scroller");
      var isOpen = li.hasClass('open');
      var isTouch = event.type == "touchstart" ? true : false;

      //Show sub menu element
      if( !$.isXs() ){
        if( !enableLeftSidebarOpenSubMenuDelay || isTouch ){
          closeOpenSubMenu();
        }

        //Add classes to create a delay on sub menu close action after mouse leave
        if( !click || ( click && !isOpen ) ){
          if( enableLeftSidebarOpenSubMenuDelay && !click ) {

            openSubMenuDelay = setTimeout(function(){
              if( li.is(":hover") ) {
                closeOpenSubMenu();

                // Open sub-menu
                li.addClass('open');
                subMenu.addClass('visible');
              }
            }, config.leftSidebarOpenSubMenuDelay);

          } else {
            li.addClass('open');
            subMenu.addClass("visible");
          }
        }
        subMenu.removeClass("hide");
      }

      //Renew Perfect Scroller instance
      if (typeof ps_am_scroller !== "undefined") {
        destroyScroller(ps_am_scroller);
      }
      if (typeof ps_am_scroller === "undefined" || !ps_am_scroller || !ps_am_scroller.nodeName) {
        ps_am_scroller = initScroller(scroller);
      }

      //Check if event is click or hover
      if( click && li.hasClass('parent') ){
        //Stop click event when li has sub-menu
        event.preventDefault();
      }else if(config.syncSubMenuOnHover) {
        //Create sub-menu elements
        syncSubMenu( li );
      }
    }

    /*Open-Sidebar when click on topbar button*/
      $('.am-toggle-left-sidebar').on("click", function(e){
        if( openSidebar && body.hasClass( config.openLeftSidebarClass ) ){
          cSidebar();
        }else if( !openSidebar ){
          oSidebar();
        }
        e.stopPropagation();
        e.preventDefault();
      });

    /*Close sidebar on click outside*/
      $(document).on("touchstart mousedown focusin",function(e){
        if ( !$(e.target).closest(leftSidebar).length && body.hasClass( config.openLeftSidebarClass ) ) {
          cSidebar();
        }else if( !$(e.target).closest(leftSidebar).length && !$.isXs() ){
          $("ul.visible", leftSidebar).removeClass("visible").parent().removeClass('open');
        }
      });

    /*Open sub-menu functionality*/
      if( openLeftSidebarOnClick ){

        /*Open sub-menu on click*/
        firstAnchor.on('click',function( e ){
          if( !$.isXs() ){
            openSubMenu(this, e, true); 
          }
        });

      }else{

        /*Open sub-menu on hover*/
        firstAnchor.on('mouseover',function( e ){
          var li = $(this).parent();

          // Clear all the active delays
          clearTimeout(closeMenuDelay);
          clearTimeout(closeSubMenuDelay);
          clearTimeout(openSubMenuDelay);

          // Don't do anything if the sub menu is open
          if( !li.hasClass('open') ) {
            openSubMenu(this, e, false);
          }
        });

        /*Open sub-menu on focus*/
        firstAnchor.on('focus',function(e){
          openSubMenu(this, e, false);
        });

        /*Open sub-menu on click (fix for touch devices)*/
        firstAnchor.on('touchstart',function( e ){
          if( !$.isXs() ){
            openSubMenu(this, e, true);
          }
        });

        /*Sub-menu delay on mouse leave*/
        firstAnchor.on('mouseleave',function(){
          var _self = $(this);
          var _li = _self.parent();
          var subMenu = _li.find("> ul");

          clearTimeout(openSubMenuDelay);

          // if it's not a mobile device and main item has open class
          if( !$.isXs() ){

            // If menu has a sub menu
            if ( subMenu.length > 0 ){
              closeMenuDelay = setTimeout(function(){

                // If mouse isn't over the menu
                if( !subMenu.is(':hover') ){
                  closeOpenSubMenu();
                }
              }, config.leftSidebarCloseSubMenuDelay);
            }else{
              _li.removeClass('open');
            }
          }
        });

        // Stop main menu & sub-menu closing delay on sub-menu mouse over
        subMenus.on({
          mouseenter: function(){
            clearTimeout(closeMenuDelay);
            clearTimeout(closeSubMenuDelay);
          },
          mouseleave: function(){
            var _self = $(this);
            var _li = _self.parent();
            closeSubMenuDelay = setTimeout(function(){           

              if( !_li.is(':hover') ){
                _self.removeClass('visible');
                _li.removeClass('open');
              }      

            }, config.leftSidebarCloseSubMenuDelay);
          }
        });
      }

    /*Open sub-menu on small devices*/
      $(".sidebar-elements li a", leftSidebar).on("click",function( e ){
        if( $.isXs() ){
          var $el = $(this), $open, $speed = config.leftSidebarSlideSpeed;
          var $li = $el.parent();
          var $subMenu = $el.next();

          $open = $li.siblings(".open");

          if( $open ){
            $open.find('> ul:visible').slideUp({ duration: $speed, complete: function(){
              $open.toggleClass('open');
              $(this).removeAttr('style').removeClass('visible');
            }});
          }

          if( $li.hasClass('open') ){
            $subMenu.slideUp({ duration: $speed, complete: function(){
              $li.toggleClass('open');
              $(this).removeAttr('style').removeClass('visible');
            }});
          }else{
            $subMenu.slideDown({ duration: $speed, complete: function(){
              $li.toggleClass('open');
              $(this).removeAttr('style').addClass('visible');
            }});
          }

          if( $el.next().is('ul') ){
            e.preventDefault();
          }

          if (typeof ps_am_scroller !== "undefined") {
            destroyScroller(ps_am_scroller);
          }
        }
      });

    /*Calculate sidebar tree active & open classes*/
      $("li.active", leftSidebar).parents(".parent").addClass("active");

    /*PerfectScroller when left sidebar is fixed*/
      if( wrapper.hasClass("am-fixed-sidebar") ){
        var lsc = $(".am-left-sidebar > .content");
        lsc.wrap('<div class="am-scroller-fixed-left-sidebar"></div>');

        ps_fixed_left_sidebar_scroll = initScroller($(".am-scroller-fixed-left-sidebar"));
        $(window).resize(function () {
          updateScroller(ps_fixed_left_sidebar_scroll);
        });
      }

    /*On window resize check for small resolution classes to remove them*/
      $(window).resize(function () {
        waitForFinalEvent(function(){
          if( !$.isXs() ){
            if (typeof ps_am_scroller !== "undefined") {
              updateScroller(ps_am_scroller);
            }
          }
        }, 500, "am_check_phone_classes");
      });
  }

  function rightSidebarInit(){

    var rsAnnouncementScrollbar = $(".am-scroller-announcement");
    var rsChatScrollbar = $(".am-scroller-chat");
    var rsFaqScrollbar = $(".am-scroller-faqs");
    var rsTicketScrollbar = $(".am-scroller-ticket");

    function oSidebar(){
      body.addClass( config.openRightSidebarClass  + " " + config.transitionClass );
      openSidebar = true;
    }

    function cSidebar(){
      body.removeClass( config.openRightSidebarClass ).addClass( config.transitionClass );
      sidebarDelay();
    }

    if( rightSidebar.length > 0 ){
      /*Open-Sidebar when click on topbar button*/
      $('.am-toggle-right-sidebar').on("click", function(e){
        if( openSidebar && body.hasClass( config.openRightSidebarClass ) ){
          cSidebar();
        }else if( !openSidebar ){
          oSidebar();
        }
        
        e.stopPropagation();
        e.preventDefault();
      });

      /*Close sidebar on click outside*/
      $( document ).on("mousedown touchstart",function( e ){
        if ( !$( e.target ).closest( rightSidebar ).length && body.hasClass( config.openRightSidebarClass ) ) {
          cSidebar();
        }
      });
    }

    if (typeof ps_announcement_scroll === "undefined" || !ps_announcement_scroll || !ps_announcement_scroll.nodeName) {
      ps_announcement_scroll = initScroller(rsAnnouncementScrollbar);
    }
    if (typeof ps_chat_scroll === "undefined" || !ps_chat_scroll || !ps_chat_scroll.nodeName) {
      ps_chat_scroll = initScroller(rsChatScrollbar);
    }
    if (typeof ps_faqs_scroll === "undefined" || !ps_faqs_scroll || !ps_faqs_scroll.nodeName) {
      ps_faqs_scroll = initScroller(rsFaqScrollbar);
    }
    if (typeof ps_ticket_scroll === "undefined" || !ps_ticket_scroll || !ps_ticket_scroll.nodeName) {
      ps_ticket_scroll = initScroller(rsTicketScrollbar);
    }

    /*Update scrollbar height on window resize*/
    $(window).resize(function () {
      waitForFinalEvent(function(){
        updateScroller(ps_announcement_scroll);
        updateScroller(ps_chat_scroll);
        updateScroller(ps_faqs_scroll);
        updateScroller(ps_ticket_scroll);
      }, 500);
    });

    /*Update scrollbar when click on a tab*/
    $('a[data-toggle="tab"]', rightSidebar).on('shown.bs.tab', function (e) {
      updateScroller(ps_announcement_scroll);
      updateScroller(ps_chat_scroll);
      updateScroller(ps_faqs_scroll);
      updateScroller(ps_ticket_scroll);
    });
  }

  function sidebarDelay(){
    openSidebar = true;
    setTimeout(function(){
      openSidebar = false;
    }, config.openSidebarDelay );
  }

  function sidebarSwipe(){
    /*Open sidedar on swipe*/
    var cancelEvent = false;

    function openLeftSidebar(){
      if( !openSidebar && !wrapper.hasClass( config.removeLeftSidebarClass ) ){
        body.addClass( config.openLeftSidebarClass + " " + config.transitionClass );
        openSidebar = true;
      }
    }

    function openRightSidebar(){
      if( !openSidebar && rightSidebar.length > 0 ){
        body.addClass( config.openRightSidebarClass + " " + config.transitionClass );
        openSidebar = true;
      }
    }

    mainContent.swipe( {
      allowPageScroll: "vertical",
      preventDefaultEvents: false,
      fallbackToMouseEvents: false,
      swipeRight: function(e) {
        if( isRtl ) {
          openRightSidebar();
        } else {
          openLeftSidebar();
        }
      },
      swipeLeft: function(e){
        if( isRtl ) {
          openLeftSidebar();
        } else {
          openRightSidebar();
        }
      },
      swipeStatus: function(e, p){
        switch( p ){
          case 'start':
            if( openSidebar ){
              cancelEvent = true;
            }
          break;
          case 'end':
            if( cancelEvent ){
              cancelEvent = false;
              return false;
            }
          break;
          case 'cancel':
            cancelEvent = false;
          break;
        }
      },
      threshold: config.swipeTreshold
    });
  }

  function chatWidget(){
    var chat = $(".am-right-sidebar .tab-pane.chat");
    var contactsEl = $(".chat-contacts", chat);
    var conversationEl = $(".chat-window", chat);
    var messagesContainer = $(".chat-messages", conversationEl);
    var messagesList = $(".content > ul", messagesContainer);
    var messagesScroll = $(".am-scroller-messages", messagesContainer);
    var chatInputContainer = $(".chat-input", conversationEl);
    var chatInput = $("input", chatInputContainer);
    var chatInputSendButton = $(".send-msg", chatInputContainer);

    function openChatWindow(){
      if( !chat.hasClass("chat-opened") ){
        chat.addClass("chat-opened");
        if (typeof ps_messages_scroll === "undefined" || !ps_messages_scroll || !ps_messages_scroll.nodeName) {
          ps_messages_scroll = initScroller(messagesScroll);
        }
      }
    }

    function closeChatWindow(){
      if( chat.hasClass("chat-opened") ){
        chat.removeClass("chat-opened");
      }
    }

    /*Open Conversation Window when click on chat user*/
    $(".user a", contactsEl).on('click',function( e ){
      openChatWindow();
      e.preventDefault();
    });

    /*Close chat conv window*/
    $(".title .return", conversationEl).on('click',function( e ){
      closeChatWindow();
    });

    /*Send message*/
    function sendMsg(msg, self){
      var $message = $('<li class="' + ((self)?'self':'friend') + '"></li>');

      if( msg != '' ){
        $('<div class="msg">' + msg + '</div>').appendTo($message);
        $message.appendTo(messagesList);

        messagesScroll.stop().animate({
          'scrollTop': messagesScroll.prop("scrollHeight")
        }, 900, 'swing');

        updateScroller(ps_messages_scroll);
      }
    }

    /*Send msg when click on 'send' button or press 'Enter'*/
      chatInput.keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var msg = $(this).val();

        if(keycode == '13'){
          sendMsg(msg, true);
          $(this).val("");
        }
        event.stopPropagation();
      });

      chatInputSendButton.on('click',function(){
        var msg = chatInput.val();
        sendMsg(msg, true);
        chatInput.val("");
      });
  }

  function dropdownsScrollerInit(){
    ps_top_messages_scroll = initScroller($(".am-scroller-top-messages"));
    ps_notifications_scroll = initScroller($(".am-scroller-notifications"));
  }

  function scrollTopButton(){
    var offset = 220;
    var duration = 500;
    var button = $('<div class="am-scroll-top"></div>');
    button.appendTo("body");
    
    $(window).on('scroll',function() {
      if ( $(this).scrollTop() > offset ) {
        button.fadeIn(duration);
      } else {
        button.fadeOut(duration);
      }
    });
  
    button.on('touchstart mouseup',function( e ) {
      $( 'html, body' ).animate({ scrollTop: 0 }, duration);
      e.preventDefault();
    });
  }

  function initAsidePS() {      
    var pas = asideDiv;
    if( !$.isSm() ) {
      ps_aside_scroll = initScroller(asideDiv);
    }
    $(window).resize(function () {
      if( $.isSm() ) {
        if (typeof ps_aside_scroll !== "undefined") {
          destroyScroller(ps_aside_scroll);
        }
      } else {
        if( pas.hasClass('ps') ) {
          updateScroller(ps_aside_scroll);
        } else {
          if (typeof ps_aside_scroll === "undefined" || !ps_aside_scroll || !ps_aside_scroll.nodeName) {
            ps_aside_scroll = initScroller(asideDiv);
          }
        }
      }
    });
  }

  function initPageChat() {
    ps_page_chat_scroll = initScroller($(".am-scroller-page-chat"));
    ps_page_messages_scroll = initScroller($(".am-scroller-page-messages"));

    $(window).resize(function () {
      waitForFinalEvent(function(){
        updateScroller(ps_page_chat_scroll);
        updateScroller(ps_page_messages_scroll);
      }, 500);
    });
  }

  //Get the template css colors into js vars
  function getColor( c ){
    var tmp = $("<div>", { class: c }).appendTo("body");
    var color = tmp.css("background-color");
    tmp.remove();

    return color;
  }

  //Wait for final event on window resize
  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = "x1x2x3x4";
      }
      if (timers[uniqueId]) {
        clearTimeout (timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();

  return {
    //General data
    conf: config,
    color: colors,
    scroller: scrollers,

    //Init function
    init: function (options) {
      
      // Get the main elements when document is ready
      wrapper = $(".am-wrapper");
      mainContent = $(".main-content", wrapper);
      leftSidebar = $(".am-left-sidebar", wrapper);
      rightSidebar = $(".am-right-sidebar", wrapper);
      body = $("body");

      //Extends basic config with options
        $.extend( config, options );

      /*Left Sidebar*/
        if ( leftSidebar.length ){
          leftSidebarInit();
        }

      /*FastClick on mobile*/
        FastClick.attach(document.body);
      
      /*Right Sidebar*/
        if ( rightSidebar.length ){
          rightSidebarInit();
        }
        chatWidget();

      /*Sidebars Swipe*/
        if( config.enableSwipe ){
          sidebarSwipe();
        }

      /*Body transition effect*/
        leftSidebar.on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
          body.removeClass( config.transitionClass );
        });

      /*Scroll Top button*/
        if( config.scrollTop ){
          scrollTopButton();
        }

      /*Get colors*/
        colors.primary = getColor('clr-primary');
        colors.success = getColor('clr-success');
        colors.info    = getColor('clr-info');
        colors.warning = getColor('clr-warning');
        colors.danger  = getColor('clr-danger');
        colors.alt1    = getColor('clr-alt1');
        colors.alt2    = getColor('clr-alt2');
        colors.alt3    = getColor('clr-alt3');
        colors.alt4    = getColor('clr-alt4');

      /*Prevent Connections Dropdown closes on click*/
        $(".am-connections").on("click",function( e ){
          e.stopPropagation();
        });

      /*Dropdowns scroller init function*/
        dropdownsScrollerInit();

      /*ui-chat*/
      if ( chatSection.length ) {
        initPageChat();
      }

      /*Page Aside*/
      if( asideDiv.length ) {
        initAsidePS();
      }

      /*Get scrollers*/
        scrollers.am_scroller = ps_am_scroller;
        scrollers.fixed_left_sidebar_scroll = ps_fixed_left_sidebar_scroll;
        scrollers.notifications_scroll = ps_notifications_scroll;
        scrollers.top_messages_scroll = ps_top_messages_scroll;
        scrollers.announcement_scroll = ps_announcement_scroll;
        scrollers.chat_scroll = ps_chat_scroll;
        scrollers.page_chat_scroll = ps_page_chat_scroll;
        scrollers.faqs_scroll = ps_faqs_scroll;
        scrollers.ticket_scroll = ps_ticket_scroll;
        scrollers.messages_scroll = ps_messages_scroll;
        scrollers.page_messages_scroll = ps_page_messages_scroll;
        scrollers.aside_scroll = ps_aside_scroll;
        scrollers.updateScroller = updateScroller;
        scrollers.destroyScroller = destroyScroller;
        scrollers.initScroller = initScroller;

      /*Bind plugins on hidden elements*/
      /*Dropdown shown event*/
        $('.dropdown').on('shown.bs.dropdown', function () {
          updateScroller(ps_top_messages_scroll);
          updateScroller(ps_notifications_scroll);
        });
        
      /*Tabs refresh hidden elements*/
        $('.nav-tabs').on('shown.bs.tab', function (e) {
          //updateScroller(ps_am_scroller);
        });

      /*Tooltips*/
        $('[data-toggle="tooltip"]').tooltip();
      
      /*Popover*/
        $('[data-toggle="popover"]').popover();

      /*Bootstrap modal scroll top fix*/
        $('.modal').on('show.bs.modal', function(){
          $("html").addClass('am-modal-open');
        });

        $('.modal').on('hidden.bs.modal', function(){
          $("html").removeClass('am-modal-open');
        });

      /*Cards*/
      $('.am-close').on('click', function(){
        var parent = '';

        if ( $(this).parents('.card').length ){
          parent = $(this).parents('.card');
        } else if ( $(this).parents('.widget').length ){
          parent = $(this).parents('.widget');
        }

        parent.fadeOut('slow', function(){
          parent.remove();
        })
      });
    },

    //Methods
    leftSidebarInit: leftSidebarInit,
    rightSidebarInit: rightSidebarInit,
    closeSubMenu: function(){
      var subMenu = $(".sidebar-elements > li > ul:visible", leftSidebar);
      subMenu.addClass('hide');
      setTimeout(function(){
        subMenu.removeClass('hide');
      }, 50);
    }
  };
 
})();
function FastClick(e,t){"use strict";var n;if(t=t||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=t.touchBoundary||10,this.layer=e,this.tapDelay=t.tapDelay||200,!FastClick.notNeeded(e)){for(var i=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],o=this,r=0,s=i.length;r<s;r++)o[i[r]]=c(o[i[r]],o);deviceIsAndroid&&(e.addEventListener("mouseover",this.onMouse,!0),e.addEventListener("mousedown",this.onMouse,!0),e.addEventListener("mouseup",this.onMouse,!0)),e.addEventListener("click",this.onClick,!0),e.addEventListener("touchstart",this.onTouchStart,!1),e.addEventListener("touchmove",this.onTouchMove,!1),e.addEventListener("touchend",this.onTouchEnd,!1),e.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(e.removeEventListener=function(t,n,i){var o=Node.prototype.removeEventListener;"click"===t?o.call(e,t,n.hijacked||n,i):o.call(e,t,n,i)},e.addEventListener=function(t,n,i){var o=Node.prototype.addEventListener;"click"===t?o.call(e,t,n.hijacked||(n.hijacked=function(e){e.propagationStopped||n(e)}),i):o.call(e,t,n,i)}),"function"==typeof e.onclick&&(n=e.onclick,e.addEventListener("click",function(e){n(e)},!1),e.onclick=null)}function c(e,t){return function(){return e.apply(t,arguments)}}}var deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),deviceIsBlackBerry10=navigator.userAgent.indexOf("BB10")>0;FastClick.prototype.needsClick=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled)return!0;break;case"input":if(deviceIsIOS&&"file"===e.type||e.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(e.className)},FastClick.prototype.needsFocus=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!deviceIsAndroid;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}},FastClick.prototype.sendClick=function(e,t){"use strict";var n,i,o,r;document.activeElement&&document.activeElement!==e&&document.activeElement.blur(),r=t.changedTouches[0],(o=document.createEvent("MouseEvents")).initMouseEvent("mousedown",!0,!0,window,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),o.forwardedTouchEvent=!0,e.dispatchEvent(o),(i=document.createEvent("MouseEvents")).initMouseEvent("mouseup",!0,!0,window,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),i.forwardedTouchEvent=!0,e.dispatchEvent(i),(n=document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(e),!0,!0,window,1,r.screenX,r.screenY,r.clientX,r.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,e.dispatchEvent(n)},FastClick.prototype.determineEventType=function(e){"use strict";return deviceIsAndroid&&"select"===e.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(e){"use strict";var t;deviceIsIOS&&e.setSelectionRange&&0!==e.type.indexOf("date")&&"time"!==e.type?(t=e.value.length,e.setSelectionRange(t,t)):e.focus()},FastClick.prototype.updateScrollParent=function(e){"use strict";var t,n;if(!(t=e.fastClickScrollParent)||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n,e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}t&&(t.fastClickLastScrollTop=t.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(e){"use strict";return e.nodeType===Node.TEXT_NODE?e.parentNode:e},FastClick.prototype.onTouchStart=function(e){"use strict";var t,n,i;if(e.targetTouches.length>1)return!0;if(t=this.getTargetElementFromEventTarget(e.target),n=e.targetTouches[0],deviceIsIOS){if((i=window.getSelection()).rangeCount&&!i.isCollapsed)return!0;if(!deviceIsIOS4){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return e.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(t)}}return this.trackingClick=!0,this.trackingClickStart=e.timeStamp,this.targetElement=t,this.touchStartX=n.pageX,this.touchStartY=n.pageY,e.timeStamp-this.lastClickTime<this.tapDelay&&e.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(e){"use strict";var t=e.changedTouches[0],n=this.touchBoundary;return Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n},FastClick.prototype.onTouchMove=function(e){"use strict";return!this.trackingClick||((this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e))&&(this.trackingClick=!1,this.targetElement=null),!0)},FastClick.prototype.findControl=function(e){"use strict";return void 0!==e.control?e.control:e.htmlFor?document.getElementById(e.htmlFor):e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(e){"use strict";var t,n,i,o,r,s=this.targetElement;if(!this.trackingClick)return!0;if(e.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=e.timeStamp,n=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,deviceIsIOSWithBadTarget&&(r=e.changedTouches[0],(s=document.elementFromPoint(r.pageX-window.pageXOffset,r.pageY-window.pageYOffset)||s).fastClickScrollParent=this.targetElement.fastClickScrollParent),"label"===(i=s.tagName.toLowerCase())){if(t=this.findControl(s)){if(this.focus(s),deviceIsAndroid)return!1;s=t}}else if(this.needsFocus(s))return e.timeStamp-n>100||deviceIsIOS&&window.top!==window&&"input"===i?(this.targetElement=null,!1):(this.focus(s),this.sendClick(s,e),deviceIsIOS&&"select"===i||(this.targetElement=null,e.preventDefault()),!1);return!(!deviceIsIOS||deviceIsIOS4||!(o=s.fastClickScrollParent)||o.fastClickLastScrollTop===o.scrollTop)||(this.needsClick(s)||(e.preventDefault(),this.sendClick(s,e)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(e){"use strict";return!this.targetElement||(!!e.forwardedTouchEvent||(!e.cancelable||(!(!this.needsClick(this.targetElement)||this.cancelNextClick)||(e.stopImmediatePropagation?e.stopImmediatePropagation():e.propagationStopped=!0,e.stopPropagation(),e.preventDefault(),!1))))},FastClick.prototype.onClick=function(e){"use strict";var t;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===e.target.type&&0===e.detail||((t=this.onMouse(e))||(this.targetElement=null),t)},FastClick.prototype.destroy=function(){"use strict";var e=this.layer;deviceIsAndroid&&(e.removeEventListener("mouseover",this.onMouse,!0),e.removeEventListener("mousedown",this.onMouse,!0),e.removeEventListener("mouseup",this.onMouse,!0)),e.removeEventListener("click",this.onClick,!0),e.removeEventListener("touchstart",this.onTouchStart,!1),e.removeEventListener("touchmove",this.onTouchMove,!1),e.removeEventListener("touchend",this.onTouchEnd,!1),e.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(e){"use strict";var t,n,i;if(void 0===window.ontouchstart)return!0;if(n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!deviceIsAndroid)return!0;if(t=document.querySelector("meta[name=viewport]")){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(n>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(deviceIsBlackBerry10&&(i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1]>=10&&i[2]>=3&&(t=document.querySelector("meta[name=viewport]"))){if(-1!==t.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===e.style.msTouchAction},FastClick.attach=function(e,t){"use strict";return new FastClick(e,t)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;
/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
!function(factory){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],factory):factory("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(options){return!options||void 0!==options.allowPageScroll||void 0===options.swipe&&void 0===options.swipeStatus||(options.allowPageScroll=NONE),void 0!==options.click&&void 0===options.tap&&(options.tap=options.click),options||(options={}),options=$.extend({},$.fn.swipe.defaults,options),this.each(function(){var $this=$(this),plugin=$this.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,options),$this.data(PLUGIN_NS,plugin))})}function TouchSwipe(element,options){function touchStart(jqEvent){if(!(getTouchInProgress()||$(jqEvent.target).closest(options.excludedElements,$element).length>0)){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(!event.pointerType||"mouse"!=event.pointerType||0!=options.fallbackToMouseEvents){var ret,touches=event.touches,evt=touches?touches[0]:event;return phase=PHASE_START,touches?fingerCount=touches.length:options.preventDefaultEvents!==!1&&jqEvent.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===options.fingers||options.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(options.swipeStatus||options.pinchStatus)&&(ret=triggerHandler(event,phase))):ret=!1,ret===!1?(phase=PHASE_CANCEL,triggerHandler(event,phase),ret):(options.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[event.target]),options.hold&&(ret=options.hold.call($element,event,event.target))},this),options.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var ret,touches=event.touches,evt=touches?touches[0]:event,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),options.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===options.fingers||options.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(jqEvent,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),ret=triggerHandler(event,phase),!options.triggerOnTouchEnd||options.triggerOnTouchLeave){var inBounds=!0;if(options.triggerOnTouchLeave){var bounds=getbounds(this);inBounds=isInBounds(currentFinger.end,bounds)}!options.triggerOnTouchEnd&&inBounds?phase=getNextPhase(PHASE_MOVE):options.triggerOnTouchLeave&&!inBounds&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(event,phase)}}else phase=PHASE_CANCEL,triggerHandler(event,phase);ret===!1&&(phase=PHASE_CANCEL,triggerHandler(event,phase))}}function touchEnd(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent,touches=event.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(event),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(event,phase)):options.triggerOnTouchEnd||options.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(options.preventDefaultEvents!==!1&&jqEvent.cancelable!==!1&&jqEvent.preventDefault(),phase=PHASE_END,triggerHandler(event,phase)):!options.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(event,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(event,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(jqEvent){var event=jqEvent.originalEvent?jqEvent.originalEvent:jqEvent;options.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(event,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(currentPhase){var nextPhase=currentPhase,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?nextPhase=PHASE_CANCEL:!validDistance||currentPhase!=PHASE_MOVE||options.triggerOnTouchEnd&&!options.triggerOnTouchLeave?!validDistance&&currentPhase==PHASE_END&&options.triggerOnTouchLeave&&(nextPhase=PHASE_CANCEL):nextPhase=PHASE_END,nextPhase}function triggerHandler(event,phase){var ret,touches=event.touches;return(didSwipe()||hasSwipes())&&(ret=triggerHandlerForGesture(event,phase,SWIPE)),(didPinch()||hasPinches())&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,PINCH)),didDoubleTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,DOUBLE_TAP):didLongTap()&&ret!==!1?ret=triggerHandlerForGesture(event,phase,LONG_TAP):didTap()&&ret!==!1&&(ret=triggerHandlerForGesture(event,phase,TAP)),phase===PHASE_CANCEL&&touchCancel(event),phase===PHASE_END&&(touches?touches.length||touchCancel(event):touchCancel(event)),ret}function triggerHandlerForGesture(event,phase,gesture){var ret;if(gesture==SWIPE){if($element.trigger("swipeStatus",[phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),options.swipeStatus&&(ret=options.swipeStatus.call($element,event,phase,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),ret===!1))return!1;if(phase==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipe&&(ret=options.swipe.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection),ret===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeLeft&&(ret=options.swipeLeft.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeRight&&(ret=options.swipeRight.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeUp&&(ret=options.swipeUp.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),options.swipeDown&&(ret=options.swipeDown.call($element,event,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(gesture==PINCH){if($element.trigger("pinchStatus",[phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchStatus&&(ret=options.pinchStatus.call($element,event,phase,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),ret===!1))return!1;if(phase==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchIn&&(ret=options.pinchIn.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),options.pinchOut&&(ret=options.pinchOut.call($element,event,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return gesture==TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target))},this),options.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[event.target]),options.tap&&(ret=options.tap.call($element,event,event.target)))):gesture==DOUBLE_TAP?phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[event.target]),options.doubleTap&&(ret=options.doubleTap.call($element,event,event.target))):gesture==LONG_TAP&&(phase!==PHASE_CANCEL&&phase!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[event.target]),options.longTap&&(ret=options.longTap.call($element,event,event.target)))),ret}function validateSwipeDistance(){var valid=!0;return null!==options.threshold&&(valid=distance>=options.threshold),valid}function didSwipeBackToCancel(){var cancelled=!1;return null!==options.cancelThreshold&&null!==direction&&(cancelled=getMaxDistance(direction)-distance>=options.cancelThreshold),cancelled}function validatePinchDistance(){return null===options.pinchThreshold||pinchDistance>=options.pinchThreshold}function validateSwipeTime(){var result;return result=!options.maxTimeThreshold||!(duration>=options.maxTimeThreshold)}function validateDefaultEvent(jqEvent,direction){if(options.preventDefaultEvents!==!1)if(options.allowPageScroll===NONE)jqEvent.preventDefault();else{var auto=options.allowPageScroll===AUTO;switch(direction){case LEFT:(options.swipeLeft&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case RIGHT:(options.swipeRight&&auto||!auto&&options.allowPageScroll!=HORIZONTAL)&&jqEvent.preventDefault();break;case UP:(options.swipeUp&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case DOWN:(options.swipeDown&&auto||!auto&&options.allowPageScroll!=VERTICAL)&&jqEvent.preventDefault();break;case NONE:}}}function validatePinch(){var hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return hasCorrectFingerCount&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(options.pinchStatus||options.pinchIn||options.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var hasValidTime=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&hasValidTime;return valid}function hasSwipes(){return!!(options.swipe||options.swipeStatus||options.swipeLeft||options.swipeRight||options.swipeUp||options.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===options.fingers||options.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!options.tap}function hasDoubleTap(){return!!options.doubleTap}function hasLongTap(){return!!options.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var now=getTimeStamp();return hasDoubleTap()&&now-doubleTapStartTime<=options.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<options.threshold)}function validateLongTap(){return duration>options.longTapThreshold&&distance<DOUBLE_TAP_THRESHOLD}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(event){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=event.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var withinThreshold=!1;if(previousTouchEndTime){var diff=getTimeStamp()-previousTouchEndTime;diff<=options.fingerReleaseThreshold&&(withinThreshold=!0)}return withinThreshold}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(val){$element&&(val===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",val===!0))}function createFingerData(id,evt){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=evt.pageX||evt.clientX,f.start.y=f.last.y=f.end.y=evt.pageY||evt.clientY,fingerData[id]=f,f}function updateFingerData(evt){var id=void 0!==evt.identifier?evt.identifier:0,f=getFingerData(id);return null===f&&(f=createFingerData(id,evt)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=evt.pageX||evt.clientX,f.end.y=evt.pageY||evt.clientY,f}function getFingerData(id){return fingerData[id]||null}function setMaxDistance(direction,distance){direction!=NONE&&(distance=Math.max(distance,getMaxDistance(direction)),maximumsMap[direction].distance=distance)}function getMaxDistance(direction){if(maximumsMap[direction])return maximumsMap[direction].distance}function createMaximumsData(){var maxData={};return maxData[LEFT]=createMaximumVO(LEFT),maxData[RIGHT]=createMaximumVO(RIGHT),maxData[UP]=createMaximumVO(UP),maxData[DOWN]=createMaximumVO(DOWN),maxData}function createMaximumVO(dir){return{direction:dir,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(startPoint,endPoint){var diffX=Math.abs(startPoint.x-endPoint.x),diffY=Math.abs(startPoint.y-endPoint.y);return Math.round(Math.sqrt(diffX*diffX+diffY*diffY))}function calculatePinchZoom(startDistance,endDistance){var percent=endDistance/startDistance*1;return percent.toFixed(2)}function calculatePinchDirection(){return pinchZoom<1?OUT:IN}function calculateDistance(startPoint,endPoint){return Math.round(Math.sqrt(Math.pow(endPoint.x-startPoint.x,2)+Math.pow(endPoint.y-startPoint.y,2)))}function calculateAngle(startPoint,endPoint){var x=startPoint.x-endPoint.x,y=endPoint.y-startPoint.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return angle<0&&(angle=360-Math.abs(angle)),angle}function calculateDirection(startPoint,endPoint){if(comparePoints(startPoint,endPoint))return NONE;var angle=calculateAngle(startPoint,endPoint);return angle<=45&&angle>=0?LEFT:angle<=360&&angle>=315?LEFT:angle>=135&&angle<=225?RIGHT:angle>45&&angle<135?DOWN:UP}function getTimeStamp(){var now=new Date;return now.getTime()}function getbounds(el){el=$(el);var offset=el.offset(),bounds={left:offset.left,right:offset.left+el.outerWidth(),top:offset.top,bottom:offset.top+el.outerHeight()};return bounds}function isInBounds(point,bounds){return point.x>bounds.left&&point.x<bounds.right&&point.y>bounds.top&&point.y<bounds.bottom}function comparePoints(pointA,pointB){return pointA.x==pointB.x&&pointA.y==pointB.y}var options=$.extend({},options),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!options.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(element),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(property,value){if("object"==typeof property)options=$.extend(options,property);else if(void 0!==options[property]){if(void 0===value)return options[property];options[property]=value}else{if(!property)return options;$.error("Option "+property+" does not exist on jQuery.swipe.options")}return null}}var VERSION="1.6.18",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(method){var $this=$(this),plugin=$this.data(PLUGIN_NS);if(plugin&&"string"==typeof method){if(plugin[method])return plugin[method].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+method+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof method)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof method&&method))return init.apply(this,arguments);return $this},$.fn.swipe.version=VERSION,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});
/*!
 * perfect-scrollbar v1.4.0
 * (c) 2018 Hyunje Jun
 * @license MIT
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):t.PerfectScrollbar=e()}(this,function(){"use strict";function t(t){return getComputedStyle(t)}function e(t,e){for(var i in e){var r=e[i];"number"==typeof r&&(r+="px"),t.style[i]=r}return t}function i(t){var e=document.createElement("div");return e.className=t,e}function r(t,e){if(!v)throw new Error("No element matching method supported");return v.call(t,e)}function l(t){t.remove?t.remove():t.parentNode&&t.parentNode.removeChild(t)}function n(t,e){return Array.prototype.filter.call(t.children,function(t){return r(t,e)})}function o(t,e){var i=t.element.classList,r=m.state.scrolling(e);i.contains(r)?clearTimeout(Y[e]):i.add(r)}function s(t,e){Y[e]=setTimeout(function(){return t.isAlive&&t.element.classList.remove(m.state.scrolling(e))},t.settings.scrollingThreshold)}function a(t,e){o(t,e),s(t,e)}function c(t){if("function"==typeof window.CustomEvent)return new CustomEvent(t);var e=document.createEvent("CustomEvent");return e.initCustomEvent(t,!1,!1,void 0),e}function h(t,e,i,r,l){var n=i[0],o=i[1],s=i[2],h=i[3],u=i[4],d=i[5];void 0===r&&(r=!0),void 0===l&&(l=!1);var f=t.element;t.reach[h]=null,f[s]<1&&(t.reach[h]="start"),f[s]>t[n]-t[o]-1&&(t.reach[h]="end"),e&&(f.dispatchEvent(c("ps-scroll-"+h)),e<0?f.dispatchEvent(c("ps-scroll-"+u)):e>0&&f.dispatchEvent(c("ps-scroll-"+d)),r&&a(t,h)),t.reach[h]&&(e||l)&&f.dispatchEvent(c("ps-"+h+"-reach-"+t.reach[h]))}function u(t){return parseInt(t,10)||0}function d(t){return r(t,"input,[contenteditable]")||r(t,"select,[contenteditable]")||r(t,"textarea,[contenteditable]")||r(t,"button,[contenteditable]")}function f(e){var i=t(e);return u(i.width)+u(i.paddingLeft)+u(i.paddingRight)+u(i.borderLeftWidth)+u(i.borderRightWidth)}function p(t,e){return t.settings.minScrollbarLength&&(e=Math.max(e,t.settings.minScrollbarLength)),t.settings.maxScrollbarLength&&(e=Math.min(e,t.settings.maxScrollbarLength)),e}function b(t,i){var r={width:i.railXWidth},l=Math.floor(t.scrollTop);i.isRtl?r.left=i.negativeScrollAdjustment+t.scrollLeft+i.containerWidth-i.contentWidth:r.left=t.scrollLeft,i.isScrollbarXUsingBottom?r.bottom=i.scrollbarXBottom-l:r.top=i.scrollbarXTop+l,e(i.scrollbarXRail,r);var n={top:l,height:i.railYHeight};i.isScrollbarYUsingRight?i.isRtl?n.right=i.contentWidth-(i.negativeScrollAdjustment+t.scrollLeft)-i.scrollbarYRight-i.scrollbarYOuterWidth:n.right=i.scrollbarYRight-t.scrollLeft:i.isRtl?n.left=i.negativeScrollAdjustment+t.scrollLeft+2*i.containerWidth-i.contentWidth-i.scrollbarYLeft-i.scrollbarYOuterWidth:n.left=i.scrollbarYLeft+t.scrollLeft,e(i.scrollbarYRail,n),e(i.scrollbarX,{left:i.scrollbarXLeft,width:i.scrollbarXWidth-i.railBorderXWidth}),e(i.scrollbarY,{top:i.scrollbarYTop,height:i.scrollbarYHeight-i.railBorderYWidth})}function g(t,e){function i(e){b[d]=g+Y*(e[a]-v),o(t,f),R(t),e.stopPropagation(),e.preventDefault()}function r(){s(t,f),t[p].classList.remove(m.state.clicking),t.event.unbind(t.ownerDocument,"mousemove",i)}var l=e[0],n=e[1],a=e[2],c=e[3],h=e[4],u=e[5],d=e[6],f=e[7],p=e[8],b=t.element,g=null,v=null,Y=null;t.event.bind(t[h],"mousedown",function(e){g=b[d],v=e[a],Y=(t[n]-t[l])/(t[c]-t[u]),t.event.bind(t.ownerDocument,"mousemove",i),t.event.once(t.ownerDocument,"mouseup",r),t[p].classList.add(m.state.clicking),e.stopPropagation(),e.preventDefault()})}var v="undefined"!=typeof Element&&(Element.prototype.matches||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector),m={main:"ps",element:{thumb:function(t){return"ps__thumb-"+t},rail:function(t){return"ps__rail-"+t},consuming:"ps__child--consume"},state:{focus:"ps--focus",clicking:"ps--clicking",active:function(t){return"ps--active-"+t},scrolling:function(t){return"ps--scrolling-"+t}}},Y={x:null,y:null},X=function(t){this.element=t,this.handlers={}},w={isEmpty:{configurable:!0}};X.prototype.bind=function(t,e){void 0===this.handlers[t]&&(this.handlers[t]=[]),this.handlers[t].push(e),this.element.addEventListener(t,e,!1)},X.prototype.unbind=function(t,e){var i=this;this.handlers[t]=this.handlers[t].filter(function(r){return!(!e||r===e)||(i.element.removeEventListener(t,r,!1),!1)})},X.prototype.unbindAll=function(){var t=this;for(var e in t.handlers)t.unbind(e)},w.isEmpty.get=function(){var t=this;return Object.keys(this.handlers).every(function(e){return 0===t.handlers[e].length})},Object.defineProperties(X.prototype,w);var y=function(){this.eventElements=[]};y.prototype.eventElement=function(t){var e=this.eventElements.filter(function(e){return e.element===t})[0];return e||(e=new X(t),this.eventElements.push(e)),e},y.prototype.bind=function(t,e,i){this.eventElement(t).bind(e,i)},y.prototype.unbind=function(t,e,i){var r=this.eventElement(t);r.unbind(e,i),r.isEmpty&&this.eventElements.splice(this.eventElements.indexOf(r),1)},y.prototype.unbindAll=function(){this.eventElements.forEach(function(t){return t.unbindAll()}),this.eventElements=[]},y.prototype.once=function(t,e,i){var r=this.eventElement(t),l=function(t){r.unbind(e,l),i(t)};r.bind(e,l)};var W=function(t,e,i,r,l){void 0===r&&(r=!0),void 0===l&&(l=!1);var n;if("top"===e)n=["contentHeight","containerHeight","scrollTop","y","up","down"];else{if("left"!==e)throw new Error("A proper axis should be provided");n=["contentWidth","containerWidth","scrollLeft","x","left","right"]}h(t,i,n,r,l)},L={isWebKit:"undefined"!=typeof document&&"WebkitAppearance"in document.documentElement.style,supportsTouch:"undefined"!=typeof window&&("ontouchstart"in window||window.DocumentTouch&&document instanceof window.DocumentTouch),supportsIePointer:"undefined"!=typeof navigator&&navigator.msMaxTouchPoints,isChrome:"undefined"!=typeof navigator&&/Chrome/i.test(navigator&&navigator.userAgent)},R=function(t){var e=t.element,i=Math.floor(e.scrollTop);t.containerWidth=e.clientWidth,t.containerHeight=e.clientHeight,t.contentWidth=e.scrollWidth,t.contentHeight=e.scrollHeight,e.contains(t.scrollbarXRail)||(n(e,m.element.rail("x")).forEach(function(t){return l(t)}),e.appendChild(t.scrollbarXRail)),e.contains(t.scrollbarYRail)||(n(e,m.element.rail("y")).forEach(function(t){return l(t)}),e.appendChild(t.scrollbarYRail)),!t.settings.suppressScrollX&&t.containerWidth+t.settings.scrollXMarginOffset<t.contentWidth?(t.scrollbarXActive=!0,t.railXWidth=t.containerWidth-t.railXMarginWidth,t.railXRatio=t.containerWidth/t.railXWidth,t.scrollbarXWidth=p(t,u(t.railXWidth*t.containerWidth/t.contentWidth)),t.scrollbarXLeft=u((t.negativeScrollAdjustment+e.scrollLeft)*(t.railXWidth-t.scrollbarXWidth)/(t.contentWidth-t.containerWidth))):t.scrollbarXActive=!1,!t.settings.suppressScrollY&&t.containerHeight+t.settings.scrollYMarginOffset<t.contentHeight?(t.scrollbarYActive=!0,t.railYHeight=t.containerHeight-t.railYMarginHeight,t.railYRatio=t.containerHeight/t.railYHeight,t.scrollbarYHeight=p(t,u(t.railYHeight*t.containerHeight/t.contentHeight)),t.scrollbarYTop=u(i*(t.railYHeight-t.scrollbarYHeight)/(t.contentHeight-t.containerHeight))):t.scrollbarYActive=!1,t.scrollbarXLeft>=t.railXWidth-t.scrollbarXWidth&&(t.scrollbarXLeft=t.railXWidth-t.scrollbarXWidth),t.scrollbarYTop>=t.railYHeight-t.scrollbarYHeight&&(t.scrollbarYTop=t.railYHeight-t.scrollbarYHeight),b(e,t),t.scrollbarXActive?e.classList.add(m.state.active("x")):(e.classList.remove(m.state.active("x")),t.scrollbarXWidth=0,t.scrollbarXLeft=0,e.scrollLeft=0),t.scrollbarYActive?e.classList.add(m.state.active("y")):(e.classList.remove(m.state.active("y")),t.scrollbarYHeight=0,t.scrollbarYTop=0,e.scrollTop=0)},T={"click-rail":function(t){t.event.bind(t.scrollbarY,"mousedown",function(t){return t.stopPropagation()}),t.event.bind(t.scrollbarYRail,"mousedown",function(e){var i=e.pageY-window.pageYOffset-t.scrollbarYRail.getBoundingClientRect().top>t.scrollbarYTop?1:-1;t.element.scrollTop+=i*t.containerHeight,R(t),e.stopPropagation()}),t.event.bind(t.scrollbarX,"mousedown",function(t){return t.stopPropagation()}),t.event.bind(t.scrollbarXRail,"mousedown",function(e){var i=e.pageX-window.pageXOffset-t.scrollbarXRail.getBoundingClientRect().left>t.scrollbarXLeft?1:-1;t.element.scrollLeft+=i*t.containerWidth,R(t),e.stopPropagation()})},"drag-thumb":function(t){g(t,["containerWidth","contentWidth","pageX","railXWidth","scrollbarX","scrollbarXWidth","scrollLeft","x","scrollbarXRail"]),g(t,["containerHeight","contentHeight","pageY","railYHeight","scrollbarY","scrollbarYHeight","scrollTop","y","scrollbarYRail"])},keyboard:function(t){function e(e,r){var l=Math.floor(i.scrollTop);if(0===e){if(!t.scrollbarYActive)return!1;if(0===l&&r>0||l>=t.contentHeight-t.containerHeight&&r<0)return!t.settings.wheelPropagation}var n=i.scrollLeft;if(0===r){if(!t.scrollbarXActive)return!1;if(0===n&&e<0||n>=t.contentWidth-t.containerWidth&&e>0)return!t.settings.wheelPropagation}return!0}var i=t.element,l=function(){return r(i,":hover")},n=function(){return r(t.scrollbarX,":focus")||r(t.scrollbarY,":focus")};t.event.bind(t.ownerDocument,"keydown",function(r){if(!(r.isDefaultPrevented&&r.isDefaultPrevented()||r.defaultPrevented)&&(l()||n())){var o=document.activeElement?document.activeElement:t.ownerDocument.activeElement;if(o){if("IFRAME"===o.tagName)o=o.contentDocument.activeElement;else for(;o.shadowRoot;)o=o.shadowRoot.activeElement;if(d(o))return}var s=0,a=0;switch(r.which){case 37:s=r.metaKey?-t.contentWidth:r.altKey?-t.containerWidth:-30;break;case 38:a=r.metaKey?t.contentHeight:r.altKey?t.containerHeight:30;break;case 39:s=r.metaKey?t.contentWidth:r.altKey?t.containerWidth:30;break;case 40:a=r.metaKey?-t.contentHeight:r.altKey?-t.containerHeight:-30;break;case 32:a=r.shiftKey?t.containerHeight:-t.containerHeight;break;case 33:a=t.containerHeight;break;case 34:a=-t.containerHeight;break;case 36:a=t.contentHeight;break;case 35:a=-t.contentHeight;break;default:return}t.settings.suppressScrollX&&0!==s||t.settings.suppressScrollY&&0!==a||(i.scrollTop-=a,i.scrollLeft+=s,R(t),e(s,a)&&r.preventDefault())}})},wheel:function(e){function i(t,i){var r=Math.floor(o.scrollTop),l=0===o.scrollTop,n=r+o.offsetHeight===o.scrollHeight,s=0===o.scrollLeft,a=o.scrollLeft+o.offsetWidth===o.scrollWidth;return!(Math.abs(i)>Math.abs(t)?l||n:s||a)||!e.settings.wheelPropagation}function r(t){var e=t.deltaX,i=-1*t.deltaY;return void 0!==e&&void 0!==i||(e=-1*t.wheelDeltaX/6,i=t.wheelDeltaY/6),t.deltaMode&&1===t.deltaMode&&(e*=10,i*=10),e!==e&&i!==i&&(e=0,i=t.wheelDelta),t.shiftKey?[-i,-e]:[e,i]}function l(e,i,r){if(!L.isWebKit&&o.querySelector("select:focus"))return!0;if(!o.contains(e))return!1;for(var l=e;l&&l!==o;){if(l.classList.contains(m.element.consuming))return!0;var n=t(l);if([n.overflow,n.overflowX,n.overflowY].join("").match(/(scroll|auto)/)){var s=l.scrollHeight-l.clientHeight;if(s>0&&!(0===l.scrollTop&&r>0||l.scrollTop===s&&r<0))return!0;var a=l.scrollWidth-l.clientWidth;if(a>0&&!(0===l.scrollLeft&&i<0||l.scrollLeft===a&&i>0))return!0}l=l.parentNode}return!1}function n(t){var n=r(t),s=n[0],a=n[1];if(!l(t.target,s,a)){var c=!1;e.settings.useBothWheelAxes?e.scrollbarYActive&&!e.scrollbarXActive?(a?o.scrollTop-=a*e.settings.wheelSpeed:o.scrollTop+=s*e.settings.wheelSpeed,c=!0):e.scrollbarXActive&&!e.scrollbarYActive&&(s?o.scrollLeft+=s*e.settings.wheelSpeed:o.scrollLeft-=a*e.settings.wheelSpeed,c=!0):(o.scrollTop-=a*e.settings.wheelSpeed,o.scrollLeft+=s*e.settings.wheelSpeed),R(e),(c=c||i(s,a))&&!t.ctrlKey&&(t.stopPropagation(),t.preventDefault())}}var o=e.element;void 0!==window.onwheel?e.event.bind(o,"wheel",n):void 0!==window.onmousewheel&&e.event.bind(o,"mousewheel",n)},touch:function(e){function i(t,i){var r=Math.floor(h.scrollTop),l=h.scrollLeft,n=Math.abs(t),o=Math.abs(i);if(o>n){if(i<0&&r===e.contentHeight-e.containerHeight||i>0&&0===r)return 0===window.scrollY&&i>0&&L.isChrome}else if(n>o&&(t<0&&l===e.contentWidth-e.containerWidth||t>0&&0===l))return!0;return!0}function r(t,i){h.scrollTop-=i,h.scrollLeft-=t,R(e)}function l(t){return t.targetTouches?t.targetTouches[0]:t}function n(t){return!(t.pointerType&&"pen"===t.pointerType&&0===t.buttons||(!t.targetTouches||1!==t.targetTouches.length)&&(!t.pointerType||"mouse"===t.pointerType||t.pointerType===t.MSPOINTER_TYPE_MOUSE))}function o(t){if(n(t)){var e=l(t);u.pageX=e.pageX,u.pageY=e.pageY,d=(new Date).getTime(),null!==p&&clearInterval(p)}}function s(e,i,r){if(!h.contains(e))return!1;for(var l=e;l&&l!==h;){if(l.classList.contains(m.element.consuming))return!0;var n=t(l);if([n.overflow,n.overflowX,n.overflowY].join("").match(/(scroll|auto)/)){var o=l.scrollHeight-l.clientHeight;if(o>0&&!(0===l.scrollTop&&r>0||l.scrollTop===o&&r<0))return!0;var s=l.scrollLeft-l.clientWidth;if(s>0&&!(0===l.scrollLeft&&i<0||l.scrollLeft===s&&i>0))return!0}l=l.parentNode}return!1}function a(t){if(n(t)){var e=l(t),o={pageX:e.pageX,pageY:e.pageY},a=o.pageX-u.pageX,c=o.pageY-u.pageY;if(s(t.target,a,c))return;r(a,c),u=o;var h=(new Date).getTime(),p=h-d;p>0&&(f.x=a/p,f.y=c/p,d=h),i(a,c)&&t.preventDefault()}}function c(){e.settings.swipeEasing&&(clearInterval(p),p=setInterval(function(){e.isInitialized?clearInterval(p):f.x||f.y?Math.abs(f.x)<.01&&Math.abs(f.y)<.01?clearInterval(p):(r(30*f.x,30*f.y),f.x*=.8,f.y*=.8):clearInterval(p)},10))}if(L.supportsTouch||L.supportsIePointer){var h=e.element,u={},d=0,f={},p=null;L.supportsTouch?(e.event.bind(h,"touchstart",o),e.event.bind(h,"touchmove",a),e.event.bind(h,"touchend",c)):L.supportsIePointer&&(window.PointerEvent?(e.event.bind(h,"pointerdown",o),e.event.bind(h,"pointermove",a),e.event.bind(h,"pointerup",c)):window.MSPointerEvent&&(e.event.bind(h,"MSPointerDown",o),e.event.bind(h,"MSPointerMove",a),e.event.bind(h,"MSPointerUp",c)))}}},H=function(r,l){var n=this;if(void 0===l&&(l={}),"string"==typeof r&&(r=document.querySelector(r)),!r||!r.nodeName)throw new Error("no element is specified to initialize PerfectScrollbar");this.element=r,r.classList.add(m.main),this.settings={handlers:["click-rail","drag-thumb","keyboard","wheel","touch"],maxScrollbarLength:null,minScrollbarLength:null,scrollingThreshold:1e3,scrollXMarginOffset:0,scrollYMarginOffset:0,suppressScrollX:!1,suppressScrollY:!1,swipeEasing:!0,useBothWheelAxes:!1,wheelPropagation:!0,wheelSpeed:1};for(var o in l)n.settings[o]=l[o];this.containerWidth=null,this.containerHeight=null,this.contentWidth=null,this.contentHeight=null;var s=function(){return r.classList.add(m.state.focus)},a=function(){return r.classList.remove(m.state.focus)};this.isRtl="rtl"===t(r).direction,this.isNegativeScroll=function(){var t=r.scrollLeft,e=null;return r.scrollLeft=-1,e=r.scrollLeft<0,r.scrollLeft=t,e}(),this.negativeScrollAdjustment=this.isNegativeScroll?r.scrollWidth-r.clientWidth:0,this.event=new y,this.ownerDocument=r.ownerDocument||document,this.scrollbarXRail=i(m.element.rail("x")),r.appendChild(this.scrollbarXRail),this.scrollbarX=i(m.element.thumb("x")),this.scrollbarXRail.appendChild(this.scrollbarX),this.scrollbarX.setAttribute("tabindex",0),this.event.bind(this.scrollbarX,"focus",s),this.event.bind(this.scrollbarX,"blur",a),this.scrollbarXActive=null,this.scrollbarXWidth=null,this.scrollbarXLeft=null;var c=t(this.scrollbarXRail);this.scrollbarXBottom=parseInt(c.bottom,10),isNaN(this.scrollbarXBottom)?(this.isScrollbarXUsingBottom=!1,this.scrollbarXTop=u(c.top)):this.isScrollbarXUsingBottom=!0,this.railBorderXWidth=u(c.borderLeftWidth)+u(c.borderRightWidth),e(this.scrollbarXRail,{display:"block"}),this.railXMarginWidth=u(c.marginLeft)+u(c.marginRight),e(this.scrollbarXRail,{display:""}),this.railXWidth=null,this.railXRatio=null,this.scrollbarYRail=i(m.element.rail("y")),r.appendChild(this.scrollbarYRail),this.scrollbarY=i(m.element.thumb("y")),this.scrollbarYRail.appendChild(this.scrollbarY),this.scrollbarY.setAttribute("tabindex",0),this.event.bind(this.scrollbarY,"focus",s),this.event.bind(this.scrollbarY,"blur",a),this.scrollbarYActive=null,this.scrollbarYHeight=null,this.scrollbarYTop=null;var h=t(this.scrollbarYRail);this.scrollbarYRight=parseInt(h.right,10),isNaN(this.scrollbarYRight)?(this.isScrollbarYUsingRight=!1,this.scrollbarYLeft=u(h.left)):this.isScrollbarYUsingRight=!0,this.scrollbarYOuterWidth=this.isRtl?f(this.scrollbarY):null,this.railBorderYWidth=u(h.borderTopWidth)+u(h.borderBottomWidth),e(this.scrollbarYRail,{display:"block"}),this.railYMarginHeight=u(h.marginTop)+u(h.marginBottom),e(this.scrollbarYRail,{display:""}),this.railYHeight=null,this.railYRatio=null,this.reach={x:r.scrollLeft<=0?"start":r.scrollLeft>=this.contentWidth-this.containerWidth?"end":null,y:r.scrollTop<=0?"start":r.scrollTop>=this.contentHeight-this.containerHeight?"end":null},this.isAlive=!0,this.settings.handlers.forEach(function(t){return T[t](n)}),this.lastScrollTop=Math.floor(r.scrollTop),this.lastScrollLeft=r.scrollLeft,this.event.bind(this.element,"scroll",function(t){return n.onScroll(t)}),R(this)};return H.prototype.update=function(){this.isAlive&&(this.negativeScrollAdjustment=this.isNegativeScroll?this.element.scrollWidth-this.element.clientWidth:0,e(this.scrollbarXRail,{display:"block"}),e(this.scrollbarYRail,{display:"block"}),this.railXMarginWidth=u(t(this.scrollbarXRail).marginLeft)+u(t(this.scrollbarXRail).marginRight),this.railYMarginHeight=u(t(this.scrollbarYRail).marginTop)+u(t(this.scrollbarYRail).marginBottom),e(this.scrollbarXRail,{display:"none"}),e(this.scrollbarYRail,{display:"none"}),R(this),W(this,"top",0,!1,!0),W(this,"left",0,!1,!0),e(this.scrollbarXRail,{display:""}),e(this.scrollbarYRail,{display:""}))},H.prototype.onScroll=function(t){this.isAlive&&(R(this),W(this,"top",this.element.scrollTop-this.lastScrollTop),W(this,"left",this.element.scrollLeft-this.lastScrollLeft),this.lastScrollTop=Math.floor(this.element.scrollTop),this.lastScrollLeft=this.element.scrollLeft)},H.prototype.destroy=function(){this.isAlive&&(this.event.unbindAll(),l(this.scrollbarX),l(this.scrollbarY),l(this.scrollbarXRail),l(this.scrollbarYRail),this.removePsClasses(),this.element=null,this.scrollbarX=null,this.scrollbarY=null,this.scrollbarXRail=null,this.scrollbarYRail=null,this.isAlive=!1)},H.prototype.removePsClasses=function(){this.element.className=this.element.className.split(" ").filter(function(t){return!t.match(/^ps([-_].+|)$/)}).join(" ")},H});
// TinyColor v1.4.1
// https://github.com/bgrins/TinyColor
// 2016-07-07, Brian Grinstead, MIT License
!function(a){function b(a,d){if(a=a?a:"",d=d||{},a instanceof b)return a;if(!(this instanceof b))return new b(a,d);var e=c(a);this._originalInput=a,this._r=e.r,this._g=e.g,this._b=e.b,this._a=e.a,this._roundA=P(100*this._a)/100,this._format=d.format||e.format,this._gradientType=d.gradientType,this._r<1&&(this._r=P(this._r)),this._g<1&&(this._g=P(this._g)),this._b<1&&(this._b=P(this._b)),this._ok=e.ok,this._tc_id=O++}function c(a){var b={r:0,g:0,b:0},c=1,e=null,g=null,i=null,j=!1,k=!1;return"string"==typeof a&&(a=K(a)),"object"==typeof a&&(J(a.r)&&J(a.g)&&J(a.b)?(b=d(a.r,a.g,a.b),j=!0,k="%"===String(a.r).substr(-1)?"prgb":"rgb"):J(a.h)&&J(a.s)&&J(a.v)?(e=G(a.s),g=G(a.v),b=h(a.h,e,g),j=!0,k="hsv"):J(a.h)&&J(a.s)&&J(a.l)&&(e=G(a.s),i=G(a.l),b=f(a.h,e,i),j=!0,k="hsl"),a.hasOwnProperty("a")&&(c=a.a)),c=z(c),{ok:j,format:a.format||k,r:Q(255,R(b.r,0)),g:Q(255,R(b.g,0)),b:Q(255,R(b.b,0)),a:c}}function d(a,b,c){return{r:255*A(a,255),g:255*A(b,255),b:255*A(c,255)}}function e(a,b,c){a=A(a,255),b=A(b,255),c=A(c,255);var d,e,f=R(a,b,c),g=Q(a,b,c),h=(f+g)/2;if(f==g)d=e=0;else{var i=f-g;switch(e=h>.5?i/(2-f-g):i/(f+g),f){case a:d=(b-c)/i+(c>b?6:0);break;case b:d=(c-a)/i+2;break;case c:d=(a-b)/i+4}d/=6}return{h:d,s:e,l:h}}function f(a,b,c){function d(a,b,c){return 0>c&&(c+=1),c>1&&(c-=1),1/6>c?a+6*(b-a)*c:.5>c?b:2/3>c?a+6*(b-a)*(2/3-c):a}var e,f,g;if(a=A(a,360),b=A(b,100),c=A(c,100),0===b)e=f=g=c;else{var h=.5>c?c*(1+b):c+b-c*b,i=2*c-h;e=d(i,h,a+1/3),f=d(i,h,a),g=d(i,h,a-1/3)}return{r:255*e,g:255*f,b:255*g}}function g(a,b,c){a=A(a,255),b=A(b,255),c=A(c,255);var d,e,f=R(a,b,c),g=Q(a,b,c),h=f,i=f-g;if(e=0===f?0:i/f,f==g)d=0;else{switch(f){case a:d=(b-c)/i+(c>b?6:0);break;case b:d=(c-a)/i+2;break;case c:d=(a-b)/i+4}d/=6}return{h:d,s:e,v:h}}function h(b,c,d){b=6*A(b,360),c=A(c,100),d=A(d,100);var e=a.floor(b),f=b-e,g=d*(1-c),h=d*(1-f*c),i=d*(1-(1-f)*c),j=e%6,k=[d,h,g,g,i,d][j],l=[i,d,d,h,g,g][j],m=[g,g,i,d,d,h][j];return{r:255*k,g:255*l,b:255*m}}function i(a,b,c,d){var e=[F(P(a).toString(16)),F(P(b).toString(16)),F(P(c).toString(16))];return d&&e[0].charAt(0)==e[0].charAt(1)&&e[1].charAt(0)==e[1].charAt(1)&&e[2].charAt(0)==e[2].charAt(1)?e[0].charAt(0)+e[1].charAt(0)+e[2].charAt(0):e.join("")}function j(a,b,c,d,e){var f=[F(P(a).toString(16)),F(P(b).toString(16)),F(P(c).toString(16)),F(H(d))];return e&&f[0].charAt(0)==f[0].charAt(1)&&f[1].charAt(0)==f[1].charAt(1)&&f[2].charAt(0)==f[2].charAt(1)&&f[3].charAt(0)==f[3].charAt(1)?f[0].charAt(0)+f[1].charAt(0)+f[2].charAt(0)+f[3].charAt(0):f.join("")}function k(a,b,c,d){var e=[F(H(d)),F(P(a).toString(16)),F(P(b).toString(16)),F(P(c).toString(16))];return e.join("")}function l(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.s-=c/100,d.s=B(d.s),b(d)}function m(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.s+=c/100,d.s=B(d.s),b(d)}function n(a){return b(a).desaturate(100)}function o(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.l+=c/100,d.l=B(d.l),b(d)}function p(a,c){c=0===c?0:c||10;var d=b(a).toRgb();return d.r=R(0,Q(255,d.r-P(255*-(c/100)))),d.g=R(0,Q(255,d.g-P(255*-(c/100)))),d.b=R(0,Q(255,d.b-P(255*-(c/100)))),b(d)}function q(a,c){c=0===c?0:c||10;var d=b(a).toHsl();return d.l-=c/100,d.l=B(d.l),b(d)}function r(a,c){var d=b(a).toHsl(),e=(d.h+c)%360;return d.h=0>e?360+e:e,b(d)}function s(a){var c=b(a).toHsl();return c.h=(c.h+180)%360,b(c)}function t(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+120)%360,s:c.s,l:c.l}),b({h:(d+240)%360,s:c.s,l:c.l})]}function u(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+90)%360,s:c.s,l:c.l}),b({h:(d+180)%360,s:c.s,l:c.l}),b({h:(d+270)%360,s:c.s,l:c.l})]}function v(a){var c=b(a).toHsl(),d=c.h;return[b(a),b({h:(d+72)%360,s:c.s,l:c.l}),b({h:(d+216)%360,s:c.s,l:c.l})]}function w(a,c,d){c=c||6,d=d||30;var e=b(a).toHsl(),f=360/d,g=[b(a)];for(e.h=(e.h-(f*c>>1)+720)%360;--c;)e.h=(e.h+f)%360,g.push(b(e));return g}function x(a,c){c=c||6;for(var d=b(a).toHsv(),e=d.h,f=d.s,g=d.v,h=[],i=1/c;c--;)h.push(b({h:e,s:f,v:g})),g=(g+i)%1;return h}function y(a){var b={};for(var c in a)a.hasOwnProperty(c)&&(b[a[c]]=c);return b}function z(a){return a=parseFloat(a),(isNaN(a)||0>a||a>1)&&(a=1),a}function A(b,c){D(b)&&(b="100%");var d=E(b);return b=Q(c,R(0,parseFloat(b))),d&&(b=parseInt(b*c,10)/100),a.abs(b-c)<1e-6?1:b%c/parseFloat(c)}function B(a){return Q(1,R(0,a))}function C(a){return parseInt(a,16)}function D(a){return"string"==typeof a&&-1!=a.indexOf(".")&&1===parseFloat(a)}function E(a){return"string"==typeof a&&-1!=a.indexOf("%")}function F(a){return 1==a.length?"0"+a:""+a}function G(a){return 1>=a&&(a=100*a+"%"),a}function H(b){return a.round(255*parseFloat(b)).toString(16)}function I(a){return C(a)/255}function J(a){return!!V.CSS_UNIT.exec(a)}function K(a){a=a.replace(M,"").replace(N,"").toLowerCase();var b=!1;if(T[a])a=T[a],b=!0;else if("transparent"==a)return{r:0,g:0,b:0,a:0,format:"name"};var c;return(c=V.rgb.exec(a))?{r:c[1],g:c[2],b:c[3]}:(c=V.rgba.exec(a))?{r:c[1],g:c[2],b:c[3],a:c[4]}:(c=V.hsl.exec(a))?{h:c[1],s:c[2],l:c[3]}:(c=V.hsla.exec(a))?{h:c[1],s:c[2],l:c[3],a:c[4]}:(c=V.hsv.exec(a))?{h:c[1],s:c[2],v:c[3]}:(c=V.hsva.exec(a))?{h:c[1],s:c[2],v:c[3],a:c[4]}:(c=V.hex8.exec(a))?{r:C(c[1]),g:C(c[2]),b:C(c[3]),a:I(c[4]),format:b?"name":"hex8"}:(c=V.hex6.exec(a))?{r:C(c[1]),g:C(c[2]),b:C(c[3]),format:b?"name":"hex"}:(c=V.hex4.exec(a))?{r:C(c[1]+""+c[1]),g:C(c[2]+""+c[2]),b:C(c[3]+""+c[3]),a:I(c[4]+""+c[4]),format:b?"name":"hex8"}:(c=V.hex3.exec(a))?{r:C(c[1]+""+c[1]),g:C(c[2]+""+c[2]),b:C(c[3]+""+c[3]),format:b?"name":"hex"}:!1}function L(a){var b,c;return a=a||{level:"AA",size:"small"},b=(a.level||"AA").toUpperCase(),c=(a.size||"small").toLowerCase(),"AA"!==b&&"AAA"!==b&&(b="AA"),"small"!==c&&"large"!==c&&(c="small"),{level:b,size:c}}var M=/^\s+/,N=/\s+$/,O=0,P=a.round,Q=a.min,R=a.max,S=a.random;b.prototype={isDark:function(){return this.getBrightness()<128},isLight:function(){return!this.isDark()},isValid:function(){return this._ok},getOriginalInput:function(){return this._originalInput},getFormat:function(){return this._format},getAlpha:function(){return this._a},getBrightness:function(){var a=this.toRgb();return(299*a.r+587*a.g+114*a.b)/1e3},getLuminance:function(){var b,c,d,e,f,g,h=this.toRgb();return b=h.r/255,c=h.g/255,d=h.b/255,e=.03928>=b?b/12.92:a.pow((b+.055)/1.055,2.4),f=.03928>=c?c/12.92:a.pow((c+.055)/1.055,2.4),g=.03928>=d?d/12.92:a.pow((d+.055)/1.055,2.4),.2126*e+.7152*f+.0722*g},setAlpha:function(a){return this._a=z(a),this._roundA=P(100*this._a)/100,this},toHsv:function(){var a=g(this._r,this._g,this._b);return{h:360*a.h,s:a.s,v:a.v,a:this._a}},toHsvString:function(){var a=g(this._r,this._g,this._b),b=P(360*a.h),c=P(100*a.s),d=P(100*a.v);return 1==this._a?"hsv("+b+", "+c+"%, "+d+"%)":"hsva("+b+", "+c+"%, "+d+"%, "+this._roundA+")"},toHsl:function(){var a=e(this._r,this._g,this._b);return{h:360*a.h,s:a.s,l:a.l,a:this._a}},toHslString:function(){var a=e(this._r,this._g,this._b),b=P(360*a.h),c=P(100*a.s),d=P(100*a.l);return 1==this._a?"hsl("+b+", "+c+"%, "+d+"%)":"hsla("+b+", "+c+"%, "+d+"%, "+this._roundA+")"},toHex:function(a){return i(this._r,this._g,this._b,a)},toHexString:function(a){return"#"+this.toHex(a)},toHex8:function(a){return j(this._r,this._g,this._b,this._a,a)},toHex8String:function(a){return"#"+this.toHex8(a)},toRgb:function(){return{r:P(this._r),g:P(this._g),b:P(this._b),a:this._a}},toRgbString:function(){return 1==this._a?"rgb("+P(this._r)+", "+P(this._g)+", "+P(this._b)+")":"rgba("+P(this._r)+", "+P(this._g)+", "+P(this._b)+", "+this._roundA+")"},toPercentageRgb:function(){return{r:P(100*A(this._r,255))+"%",g:P(100*A(this._g,255))+"%",b:P(100*A(this._b,255))+"%",a:this._a}},toPercentageRgbString:function(){return 1==this._a?"rgb("+P(100*A(this._r,255))+"%, "+P(100*A(this._g,255))+"%, "+P(100*A(this._b,255))+"%)":"rgba("+P(100*A(this._r,255))+"%, "+P(100*A(this._g,255))+"%, "+P(100*A(this._b,255))+"%, "+this._roundA+")"},toName:function(){return 0===this._a?"transparent":this._a<1?!1:U[i(this._r,this._g,this._b,!0)]||!1},toFilter:function(a){var c="#"+k(this._r,this._g,this._b,this._a),d=c,e=this._gradientType?"GradientType = 1, ":"";if(a){var f=b(a);d="#"+k(f._r,f._g,f._b,f._a)}return"progid:DXImageTransform.Microsoft.gradient("+e+"startColorstr="+c+",endColorstr="+d+")"},toString:function(a){var b=!!a;a=a||this._format;var c=!1,d=this._a<1&&this._a>=0,e=!b&&d&&("hex"===a||"hex6"===a||"hex3"===a||"hex4"===a||"hex8"===a||"name"===a);return e?"name"===a&&0===this._a?this.toName():this.toRgbString():("rgb"===a&&(c=this.toRgbString()),"prgb"===a&&(c=this.toPercentageRgbString()),("hex"===a||"hex6"===a)&&(c=this.toHexString()),"hex3"===a&&(c=this.toHexString(!0)),"hex4"===a&&(c=this.toHex8String(!0)),"hex8"===a&&(c=this.toHex8String()),"name"===a&&(c=this.toName()),"hsl"===a&&(c=this.toHslString()),"hsv"===a&&(c=this.toHsvString()),c||this.toHexString())},clone:function(){return b(this.toString())},_applyModification:function(a,b){var c=a.apply(null,[this].concat([].slice.call(b)));return this._r=c._r,this._g=c._g,this._b=c._b,this.setAlpha(c._a),this},lighten:function(){return this._applyModification(o,arguments)},brighten:function(){return this._applyModification(p,arguments)},darken:function(){return this._applyModification(q,arguments)},desaturate:function(){return this._applyModification(l,arguments)},saturate:function(){return this._applyModification(m,arguments)},greyscale:function(){return this._applyModification(n,arguments)},spin:function(){return this._applyModification(r,arguments)},_applyCombination:function(a,b){return a.apply(null,[this].concat([].slice.call(b)))},analogous:function(){return this._applyCombination(w,arguments)},complement:function(){return this._applyCombination(s,arguments)},monochromatic:function(){return this._applyCombination(x,arguments)},splitcomplement:function(){return this._applyCombination(v,arguments)},triad:function(){return this._applyCombination(t,arguments)},tetrad:function(){return this._applyCombination(u,arguments)}},b.fromRatio=function(a,c){if("object"==typeof a){var d={};for(var e in a)a.hasOwnProperty(e)&&(d[e]="a"===e?a[e]:G(a[e]));a=d}return b(a,c)},b.equals=function(a,c){return a&&c?b(a).toRgbString()==b(c).toRgbString():!1},b.random=function(){return b.fromRatio({r:S(),g:S(),b:S()})},b.mix=function(a,c,d){d=0===d?0:d||50;var e=b(a).toRgb(),f=b(c).toRgb(),g=d/100,h={r:(f.r-e.r)*g+e.r,g:(f.g-e.g)*g+e.g,b:(f.b-e.b)*g+e.b,a:(f.a-e.a)*g+e.a};return b(h)},b.readability=function(c,d){var e=b(c),f=b(d);return(a.max(e.getLuminance(),f.getLuminance())+.05)/(a.min(e.getLuminance(),f.getLuminance())+.05)},b.isReadable=function(a,c,d){var e,f,g=b.readability(a,c);switch(f=!1,e=L(d),e.level+e.size){case"AAsmall":case"AAAlarge":f=g>=4.5;break;case"AAlarge":f=g>=3;break;case"AAAsmall":f=g>=7}return f},b.mostReadable=function(a,c,d){var e,f,g,h,i=null,j=0;d=d||{},f=d.includeFallbackColors,g=d.level,h=d.size;for(var k=0;k<c.length;k++)e=b.readability(a,c[k]),e>j&&(j=e,i=b(c[k]));return b.isReadable(a,i,{level:g,size:h})||!f?i:(d.includeFallbackColors=!1,b.mostReadable(a,["#fff","#000"],d))};var T=b.names={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"0ff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000",blanchedalmond:"ffebcd",blue:"00f",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",burntsienna:"ea7e5d",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"0ff",darkblue:"00008b",darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkgrey:"a9a9a9",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkslategrey:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dimgrey:"696969",dodgerblue:"1e90ff",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"f0f",gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",grey:"808080",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgray:"d3d3d3",lightgreen:"90ee90",lightgrey:"d3d3d3",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",lightslategray:"789",lightslategrey:"789",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"0f0",limegreen:"32cd32",linen:"faf0e6",magenta:"f0f",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370db",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"db7093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",rebeccapurple:"663399",red:"f00",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",slategray:"708090",slategrey:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",wheat:"f5deb3",white:"fff",whitesmoke:"f5f5f5",yellow:"ff0",yellowgreen:"9acd32"},U=b.hexNames=y(T),V=function(){var a="[-\\+]?\\d+%?",b="[-\\+]?\\d*\\.\\d+%?",c="(?:"+b+")|(?:"+a+")",d="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?",e="[\\s|\\(]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")[,|\\s]+("+c+")\\s*\\)?";return{CSS_UNIT:new RegExp(c),rgb:new RegExp("rgb"+d),rgba:new RegExp("rgba"+e),hsl:new RegExp("hsl"+d),hsla:new RegExp("hsla"+e),hsv:new RegExp("hsv"+d),hsva:new RegExp("hsva"+e),hex3:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,hex4:/^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex8:/^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/}}();"undefined"!=typeof module&&module.exports?module.exports=b:"function"==typeof define&&define.amd?define(function(){return b}):window.tinycolor=b}(Math);
/*!
 * jQuery bootstrap 4 breakpoint check
 * Check the current visibility of bootstrap 3 breakpoints
 *
 * @example `$.isXs()` function alias for `$.isBreakpoint("xs")`
 * @example `$.isSm()` function alias for `$.isBreakpoint("sm")`
 * @example `$.isMd()` function alias for `$.isBreakpoint("md")`
 * @example `$.isLg()` function alias for `$.isBreakpoint("lg")`
 * @example `$.isXl()` function alias for `$.isBreakpoint("xl")`
 * @version 1.0.0
 * @copyright Jens A. (cakebake) and other contributors
 * @license Released under the MIT license
 */
!function(n){n.isBreakpoint=function(e){var i,s,o;switch(e){case"xs":o="d-none d-sm-block";break;case"sm":o="d-none d-md-block";break;case"md":o="d-none d-lg-block";break;case"lg":o="d-none d-xl-block";break;case"xl":o="d-none"}return i=n("<div/>",{class:o}).appendTo("body"),s=i.is(":hidden"),i.remove(),s},n.extend(n,{isXs:function(){return n.isBreakpoint("xs")},isSm:function(){return n.isBreakpoint("sm")},isMd:function(){return n.isBreakpoint("md")},isLg:function(){return n.isBreakpoint("lg")},isXl:function(){return n.isBreakpoint("xl")}})}(jQuery);