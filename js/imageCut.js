/**
 * Created by 夏茂轩 on 2015/12/4.
 */
"use strict";
define(function (require, exports, moudle) {
    require("js/jquery");
    var imageCut ={
        firstPosition: undefined,//第一次点击的点
        secondPostion: undefined,//第二次点击的点
        div: undefined,
        div_id: undefined
    }
    imageCut.init = function (initDom) {
        //jquery对象
        $(document).bind("mouseup", function () {
            if (imageCut.dom != undefined) {
                imageCut.dom.unbind("mousemove");
            }
            if (imageCut.div != undefined) {
                imageCut.div.dom.unbind("mousemove");
            }
        });
        this.dom = $(initDom);
        return this;
    }
    //监听在div内鼠标事件
    imageCut.listen = function () {
        //第一次点击的时候
        var imageObj = this;
        this.dom.bind("mousedown", function (e) {
            //获取第一个点的位置
            imageObj.firstPosition = imageObj.getLocation(e);
            //鼠标移动的时候获取鼠标的位置
            imageObj.dom.bind("mousemove", function (e1) {
                imageObj.secondPostion = imageObj.getLocation(e1);
                imageObj.dom.unbind("mouseup").bind("mouseup", function () {
                    imageObj.dom.unbind("mousemove");
                    if (imageObj.div != undefined) {
                        imageObj.div.dom.unbind("mousemove");
                    }
                });
                imageObj.drawDiv(imageObj.firstPosition, imageObj.secondPostion);
            });
        });
    }
    imageCut.drawDiv = function (first, second) {
        var imageObject = this;
        if (this.div != undefined) {
            this.div.dom.remove();
        }
        var parentX = this.dom.offset().top;
        var parentY = this.dom.offset().left;
        var divRelativeX = first[0] - parentX;
        var divRelativeY = first[1] - parentY;
        var divWith = second[0] - first[0];
        var divHeight = second[1] - first[1];
        if (divWith < 0) {
            divRelativeX = divRelativeX + divWith;
            divWith = Math.abs(divWith);
        }
        if (divHeight < 0) {
            divRelativeY = divRelativeY + divHeight;
            divHeight = Math.abs(divHeight);
        }
        if (this.div_id == undefined) {
            this.div_id = this.uuid();
        }
        var div = "<div  onselectstart='return false' ondragstart='return false'  id='" + this.div_id + "' style='border: 1px black dashed;   -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; -khtml-user-select: none;user-select: none; width:" + divWith +
            "px;height: " + divHeight +
            "px;cursor:move;position: relative;top:" + divRelativeY +
            "px;left:" + divRelativeX +
            "px;'>" + "</div>";
        $(div).appendTo(imageCut.dom);
        imageObject.div = {
            dom: $("#" + this.div_id)
        };
        var domWidth = imageObject.getNums(imageObject.dom.css("width"));
        var domHeight = imageObject.getNums(imageObject.dom.css("height"));
        var maxTop = domHeight - divHeight;
        var maxLeft = domWidth - divWith;
        //给当前截取的div绑定事件
        this.div.dom.unbind("mousedown").bind("mousedown", function (e) {
            imageObject.stopBubble(e);
            var preLocation = imageObject.getLocation(e);
            imageObject.div.dom.unbind("mousemove").bind("mousemove", function (e1) {
                var currentLocation = imageObject.getLocation(e1);
                var x = currentLocation[0] - preLocation[0];
                var y = currentLocation[1] - preLocation[1];
                var top = imageObject.getNums(imageObject.div.dom.css("top")) + y;
                var left = imageObject.getNums(imageObject.div.dom.css("left")) + x;
                //TODO 边界控制
                if (x < 0 && y < 0) {
                    if (top >= 0 && left >= 0 && top < maxTop && left < maxLeft) {
                        imageObject.div.dom.css({
                            top: top + "px",
                            left: left + "px"
                        });
                    } else if (top >= 0 && left < 0 && top < maxTop) {
                        imageObject.div.dom.css({
                            top: top + "px"
                        });
                    } else if (top < 0 && left >= 0 && left <= maxLeft) {
                        imageObject.div.dom.css({
                            left: left + "px"
                        });
                    }
                    preLocation = currentLocation;
                } else if (x < 0 && y >= 0) {
                    if (left < maxLeft && left >= 0) {
                        imageObject.div.dom.css({
                            left: left + "px"
                        });
                    }
                    if (top >= 0 && top < maxTop) {
                        imageObject.div.dom.css({
                            top: top + "px"
                        });
                    }
                    preLocation = currentLocation;
                } else if (x >= 0 && y < 0) {
                    if (top < maxTop && top >= 0) {
                        imageObject.div.dom.css({
                            top: top + "px"
                        });
                    }
                    if (left >= 0 && left < maxLeft) {
                        imageObject.div.dom.css({
                            left: left + "px"
                        });
                    }
                    preLocation = currentLocation;
                } else if (x >= 0 && y >= 0) {
                    if (top < maxTop && left < maxLeft && top >= 0 && left >= 0) {
                        imageObject.div.dom.css({
                            top: top + "px",
                            left: left + "px"
                        });
                    } else if (top >= maxTop && left < maxLeft && left >= 0) {
                        imageObject.div.dom.css({
                            left: left + "px"
                        });
                    } else if (top < maxTop && left >= maxLeft && top >= 0) {
                        imageObject.div.dom.css({
                            top: top + "px"
                        });
                    }
                    preLocation = currentLocation;
                }
                imageObject.div.dom.unbind("mouseup").bind("mouseup", function () {
                    imageObject.div.dom.unbind("mousemove");
                });
            })
        });
    }
    imageCut.getNums = function (str) {
        return parseInt(str.substring(0, str.length - 2));
    }
    imageCut.getLocation = function (e) {
        var array = new Array();
        var pageX = e.pageX;
        var pageY = e.pageY;
        if (pageX == undefined) {
            pageX = event.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
        }
        if (pageY == undefined) {
            pageY = event.clientY + document.body.scrollTop || document.documentElement.scrollTop;
        }
        array.push(pageX);
        array.push(pageY);
        return array;
    }
    imageCut.stopBubble = function (e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            window.event.cancelBubble = true;
        }
    }
    imageCut.uuid = function () {
        var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var chars = CHARS, uuid = new Array(36), rnd = 0, r;
        for (var i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };
    //暴露接口
    exports.imageCut = imageCut;
});