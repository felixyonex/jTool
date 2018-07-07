    //添加静态方法
    $.extend({
        //获取样式，已经处理了兼容性
        getStyle: function (dom,style) {

            if (window.getComputedStyle) {
                return window.getComputedStyle(dom)[style];
            }
            else{
                return dom.currentStyle[style];
            }
        }
    });



//给原型扩展属性和样式操作方法，这样jQ就可以使用了
$.fn.extend({

    //设置或者获取元素的属性节点值
    attr: function (attr, val) {

        /*
        * 实现思路：
        * 1.判断attr是不是字符串或者对象，不是直接return this
        * 2.如果是字符串，那么继续判断arguments的length
        * 3.length为1，则获取第一个元素指定的属性节点值返回
        * 4.length>=2,则遍历所有元素，分别给他们设置新的属性节点值（setAttribute)
        * 5.如果不是字符串（是对象），那么遍历这个对象，得到所有的属性节点值，
        * 然后遍历所有的元素，把所有的属性节点分别添加到这些元素中
        * 6.return this
        * */

        if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {

            //不是字符串也不是对象，返回this
            return this;
        }

        //如果是字符串
        if (jQuery.isString(attr)) {

            //如果length为1
            if (arguments.length === 1) {
                return this.get(0).getAttribute(attr);
            }
            //如果length为多个（2和2以上）
            //则遍历所有元素，分别设置属性节点值
            else {

                for (var i=0, len= this.length; i<len; i++) {
                    this[i].setAttribute(attr,val);
                }
            }
        }
        //如果是对象
        //便利这个对象，和所有的元素，分别添加遍历到的属性节点值
        else {

            //遍历得到所有的属性节点和属性节点值
            for (var key in attr) {

                //遍历得到所有的元素
                for (var i=0, len= this.length; i<len; i++) {
                    this[i].setAttribute(key,attr[key])
                }
            }
        }
        //链式编程
        return this;

    },

    //提升版本
    _attr: function (attr, val) {

        /*
        * 实现思路：
        * 1.判断arguments.length
        * 2.如果为1
        * 3.继续判断attr是不是字符串，如果是获取第一个元素指定的属性节点值返回
        * 4.如果不是继续判断是不是对象，如果是便利这个对象，得到所有属性节点值
        * 然后遍历所有元素，把所有的属性节点分别添加到这些元素中
        * 5.如果为多个（2及以上），遍历所有元素分别设置属性节点值
        * 6.return this
        * */

        //把实例别称存储一下，为了在其他地方使用
        var self = this;

        //如果参数个数为1
        if (arguments.length === 1) {

            //如果是字符串,获取第一个元素指定的属性节点值返回
            if (jQuery.isString(attr)) {
                return this[0].getAttribute(attr);
            }

            //如果是对象,把对象中所有的属性节点值添加到所有的元素中
            else if (jQuery.isObject(attr)) {

                //-------使用jQ静态each方法遍历attr对象
                jQuery.each(attr,function (key,val) {
                    //这里遍历到的val不是对象类型，是基本数据类型，
                    // 我们要使用的就是基本数据类型，而this是基本数据类型的包装类型
                    //所以我们这里不能使用this

                    self.each(function () {

                        //给遍历到的每一个元素分别设置外面遍历到的属性节点
                        this.setAttribute(key,val);

                    });

                })
            }
        }

        //如果属性为多个
        else if ( arguments.length >=2 ) {

            //遍历所有元素分别设置对应的属性节点值
            this.each(function () {
                this.setAttribute(attr,val);
            })
        }


        //链式编程
        return this;

    },

    prop: function (attr,val) {
        /*
        * 实现思路：
        * 1.判断attr是不是字符串或者对象，不是直接return this
        * 2.如果是字符串，那么继续判断arguments的length
        * 3.length为1，则获取第一个元素指定的属性节点值返回
        * 4.length>=2,则遍历所有元素，分别给他们设置新的属性节点值（setAttribute)
        * 5.如果不是字符串（是对象），那么遍历这个对象，得到所有的属性节点值，
        * 然后遍历所有的元素，把所有的属性节点分别添加到这些元素中
        * 6.return this
        * */

        //不是字符串也不是对象，那么就走吧
        if (!jQuery.isString(attr) && !jQuery.isObject(attr)) {
            return this;
        }

        else if (jQuery.isString(attr)) {

            //如果只有一个参数为字符串，那么返回第一个元素指定的属性值
            if (arguments.length === 1) {
                return this[0][attr];

            }

            //如果是多个参数，那么给所有元素设置指定的属性值
            else if (arguments.length >= 2) {

                for (var i=0, len = this.length; i<len; i++) {
                    this[i][attr] = val;
                }
            }
        }

        //如果传入的是attr是对象
        else {
            //遍历attr得到所有的属性
            for ( var key in attr) {

                //遍历所有的元素
                for (var i=0, len = this.length; i < len; i++){

                    //给每一个元素设置属性
                    this[i][key] = attr[key];
                }
            }

        }

        //链式编程
        return this;
    },

    _prop: function (attr,val) {
        /*
        * 实现思路
        * 1.如果arguments.length为1
        * 2.那么判attr是不是字符串，是则获取第一个元素指定的属性
        * 3.判断attr是不是对象，是则遍历这个对象得到所有的样式分别设置给所有的元素
        * 4.如果arguments.length>=2，遍历所有元素分别设置指定的属性
        * 5.链式编程返回this
        * */

        var self = this;

        //arguments.length 为1
        if (arguments.length === 1) {

            //如果为字符串
            if (jQuery.isString(attr)) {
                return this[0][attr];
            }

            //如果是对象
            else if (jQuery.isObject(attr)) {

                //遍历存储所有属性的对象
                jQuery.each(attr,function (key,val) {

                    //遍历所有元素
                    self.each(function () {

                        //给每一个元素设置遍历到的属性
                        this[key] = val;

                    })
                })
            }
        }

        //arguments.length>=2
        else if ( arguments.length >= 2 ) {

            //遍历所有的元素，以attr为键，val为值，设置属性
            this.each(function () {
                this[attr] = val;
            })
        }

        //链式编程
        return this;
    },

    //升级版
    _css: function (styleName,style) {

        /*
        * 实现思路
        * 1.如果arguments.length为1
        * 2.那么判断styleName是不是字符串，是则获取第一个元素指定的样式
        * 3.判断styleName是不是对象，是则遍历这个对象得到所有的样式分别设置给所有的元素
        * 4.如果arguments.length>=2，遍历所有元素分别设置指定的样式
        * 5.链式编程返回this
        * */
        var self = this;

        if (arguments.length === 1) {

            if (jQuery.isString(styleName)) {

                return jQuery.getStyle(this[0],styleName);
            }

            else if (jQuery.isObject(styleName)) {

                jQuery.each(styleName,function (key,val) {

                    self.each(function () {
                        this['style'][key] = val;
                    })

                });
            }
        }

        else if (arguments.length >= 2) {
            //给所有元素设置指定的样式
            this.each(function () {
                this['style'][styleName] = style;
            });

        }

        //链式编程
        return this;
    },

    css: function (styleName,style) {

        /*
        * 实现思路
        * 1.如果arguments.length为1
        * 2.那么判断styleName是不是字符串，是则获取第一个元素指定的样式
        * 3.判断styleName是不是对象，是则遍历这个对象得到所有的样式分别设置给所有的元素
        * 4.如果arguments.length>=2，遍历所有元素分别设置指定的样式
        * 5.链式编程返回this
        * */

        if (arguments.length === 1) {

            if (jQuery.isString(styleName)) {

                return jQuery.getStyle(this[0],styleName);
            }

            else if (jQuery.isObject(styleName)) {

                //遍历styleName得到所有样式
                for (var key in styleName) {

                    //遍历得到所有元素
                    for (var i=0, len = this.length; i<len; i++) {

                        //给所有的元素设置遍历到的所有样式
                        this[i]['style'][key] = styleName[key];
                    }
                }
            }
        }

        else if (arguments.length >= 2) {
            //给所有元素设置指定的样式
            for ( var i = 0, len = this.length; i < len; i++ ) {
                this[i]['style'][styleName] = style;
            }
        }

        //链式编程
        return this;
    },

    //设置或者获取元素的value属性值
    val: function (value) {

        /*
        * 实现思路：
        * 1.如果arguments.length === 0， 则直接返回第一个元素的value属性值
        * 2.否则，遍历所有的元素，分别设置对应的value属性值
        * 3.链式编程返回this
        * */

        //如果没有传参，返回第一个元素的的value属性值
        if (arguments.length === 0) {
            return this[0].value;
        }

        //否则，给每个元素设置value属性值
        else {
            for ( var i = 0, len = this.length; i < len; i++ ) {
                this[i].value = value;
            }
        }

        return this;

    },

    //提升版
    _val: function (value) {

        /*
        * 实现思路：
        * 1.如果arguments.length === 0， 则直接返回第一个元素的value属性值
        * 2.否则，遍历所有的元素，分别设置对应的value属性值
        * 3.链式编程返回this
        * */

        //如果没有传参，返回第一个元素的的value属性值
        if (arguments.length === 0) {
            return this[0].value;
        }

        //否则，给每个元素设置value属性值
        else {
            this.each(function () {
                this.value = value;
            })
        }

        return this;

    },

    //提升版2
    __val: function (value) {

        //如果没有传参，借用prop获取第一个元素的value属性值
        if (arguments.length === 0) {
            return this.prop('value');
        }

        //传参了，借用prop给所有元素设置新的value属性值
        else {
            return this.prop('value',value);
        }
    },

    //判断元素中是否含有指定的class
    hasClass: function (className) {
        /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.依次获取每一个元素的className，为了方便判断，首尾加空格
        * 3.利用处理过的className字符串的indexOf方法判断有没有指定的className（这个className也首尾加空格)
        * 4.如果有一个元素的判断结果不为-1，返回true
        * 5.否则返回false
        * */

        for ( var i = 0, len = this.length; i < len; i++ ) {

            if (( ' ' + this[i].className + ' ').indexOf(''+className+'') > -1) {
                return true;
            }
        }

        //所有的元素都没有，return false
        return false;
    },

    //提升版
    _hasClass: function (className) {
        /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.依次获取每一个元素的className，为了方便判断，首尾加空格
        * 3.利用处理过的className字符串的indexOf方法判断有没有指定的className（这个className也首尾加空格)
        * 4.如果有一个元素的判断结果不为-1，返回true
        * 5.否则返回false
        * */

        //默认所有的元素都没有指定的className
        var has = false;

        this.each(function () {

            //只要有一个元素存在指定的className，那么就修改has变量的值为true;
            if ((' '+this.className+' ').indexOf(''+className+'') > -1) {
                has = true;
            }
        });

        return has;
    },

    //提升版1
    __hasClass: function (className) {
        /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.依次获取每一个元素的className，为了方便判断，首尾加空格
        * 3.利用处理过的className字符串的indexOf方法判断有没有指定的className（这个className也首尾加空格)
        * 4.如果有一个元素的判断结果不为-1，返回true
        * 5.否则返回false
        * */

        //默认所有的元素都没有指定的className
        var has = false;

        this.each(function () {

            //只要有一个元素存在指定的className，那么就修改has变量的值为true;
            if ((' '+this.className+' ').indexOf(''+className+'') > -1) {
                has = true;

                //中断遍历
                return false;
            }
        });

        return has;
    },

    //添加元素class
    addClass: function (classNames) {
        /*
        * 实现思路：
        * 1.遍历所有的元素
        * 2.一次判断每一个元素有没有要添加的className
        * 3.有则忽略（防止重复），没有则添加（className += '' + classNames）
        * 4.处女座可以考虑trim一下
        * 5.链式编程返回this
        * */

        classNames = jQuery.trim(classNames);

        for ( var i = 0, len = this.length; i < len; i++ ) {
            if (!jQuery(this).hasClass(classNames)) {
                this[i].className = (this[i].className + ' '+classNames).trim();

            }
        }

        return this;

    },

    //提升版
    _addClass: function (classNames) {
        /*
        * 实现思路：
        * 1.先把classNames首尾空格去掉，然后使用split(' ')劈成数组
        * 2.外层遍历所有的元素
        * 3.内层遍历所有要添加的
        * 4.一次判断便利到的每一个元素有没有遍历到的每一个要添加的class
        * 5.有则忽略（防止重复），没有则添加（className += '' + classNames）
        * 6.处女座可以考虑trim一下
        * 7.链式编程返回this
        * */

        classNames = jQuery.trim(classNames).split(' ');

        //遍历所有元素
        this.each(function () {

            //这里的this是遍历到的每一个原生DOM
            // 为了复用hasClass,所以先包装一下
            var $self = jQuery(this);

            //遍历所有要添加的class
            jQuery.each(classNames,function (i,val) {

                if( !$self.hasClass(val)) {

                    //jQ实例没有className属性，
                    //得先通过实例得到原生DOM，再获取

                    //$self[0]可以把jQ对象变成DOM对象
                    $self[0].className += ' '+val;
                }
            });

        });

        return this;

    },

    //删除所有元素指定的class
    removeClass: function (className) {
        /*
        * 实现思路：
        * 1.没有参数，遍历所有的元素，设置他们的className为空
        * 2.有参数，遍历所有的元素，删除指定的className（元素.className.repalce())
        * 把指定的className替换为空格，整体trim
        * 3.链式编程返回this
        * */

        //没有传参，去掉所有元素的所有类名
        if (arguments.length === 0) {
            for ( var i = 0, len = this.length; i < len; i++ ) {
                this[i].className = '';
            }
        }

        //传参，去掉含有该类名的元素的这个类名
        else{
            //前去掉类名前后空格
            className = jQuery.trim(className);

            this.each(function () {
                this.className = (' ' + this.className + ' ').replace(' ' + className + ' ', ' ')
            })
        }
        return this;

    },

    //支持批量删除
    _removeClass: function (classNames) {
        /*
        * 实现思路：
        * 1.没有参数，遍历所有的元素，设置他们的className为空
        * 2.有参数，把classNames首尾空格去掉，然后使用split(' ')劈成数组
        * 3.外层遍历所有的元素
        * 4.内层遍历所有要删除的class
        * 5.遍历到的每一个元素删除遍历到的class（删除方式和hasClass类似）
        * 6.链式编程返回this
        * */



        //没有传参，去掉所有元素的所有类名
        if (arguments.length === 0) {
            this.each(function () {
                this.className = '';
            });
        }


        //传参，去掉含有该类名的元素的这个类名
        else{
            //前去掉类名前后空格,用split劈成数组
            classNames = jQuery.trim(classNames).split(' ');

            //遍历所有元素
            this.each(function () {
                var self = this;

                //遍历所有的class
                jQuery.each(classNames,function (i,val) {

                    var valRegExp = new RegExp('\\b'+val+'\\b','g');
                    console.log(valRegExp);

                    //使用正则的字符边界来区分
                    self.className = self.className.replace(valRegExp,'');


                    /*                        //元素删除指定的class
                                            // self.className = (' ' + self.className + ' ').replace(' ' + val + ' ',' ');*/

                    //强迫症，去掉前后空格
                    // self.className = jQuery.trim((' ' + self.className + ' ').replace(' ' + val + ' ',' '));
                })
            })
        }
        return this;

    },

    //有则删除，没有则添加
    toggleClass: function (className) {

        /*
        * 实现思路：
        * 1.遍历所有元素
        * 2.判断每一个元素有则删除，没有则添加
        * */


        this.each(function () {
            //这里的this是遍历到的每一个原生dom
            // 包装成jQ对象，为了更好的复用
            var $this = jQuery(this);

            //有该类名则删除
            if ($this.hasClass(className)) {
                $this.removeClass(className);
            }

            //没有则添加
            else {
                $this.addClass(className);
            }
        });

        return this;

    },

    //有则删除，没有则添加
    _toggleClass: function (classNames) {

        /*
        * 实现思路：
        * 1.把classNames首尾空格去掉，然后使用split(' ')劈成数组
        * 2.外层遍历所有的元素
        * 3.内层遍历所有要toggle的class
        * 4.遍历到的每一个元素toggle遍历到的class（方式和hasClass类似）
        * 5.链式编程返回this
        * */

        classNames = jQuery.trim(classNames).split(' ');

        //遍历每个对象
        this.each(function () {
            //这里的this是遍历到的每一个原生dom
            // 包装成jQ对象，为了更好的复用
            var $self = jQuery(this);

            //遍历每个class
            jQuery.each(classNames,function (i,val) {
                //有该类名则删除
                if ($self.hasClass(val)) {
                    $self._removeClass(val);

                }
                //没有则添加
                else {
                    $self.addClass(val);
                }

            })

        });
        return this;
    }
});
