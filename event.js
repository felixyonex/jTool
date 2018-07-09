//添加静态方法
$.extend({
  //兼容添加事件
  addEvent: function(ele, type, fn) {
    //ele必须是dom，type必须是字符串，fn必须是函数
    //有一个不是那就return
    if (!ele.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
      return;
    }

    //兼容绑定事件
    if (ele.addEventListener) {
      ele.addEventListener(type, fn);
    } else {
      ele.attachEvent("on" + type, fn);
    }
  },

  //兼容移除
  removeEvent: function(ele, type, fn) {
    //ele必须是dom，type必须是字符串，fn必须是函数
    //有一个不是那就return
    if (!ele.nodeType || !jQuery.isString(type) || !jQuery.isFunction(fn)) {
      return;
    }
    //兼容移除事件
    if (ele.removeEventListener) {
      ele.removeEventListener(type, fn);
    } else {
      ele.detachEvent("on" + type, fn);
    }
  }
});

//拓展事件方法
$.fn.extend({
  //绑定事件
  on: function(type, fn) {
    /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.判断每一个元素有没有$_event_cache这个属性值
        * 3.如果有，则继续使用，没有，则初始化为一个对象
        * 4.再继续判断这个对象有没有对应事件类型的数组
        * 5.如果没有，说明是第一次绑定该事件
        * 那么需要给$_event_cache这个对象以type为key添加一个数组，
        * 然后把传入的回调push进去，最后还得绑定对应的事件
        * 这个事件回调里面去遍历该对应事件的数组，得到每一个事件回调，依次执行，
        * 执行时，需要改变内部的this，还需要把事件对象传递过去
        * 6.如果有，直接把传入的回调push到对应事件的数组就可以了
        * 7.链式编程返回this
        * */

    this.each(function() {
      //这里的this代表遍历到的每一个元素
      //如果这个元素已经有了$_event_cache
      //就用以前的，否则赋值一个新对象
      var self = this;
      this.$_event_cache = this.$_event_cache || {};

      //如果之前没有对应事件的数组，说明是第一次绑定该事件
      if (!this.$_event_cache[type]) {
        this.$_event_cache[type] = [];
        this.$_event_cache[type].push(fn);

        jQuery.addEvent(this, type, function(e) {
          //如果是第一次绑定该事件，那么真正需要调用浏览器的方法进行事件绑定
          for (var i = 0, len = this.$_event_cache[type].length; i < len; i++) {
            this.$_event_cache[type][i].call(self, e);
          }
        });
      } else {
        this.$_event_cache[type].push(fn);
      }
    });

    return this;
  },

  //绑定事件
  _on: function(type, fn) {
    /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.判断每一个元素有没有$_event_cache这个属性值
        * 3.如果有，则继续使用，没有，则初始化为一个对象
        * 4.再继续判断这个对象有没有对应事件类型的数组
        * 5.如果没有，说明是第一次绑定该事件
        * 那么需要给$_event_cache这个对象以type为key添加一个数组，
        * 然后把传入的回调push进去，最后还得绑定对应的事件
        * 这个事件回调里面去遍历该对应事件的数组，得到每一个事件回调，依次执行，
        * 执行时，需要改变内部的this，还需要把事件对象传递过去
        * 6.如果有，直接把传入的回调push到对应事件的数组就可以了
        * 7.链式编程返回this
        * */

    this.each(function() {
      //这里的this代表遍历到的每一个元素
      //如果这个元素已经有了$_event_cache
      //就用以前的，否则赋值一个新对象
      var self = this;
      this.$_event_cache = this.$_event_cache || {};

      //如果之前没有对应事件的数组，说明是第一次绑定该事件
      if (!this.$_event_cache[type]) {
        this.$_event_cache[type] = [];
        this.$_event_cache[type].push(fn);

        jQuery.addEvent(this, type, function(e) {
          //如果是第一次绑定该事件，那么真正需要调用浏览器的方法进行事件绑定
          jQuery.each(self.$_event_cache[type], function() {
            //这里的this指的是每一个回调
            this.call(self, e);
          });
        });
      } else {
        this.$_event_cache[type].push(fn);
      }
    });

    return this;
  },

  //移除事件
  off: function(type, fn) {
    /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.遍历每一个元素的判断有没有$_event_cache对象
        * 3.如果没有$_event_cache不用处理， 如果有$_event_cache继续判断
        * 4.先判断有没有传参，没有传参（）
        * 4.如果传参了，只传入一个，那么把元素$_event_cache对象指定类型的数组清空即可
        * 5.如果传2个以上参数，那么把元素$_event_cache对象指定类型的数组中指定的回调删除即可（删除方式）
        * 6.链式编程返回this
        * */
    var argLen = arguments.length;

    this.each(function() {
      //没有绑定任何事件，就不用处理了
      if (!this.$_event_cache) {
        return;
      } else {
        //如果没有传参，把this.$_event_cache里面所有的数组清空
        if (argLen === 0) {
          for (var key in this.$_event_cache) {
            this.$_event_cache[key] = [];
          }
        } else if (argLen === 1) {
          this.$_event_cache[type] = [];
        } else {
          //遍历对应事件的数组，得到每一个回调
          for (var i = this.$_event_cache[type].length - 1; i >= 0; i--) {
            //依次和传入的回调比较，如果相等，则从数组中删除
            if (this.$_event_cache[type][i] === fn) {
              this.$_event_cache[type].splice(i, 1);
              // break;
            }
          }
        }
      }
    });

    return this;
  }
});

var events = (
  "blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu"
).split(" ");

//批量给原型添加事件，他们都复用了on方法
jQuery.each(events, function(i, eventName) {
  $.fn[eventName] = function(fn) {
    return this.on(eventName, fn);
  };
});
