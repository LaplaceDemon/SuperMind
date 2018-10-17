// https://octoperf.com/blog/2018/04/18/d3-js-drag-and-drop-tutorial/

var dragStartMouseX = 0.0;
var dragStartMouseY = 0.0;

function bindDragSVGHandler(svg,d3g) {
    var dragHandler = d3.drag()
    .on("start", function () {
        console.log("start");
        if(d3g.node().dataset.selected == "true") {
            // 已被选择，则直接开始拖动逻辑
            // console.log("selected == true");
        } else {
            // 未被选择，重新选择。
            if(d3.event.sourceEvent.ctrlKey != true) {
                cancleChoose();
            }
            createSelectSubSystem(svg, d3g);
        }

        dragStartMouseX = d3.event.x;
        dragStartMouseY = d3.event.y;

        // 选择SVG
        for(var i = 0; i < selectedSVGList.length; i++) {
            selectedSVGList[i].deltaX = parseInt(selectedSVGList[i].node().dataset.x) - d3.event.x;
            selectedSVGList[i].deltaY = parseInt(selectedSVGList[i].node().dataset.y) - d3.event.y;
        }
    })
    .on("drag", function () {
        console.log("drag");
        for(var i = 0; i < selectedSVGList.length; i++) {
            var X = (d3.event.x + selectedSVGList[i].deltaX);
            var Y = (d3.event.y + selectedSVGList[i].deltaY);
            d3SvgMove(selectedSVGList[i],X,Y);
            rePosLinkLine(selectedSVGList[i]);
            moveChooseNodes(selectedSVGList[i]);
        }
    })
    .on("end",function() {
        console.log("end");
        if(dragStartMouseX == d3.event.x && dragStartMouseY == d3.event.y) {
            if(d3.event.sourceEvent.ctrlKey != true) {
                cancleChoose();
                createSelectSubSystem(svg, d3g);
            }
        }
    });

    dragHandler(d3g);
}


function bindEventHandle(d3g,svg) {
    d3g.on("click", function() {
        console.log("click", d3.event);
        if(linkLineSystem.mode == LinkLineMode.StartChoose) {
            // 连线，点击，第一个节点
            var d3lineGroups = svg.datum().d3lineGroups;
            if(!d3lineGroups) {
                d3lineGroups = svg.select("lineGroups");
            }
            var d3line = svgAppendLinkLine(svg, d3lineGroups, d3g);
            linkLineSystem.d3line = d3line;
            linkLineSystem.mode = LinkLineMode.ChooseOne;
            cancleChoose();
        } else if(linkLineSystem.mode == LinkLineMode.ChooseOne) {
            // 连线，点击，第二个节点
            var d3line = linkLineSystem.d3line;
            var success = linkLine(d3line, d3g);
            if(success) {
                linkLineSystem.mode = LinkLineMode.StartChoose;
                cancleChoose();
            }
        }

        d3.event.stopPropagation();
        return false;
    }).on("dblclick",function() {
        // 连线模式下不允许双击出现文本框
        if(linkLineSystem.mode != LinkLineMode.Nothing) {
            return ;
        }

        var clazz = d3g.attr("class");
        if (clazz == "RectNode" || clazz == "EllipseNode") {
            dblclickSVGText(d3g);
        } else if (clazz == "DivNode") {
            dblclickDOMDiv(d3g);
        } else if(clazz == "CodeNode") {
            dblclickSVGCode(d3g);
        }
    });
}

function dblclickSVGText(d3g) {
    var d3gRect = getGroupRect(d3g);
    var d3shape = d3g.select(".shape");
    // 矢量图文本创建逻辑。
    var d3text = d3g.select("text");

    var textRect = d3text.node().getBBox();

    // 记录原文本
    var oldTextVal = d3text.text();

    // 计算<input>的大小与位置
    var inputWidth = d3gRect.width / 1.2;
    var inputHeight = 16;
    if(inputWidth < 70) {
        inputWidth = 60;
    }
    var inputLeft = parseFloat(d3gRect.x) + 10;
    var inputTop = parseFloat(d3gRect.y) + d3gRect.height/2 - inputHeight/2;

    var $input = $("<input type='text'>")
        .val(oldTextVal)
        .css("position","absolute")
        .css("min-width","60px")
        .css("width", inputWidth + "px")
        .css("height",inputHeight + "px")
        .css("left", inputLeft + "px")
        .css("top", inputTop + "px")
        .keydown(function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e.keyCode == 13) {
                // 回车
                $input.blur();
            } else if(e.keyCode == 27) {
                // esc
                $input.remove();
            }
        })
        .blur(function() {
            var newTextVal = $input.val();
            if(oldTextVal != newTextVal) {
                // 文本设置为新值
                d3text.text(newTextVal.trim());
                // 重新排版
                resizeTextShape(d3g,d3shape,d3text);
                rePosLinkLine(d3g);
            }

            $input.remove();
        })
    ;

    $("#workArea").append($input);
    $input.focus();
}

