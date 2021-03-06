jQuery.extend = jQuery.fn.extend = function () {

    //被混入的目标
    var target = arguments[0];

    //传入一个参数，把这个参数的内容混入到this中
    if (arguments.length === 1) {
        target = this;
        for ( var key in arguments[0] ) {
            this[key] = arguments[0][key];
        }
    }

    //传入多个参数，把后面对象的内容混入到第一个对象中
    else if ( arguments.length >= 2 ) {

        //遍历得到后面所有的对象
        for ( var i = 1, len = arguments.length; i < len; i++ ) {

            //遍历每一个对象所有属性
            for ( var key in arguments[i] ) {

                //把后面对象混入到第一个对象中
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    //给谁混入就返回谁
    return target;
};

//添加静态方法
$.extend({

    ajaxSettings: {
        url: location.href,     //默认的URL为本地地址
        type: "get",        //默认请求的方法为GET
        async: true,        //默认为异步请求
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",        //POST发送数据时设置
        timeout: null,          //默认不看延迟事件
        dataType: 'JSON',       //默认认为请求的数据是JSON
        success: function () {},
        error: function () {},
        complete: function () {},

    },

    //把对象转化为url参数形式的字符串
    urlStringify: function (data) {
        var result = '', key;

        //传入的不是对象
        if (!jQuery.isObject(data)) {
            return result;
        }

        for ( key in data) {

            //为了防止IE发送的汉字乱码，所以需要统一编码一下
            result +=  window.encodeURI(key) + '=' + data + window.encodeURI(data[key]) + '&';
        }

        //从0截取到倒数第一个返回
        return result.slice(0,-1);
    },

    //加工options
    processOptions: function ( options) {
        optionsNew = {};

        //合并用户和默认的配置项，得到一份新的
        optionsNew = {};
        jQuery.extend(optionsNew, jQuery.ajaxSettings, options);

        //对data进行加工处理
        optionsNew.data = jQuery.urlStringify(optionsNew.data);

        // 把type统一转化为大写，防止意外
        optionsNew.type = optionsNew.type.toUpperCase();

        //如果是GET请求，把数据加到URL中
        if ( optionsNew.type === 'GET') {
            optionsNew.url += '?' + optionsNew.data;
            optionsNew.data = null;
        }

        //返回加工后的配置
        return optionsNew;
    },

    //ajax封装
    ajax: function (options) {

        var optionsNew, xhr, result, timer;

        //工厂得到一份处理好的配置项
        optionsNew = jQuery.processOptions(options);

        //创建xhr对象，发送请求
        xhr = new XMLHttpRequest();
        xhr.open( optionsNew.type, optionsNew.url, optionsNew.async);

        //如果为POST请求，给一个请求头
        if ( optionsNew.type === 'POST') {
            xhr.setRequestHeader('Content-Type', optionsNew.contentType);
        }
        xhr.onreadystatechange = function () {


            //先判断请求是否完成，完成就执行complete方法
            if ( xhr.readyState === 4 ) {

                //在指定时间内完成了请求，那么清除定时器
                clearTimeout(timer);

                optionsNew.complete();

                //判断请求是否成功，成功过就执行success方法，失败执行error方法
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {

                    switch ( optionsNew.dataType ) {
                        case 'JSON':
                            result = JSON.parse(xhr.responseText);
                            break;
                        case "script":
                            result = eval(xhr.responseText);
                            break;
                        case 'style':
                            $('<style></style>').html(xhr.responseText).appendTo('head');
                            result = xhr.responseText;
                            break;
                        default:
                            result = xhr.responseText;
                            break;
                    }
                    optionsNew.success(result);
                }
                else{
                    optionsNew.error(xhr.status);
                }
            }
        };

        //如果设置了超时，那么开始一个定时器
        if ( optionsNew.timeout ) {

            //在指定的事件内，请求还没有完成，那么直接调用error方法报错
            timer = setTimeout( function () {

                //超时执行timeout
                optionsNew.error('Timeout!');

                //error执行了，事件回调就没有必要执行了
                xhr.onreadystatechange = null;

            },optionsNew.timeout);
        }
        xhr.send(optionsNew.data);

    },


    get: function ( url, data, fn ) {

        //如果传入两个参数，默认认为第二个参数为回调
        fn = fn || data || function(){};
        jQuery.ajax({
            url: url,
            data: data,
            success: fn
        })
    },

    post: function ( url, data, fn ) {
        //如果传入两个参数，默认认为第二个参数为回调
        fn = fn || data || function () {};
        jQuery.ajax({
            type: 'POST',
            url: url,
            data: data,
            success: fn
        })
    },

    //执行脚本
    getScript: function ( url, data, fn ) {
        //如果传入两个参数，默认认为第二个参数为回调
        fn = fn || data || function () {};
        jQuery.ajax({
            dataType: 'script',
            url: url,
            data: data,
            success: fn
        })
    },

    //加载JSON数据
    getJSON: function (url, data, fn) {
        //如果传入两个参数，默认为第二个参数为回调
        fn = fn || data || function () {};
        jQuery.ajax({
            dataType: 'JSON',
            url: url,
            data: data,
            success: fn
        })
    },

    //加载样式
    getStyle: function (url, data, fn) {
        //如果传入两个参数，默认为第二个参数为回调
        fn = fn || data || function () {};
        jQuery.ajax({
            dataType: 'style',
            url: url,
            data: data,
            success: fn
        })
    }

});
