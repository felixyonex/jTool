(function (w) {

    var version = '1.0.0';

    //工厂
    function jQuery (selector) {
        return new jQuery.fn.init(selector);
    }
    //替换原型+原型简称
    jQuery.fn = jQuery.prototype = {
        constructor: jQuery,

        /*1.jquery获取版本号*/
        jquery: version,

        /*2.selector所有实例默认的选择器，也代表实例是一个jQuery类型对象*/
        selector: '',

        /*length代表所有实例默认的长度*/
        length: 0,

        /*4.toArray 把实例转化为数组返回*/
        toArray: function () {
            return [].slice.call(this);
        },

        /*5.get获取制定下标的元素，获取的是原生DOM*/
        get: function ( i ) {
            /*1.如果传入null 或undefined，那么转换为数组返回
            * 2.如果传入的是正数，按照制定的下标获取元素返回
            * 3.如果传入的是负数，按照倒着(this.length+负数)的下标获取元素返回
            * */

            //null,undefined
            if ( i == null ) {
                return this.toArray();
            }

            //其他
            if ( i >= 0) {
                return this[i];
            }else {
                return this[this.length + i];
            }
        },

        //简化版
        _get: function ( i ) {
            return i == null?this.toArray():(i>=0? this[i]:this[this.length + i]);
        },

        /*6.each 遍历实例，遍历到的数据分别传给回调使用*/
        each: function ( fn ) {
            return jQuery.each( this, fn );
        },

        /*7.map遍历实例，把遍历到的数据分别传给回调使用，然后把回调的返回值收集起来组成一个数组返回*/
        map: function ( fn ) {
            return jQuery.map( this, fn );
        },

        /*8.slice 截取实例的部分元素，构成一个新的jquery实例返回*/
        slice: function () {
            /*
            * 1.通过数组的slice截取部分元素(slice返回的是数组)
            * 2.把截取到的元素转化为实例对象返回
            * */

            /*因为slice的参数会有变化，所以需要的是arguments,
            * 我们要把arguments中的每一项传给数组的slice，所以需要借用apply平铺传递过去
            * 最后把slice返回数组，通过jQuery工厂包装成实例返回
            * */

            var nodes = [].slice.apply(this,arguments);
            return jQuery(nodes);
        },
        _slice: function () {

            return jQuery([].slice.apply(this,arguments));
        },


        /*11. eq获取制定下标的元素，获取的是jQuery类型的实例对象*/
        eq: function (i) {
            /*1.如果传入null 或undefined，返回一个新实例
            * 2.如果传入的是正数，按照制定的下标获取元素，再包装成新实例返回
            * 3.如果传入的是负数，按照倒着(this.length+负数)的下标获取元素，再包装成新实例返回
            * */

            /*               null,undefined得到新实例*/
            if (i==null) {
                return jQuery();
            }
            if (i>=0) {
                return jQuery(this[i]);
            }else{
                return jQuery(this[this.length +i]);
            }
        },

        _eq: function(i) {
            return i == null? jQuery():jQuery(this.get(i));
        },

        /*9.first获取实例中的第一个元素，是jQuery类型的实例对象*/
        first: function () {
            return this.eq(0);
        },

        /*10.last获取实例中最后一个元素，是jQuery类型的实例对象*/
        last: function () {
            return this.eq(-1);
        },

        /*12. push 给实例添加新元素*/
        push: [].push,

        /*13. sort 对势力中的元素进行排序*/
        sort: [].sort,

        /*14. splice 按照制定下标制定数量删除元素，也可以替换删除的元素*/
        splice: [].splice
    };

    //给jQuery和原型分别添加extend方法
    jQuery.extend = jQuery.fn.extend = function (obj) {
        for ( var key in obj) {
            this[ key ] = obj[ key ];
        }
    }

    //给jQuery添加一些静态方法
    jQuery.extend({

        //遍历对象或者类数组
        each: function( obj, fn ) {
            var i, len, key;

            //likeArray
            if ( jQuery.isLikeArray( obj )) {
                for ( i=0, len = obj.length; i<len; i++) {
                    if ( fn.call( obj[ i ], i, obj[ i ] ) === false ) {
                        break;
                    }
                }
            }else {
                for ( key in obj ) {
                    if ( fn.call(obj[ key ], key, obj[ key ]) === false) {
                        break;
                    }
                }
            }
            //返回obj，可以实现链式编程
            return obj;
        },

        //map实现
        map:function(obj, fn) {

            var i, len, key, result = [];

            if ('length' in obj) {
                for ( i=0, len = obj.length; i<len; i++) {
                    result.push(fn.call(obj[i],obj[i],i))
                }
            }else {
                for ( key in obj ) {
                    result.push(fn.call( obj[key], obj[key], key ));
                }
            }
            return result;
        },


        //去掉首尾空白字符
        trim : function (str){
            if (!str) {
                return str;
            }
            //优先使用原生的
            if (str.trim) {
                return str.trim();
            }
            return str.replace(/^\s+|\s+$/g,'');
        },

        //判断是否为html
        isHTML : function (html) {
            if (!html) {
                return false;
            }
            //<.>
            if (html.charAt(0) == '<' && html.charAt(html.length-1) == '>' && html.length >= 3) {
                return true;
            }
            return false;
        },
        //改进版
        _isHTML : function (html) {
            return !!html && html.charAt(0) == '<' && html.charAt(html.length-1) == '>' && html.length >= 3;
        },

        //判断是否为函数
        isFunction : function (fn) {
            if (typeof fn === 'function') {
                return true;
            }
            return false;
        },
        //改进版
        _isFunction : function (fn) {
            return typeof fn === 'function';
        },

        //判断是否为window
        isWindow : function (w) {
            if (!w) {
                return false;
            }
            if (w.window === w) {
                return true;
            }
            return false;
        },
        //改进版
        _isWindow : function (w) {
            return !!w && (w.window === w);
        },

        //判断是否为object
        isObject : function (obj) {
            // 防止typeof 对null的误判
            if (obj === null) {
                return false;
            }
            //如果是object或function，那就是对象
            if (typeof obj === 'object' || typeof obj === 'function') {
                return true;
            }
            return false;
        },


        //判断是不是真数组或者伪数组
        isLikeArray : function (arr) {

            //Function,Window,!Object
            if (jQuery.isFunction(arr) || jQuery.isWindow(arr) || !jQuery.isObject(arr)) {
                return false;
            }

            //判断是不是真数组
            if (({}).toString.call(arr) === '[object Array]') {
                return true;
            }

            //判断是不是伪数组
            if (('length' in arr) && (arr.length === 0) || (arr.length-1 in arr) ) {
                return true;
            }
            return false;
        },

        //判断是不是字符串
        isString : function (str) {
            if (typeof str === 'string') {
                return true;
            }
            return false;
        },
        //改进版
        _isString : function (str) {
            return typeof str === 'string';
        },

        ready : function (fn) {

            //先统一判断DOMContentLoaded有没有触发
            //通过document.readyState === 'complete' 判断
            //如果为true，fn可以直接调用

            //如果false，那么判断支不支持addEventListener
            //如果支持，绑定DOMContentLoaded事件

            //如果不支持，使用attachEvent绑定onreadystatechange事件
            //注意，需要在里面判断document.readyState === 'complete'才执行fn，
            //防止fn多次执行

            //DOM已经构建完毕，fn可以直接执行
            if (document.readyState === 'complete') {
                fn();
            }
            //如果没有构建完毕，那么addEventListener是否兼容
            else if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded',fn)
            }

            //如果不兼容addEventListener,那么采取attachEvent方式
            //同时事件变为了onreadystatechange,为了防止事件被多次触发，造成fn多次被执行
            // 所以需要一个包装函数来进行过滤
            else {
                document.attachEvent('onreadystatechange',function () {
                    if (document.readyState === 'complete') {
                        fn();
                    }
                })
            }
        }




    });



    //真正的构造函数，同时把构造函数放在原型中
    var init = jQuery.fn.init = function (selector) {
        // null,undefined,NaN,0,false
        if (!selector) {
            return this;
        }

        //function
        if (jQuery.isFunction(selector)) {

            //打包给ready静态方法处理
            jQuery.ready(selector);
        }
        //string
        if (jQuery.isString(selector)) {

            //为了用户友好体验，先去掉首尾空白字符
            selector = jQuery.trim(selector);

            //html
            if (jQuery.isHTML(selector)) {

                //利用一个临时的div来创建DOM
                //然后把创建好的DOM依次来push给实例
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = selector;
                [].push.apply(this,tempDiv.childNodes);
                //return this 可以不写
            }
            //selector
            else{
                try {
                    [].push.apply(this,document.querySelectorAll(selector));
                }
                catch (e) {
                    //如果报错，手动补一个length属性，代表没有获取到任何元素
                    this.length = 0;
                }
            }

        }
        //array || likeArray
        else if (jQuery.isLikeArray(selector)) {
            [].push.apply(this,[].slice.call(selector));
        }

        //其他
        else {
            this[0] = selector;
            this.length = 1;
        }
    };

    //替换init的原型为工厂的原型，这样外界就可以通过工厂给实例拓展方法
    init.prototype = jQuery.fn;


    //暴露工厂和工厂简称
    w.jQuery = w.$ = jQuery;
}( window ));