function dblclickDOMDiv(d3g) {
    var d3gRect = getGroupRect(d3g);
    var d3shape = d3g.select(".shape");

    // 记录原文本
    var $div = d3g.select("foreignObject").select("div");
    // $div.css("")
    var oldHTML = $div.html();

    // 计算<input>的大小与位置
    var editorWidth = d3gRect.width - 5;
    var editorHeight = d3gRect.height - 5;
    var editorLeft = parseFloat(d3gRect.x) + 5;
    var editorTop = parseFloat(d3gRect.y) + 5;

    // 可编辑富文本框（只支持chrome）
    var $editor = $("<div></div>")
            .html(oldHTML)
            .attr("contenteditable",true)
            .css("position","absolute")
            .css("min-width","60px")
            .css("width", editorWidth + "px")
            .css("height",editorHeight + "px")
            .css("left", editorLeft + "px")
            .css("top", editorTop + "px")
            .css("background-color","white")
            .keydown(function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if(e.keyCode == 27) {
                    // esc
                    $textarea.remove();
                    $editorCtrl.remove();
                }
            })
            .blur(function(e) {
                if(e.relatedTarget && e.relatedTarget.classList.length >0 &&e.relatedTarget.classList[0] == "editor-ctrl-button") {
                    e.relatedTarget.onclick();
                    return true;
                }
                var newHTML = $editor.html();
                if(oldHTML != newHTML) {
                    // 文本设置为新值
                    $div.html(newHTML);
                    // 重新排版
                    // resizeTextShape(d3g,d3shape,d3text);
                    rePosLinkLine(d3g);
                }
    
                $editor.remove();
                $editorCtrl.remove();
            })
            ;

    var $editorCtrl = $("<div class='editorCtrl'></div>")
        .attr("contenteditable",true)
        .css("position","absolute")
        .css("min-width","60px")
        .css("width", editorWidth + "px")
        // .css("height", "30px")
        .css("left", editorLeft + "px")
        .css("top", (editorTop - 30) + "px")
        .css("background-color","white")
        .css("border","1px solid grey")
        ;
    
    //创建按钮。
    var _iframeWindow = window;
    var _iframeDocument = document;
    var $btn0 = _createButton("加粗",function(){
        _iframeDocument.execCommand("Bold");
    });
    var $btn1 = _createButton("斜体",function(){
        _iframeDocument.execCommand("Italic");
    });
    var $btn2 = _createButton("下划线",function(){
        _iframeDocument.execCommand("Underline");
    });
    var $btn3 = _createButton("水平分割条",function(){
        _iframeDocument.execCommand("InsertHorizontalRule");
    });
    var $btn4 = _createButton("带数字的列表",function(){
        _iframeDocument.execCommand("InsertOrderedList");
    });
    var $btn5 = _createButton("带点的列表",function(){
        _iframeDocument.execCommand("InsertOrderedList");
    });
    var $btn6 = _createButton("置中",function(){
        _iframeDocument.execCommand("JustifyCenter");
    });
    var $btn7 = _createButton("置左",function(){
        _iframeDocument.execCommand("JustifyLeft");
    });
    var $btn8 = _createButton("置右",function(){
        _iframeDocument.execCommand("JustifyRight");
    });
    var $btn9 = _createButton("置全",function(){
        _iframeDocument.execCommand("JustifyFull");
    });
    var $btn10 = _createButton("缩进",function(){
        _iframeDocument.execCommand("Indent");
    });
    var $btn11 = _createButton("缩退",function(){
        _iframeDocument.execCommand("outdent");
    });
    var $btn12 = _createButton("清除格式",function(){
        _iframeDocument.execCommand("RemoveFormat");
    });
    var $btn13 = _createButton("选中所有",function(){
        _iframeDocument.execCommand("SelectAll");
    });
    var $btn14 = _createButton("删除线",function(){
        _iframeDocument.execCommand("StrikeThrough");
    });
    var $btn15 = _createButton("下标",function(){
        _iframeDocument.execCommand("Subscript");
    });
    var $btn16 = _createButton("上标",function(){
        _iframeDocument.execCommand("Superscript");
    });
    var $btn17 = _createButton("链接",function(){
        var link = _iframeWindow.prompt("请输入链接.");
        _iframeDocument.execCommand("CreateLink",false,link);
    });
    var $btn18 = _createButton("取消链接",function(){
        _iframeDocument.execCommand("Unlink");
    });
    var $btn19 = _createButton("字体颜色",function(){
        var color = _iframeWindow.prompt("请输入颜色.");
        _iframeDocument.execCommand("ForeColor",false,color);
    });
    var $btn20 = _createButton("背景色",function(){
        var color = _iframeWindow.prompt("请输入颜色.");
        _iframeDocument.execCommand("BackColor",false,color);
    });
    var $btn21 = _createButton("插入图片",function(){
        var url = _iframeWindow.prompt("请输入图片链接地址.");
        _iframeDocument.execCommand("InsertImage",false,url);
    });

    $editorCtrl.append($btn0,$btn1,$btn2,
        $btn3,$btn4,$btn5,
        $btn6,$btn7,$btn8,
        $btn9,$btn10,$btn11,
        $btn12,$btn13,$btn14,
        $btn15,$btn16,$btn17,
        $btn18,$btn19,$btn20,$btn21
    );

    $("#workArea").append($editorCtrl).append($editor);
    $editor.focus();
}

