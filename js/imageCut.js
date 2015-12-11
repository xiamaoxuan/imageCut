/**
 * Created by 夏茂轩 on 2015/12/4.
 */
"use strict";
define(function (require, exports, moudle) {
    require("js/jquery");
    var imageCut = function () {
        return {
            firstPosition: undefined,//第一次点击的点
            secondPostion: undefined,//第二次点击的点
            div: undefined,
            div_id: undefined,
            cover_div: undefined,
            cover_div_id: undefined,
            cover_dom: undefined,
            init: function (initDom) {
                this.dom = $(initDom);
                var imageWith = this.getNums($(initDom).css("width"));
                var imageHeight = this.getNums($(initDom).css("height"));
                var abTop = $(initDom).offset().top;
                var abLeft = $(initDom).offset().left;
                this.cover_div_id = this.uuid();
                this.cover_div = "<div id='" + this.cover_div_id + "' style='z-index:5;width: " + imageWith + "px;height:" + imageHeight + "px;'><div style='z-index: 10;width: 100%;height: 100%;background-color: red;filter:alpha(opacity=0); -moz-opacity:0; -khtml-opacity: 0;opacity: 0;'></div></div>";
                $(this.cover_div).appendTo(this.dom.parent());
                this.cover_dom = $("#" + this.cover_div_id);
                this.cover_dom.offset({top: abTop, left: abLeft});
                var Obj=this;
                //jquery对象
                $(document).bind("mouseup", function () {
                    if (Obj.cover_dom != undefined) {
                        Obj.cover_dom.unbind("mousemove");
                    }
                    if (Obj.div != undefined) {
                        Obj.div.dom.unbind("mousemove");
                    }
                });
                return this;
            },
            listen: function () {
                //第一次点击的时候
                var imageObj = this;
                this.cover_dom.bind("mousedown", function (e) {
                    //获取第一个点的位置
                    imageObj.firstPosition = imageObj.getLocation(e);
                    //鼠标移动的时候获取鼠标的位置
                    imageObj.cover_dom.bind("mousemove", function (e1) {
                        imageObj.secondPostion = imageObj.getLocation(e1);
                        imageObj.cover_dom.unbind("mouseup").bind("mouseup", function () {
                            imageObj.cover_dom.unbind("mousemove");
                            if (imageObj.div != undefined) {
                                imageObj.div.dom.unbind("mousemove");
                            }
                        });
                        imageObj.drawDiv(imageObj.firstPosition, imageObj.secondPostion);
                    });
                });
            }, drawDiv: function (first, second) {
                var imageObject = this;
                if (this.div != undefined) {
                    this.div.dom.remove();
                }
                var parentX = this.dom.offset().top;
                var parentY = this.dom.offset().left;
                var divRelativeX = first[0] - parentX;
                var divRelativeY = first[1] - parentY;
                console.info(parentX+":"+parentY);
                console.info("first:"+first);
                console.info("second:"+second);
                var divWith = second[0] - first[0];
                var divHeight = second[1] - first[1];
                if (divWith < 0) {
                    divWith = Math.abs(divWith);
                }
                if (divHeight < 0) {
                    divHeight = Math.abs(divHeight);
                }
                if (this.div_id == undefined) {
                    this.div_id = this.uuid();
                }
                var spans = "<span class='left_top' style='display: block;cursor: nw-resize;position: absolute;top:-1px;left:-1px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='top_mid' style='display: block;cursor: n-resize;position: absolute;top:-1px;left:" + ((divWith - 6) / 2) + "px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='right_top' style='display: block;cursor:ne-resize;position: absolute;top:-1px;left:" + (divWith - 5) + "px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='left_mid' style='display: block;cursor: w-resize;position: absolute;top:" + ((divHeight - 6) / 2) + "px;left:-1px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='right_mid' style='display: block;cursor: w-resize;position: absolute;top:" + ((divHeight - 6) / 2) + "px;left:" + (divWith - 5) + "px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='left_bottom' style='display: block;cursor: sw-resize;position: absolute;top:" + (divHeight - 5) + "px;left:-1px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='bottom_mid' style='display: block;cursor: s-resize;position: absolute;top:" + (divHeight - 5) + "px;left:" + ((divWith - 6) / 2) + "px;border: 1px solid black;width: 4px;height: 4px'></span>" +
                    "<span class='right_bottom' style='display: block;cursor:se-resize;position: absolute;top:" + (divHeight - 5) + "px;left:" + (divWith - 5) + "px;border: 1px solid black;width: 4px;height: 4px'></span>";
                var div = "<div  onselectstart='return false' ondragstart='return false'  id='" + this.div_id + "' style='border: 1px black dashed; width:" + divWith +
                    "px;height: " + divHeight +
                    "px;cursor:move;position: absolute;"+
                    "'>" + spans + "</div>";
                $(div).appendTo(imageObject.cover_dom);
                imageObject.div = {
                    dom: $("#" + this.div_id)
                };
                //imageObject.div.dom.offset({top:first[1],left:first[0]});
                if(first[1]-second[1]<0){
                    imageObject.div.dom.offset({top:first[1]});
                }else{
                    imageObject.div.dom.offset({top:second[1]});
                }if(first[0]-second[0]<0){
                    imageObject.div.dom.offset({left:first[0]});
                }else{
                    imageObject.div.dom.offset({left:second[0]});
                }
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
                            if (top >= 0 && left >= 0 && top < maxTop-1 && left < maxLeft-1) {
                                imageObject.div.dom.css({
                                    top: top + "px",
                                    left: left + "px"
                                });
                            } else if (top >= 0 && left < 0 && top < maxTop-1) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            } else if (top < 0 && left >= 0 && left < maxLeft-1) {
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
                            if (top >= 0 && top < maxTop-1) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            }
                            preLocation = currentLocation;
                        } else if (x >= 0 && y < 0) {
                            if (top < maxTop-1 && top >= 0) {
                                imageObject.div.dom.css({
                                    top: top + "px"
                                });
                            }
                            if (left >= 0 && left < maxLeft-1) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            }
                            preLocation = currentLocation;
                        } else if (x >= 0 && y >= 0) {
                            if (top < maxTop-1 && left < maxLeft-1 && top >= 0 && left >= 0) {
                                imageObject.div.dom.css({
                                    top: top + "px",
                                    left: left + "px"
                                });
                            } else if (top > maxTop-1 && left < maxLeft-1 && left >= 0) {
                                imageObject.div.dom.css({
                                    left: left + "px"
                                });
                            } else if (top < maxTop-1 && left > maxLeft-1 && top >= 0) {
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
            },
            getLocation: function (e) {
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
            , stopBubble: function (e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    window.event.cancelBubble = true;
                }
            },
            uuid: function () {
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
            },
            getNums: function (str) {
                return parseInt(str.substring(0, str.length - 2));
            }
        };
    };
    //暴露接口
    exports.imageCut = imageCut;
});