function _createButton(title,callback){
    /*var $btn = $("<div><a href='javascript:void(\""+title+"\");'>"+title+"</a></div>").addClass("button");*/
    var $btn = $("<input value='"+title+"' type='button' >").addClass("editor-ctrl-button");
    $btn.click(callback);
    return $btn;
}

function dblclickSVGCode(d3g) {
    var d3gRect = getGroupRect(d3g);
    var d3shape = d3g.select(".shape");

    // 记录原文本
    var d3Code = d3g.select("foreignObject").select("code");
    var $code = $(d3Code.node());
    var oldTextVal = $code.text();

    // 大小与位置
    var editorWidth = d3gRect.width;
    var editorHeight = d3gRect.height;
    var editorLeft = parseFloat(d3gRect.x);
    var editorTop = parseFloat(d3gRect.y);

    var $optionJava = $("<option>java</option>");
    var $optionCpp = $("<option>cpp</option>");
    var $optionPython = $("<option>cpp</option>");
    var $optionSql = $("<option>sql</option>");
    var $optionJavascript = $("<option>javascript</option>");
    var $optionHtml = $("<option>html</option>");
    var $optionCss = $("<option>css</option>");
    var $select = $("<select class='editor-ctrl-button'></select>");

    $select.append($optionJava)
    .append($optionCpp)
    .append($optionPython)
    .append($optionSql)
    .append($optionJavascript)
    .append($optionHtml)
    .append($optionCss);

    var $editorCtrl = $("<div class='editorCtrl'></div>")
        .css("position","absolute")
        .css("min-width","60px")
        .css("width", (editorWidth - 3) + "px")
        // .css("height", "30px")
        .css("left", editorLeft + "px")
        .css("top", (editorTop - 30) + "px")
        .css("background-color","white")
        .css("border","1px solid grey")
        .css("padding-bottom","3px")
        .css("padding-top","2px")
        .css("padding-left","2px")
        ;
    var $label = $("<span>代码：</span>");
    $editorCtrl.append($label).append($select);
    
    var $codeTextarea = $("<textarea></textarea>")
        .val(oldTextVal)
        .css("position","absolute")
        .css("min-width","60px")
        .css("width", editorWidth + "px")
        .css("height",editorHeight + "px")
        .css("left", editorLeft + "px")
        .css("top", editorTop + "px")
        .keydown(function(event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e.keyCode == 27) {
                // esc
                $textarea.remove();
            }
        })
        .blur(function(e) {
            if(e.relatedTarget && e.relatedTarget.classList.length >0 &&e.relatedTarget.classList[0] == "editor-ctrl-button") {
                return ;
            }

            // 获取select的内容
            var lang = $select.val();
            var newTextVal = $codeTextarea.val();
            if(oldTextVal != newTextVal) {
                $code.attr("class", lang);
                $code.text(newTextVal);
                hljs.highlightBlock($code[0]);
                rePosLinkLine(d3g);
            }

            $codeTextarea.remove();
            $editorCtrl.remove();
        })
    ;

    $("#workArea").append($editorCtrl).append($codeTextarea);
    $codeTextarea.focus();
}