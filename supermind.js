function clearSystemStatus(svg) {
    cancleChoose();
    linkLineSystem.mode = LinkLineMode.Nothing;
    svg.attr("cursor","Default");
}

window.onload = function () {
    var domWorkArea  = document.getElementById("workArea");

    var width = window.innerWidth - 15;	//画布的宽度
    var height = window.innerHeight - domWorkArea.offsetTop - 10;	//画布的高度

    var domWorkArea  = document.getElementById("workArea");
    $(domWorkArea).css("width" , width).css("height" , height);

    // 窗口大小改变事件
    window.onresize = function() {
        var domWorkArea  = document.getElementById("workArea");
        var width = window.innerWidth - 15;	//画布的宽度
        var height = window.innerHeight - domWorkArea.offsetTop - 10;	//画布的高度

        var domWorkArea  = document.getElementById("workArea");
        $(domWorkArea).css("width" , width).css("height" , height);
    }

    var svg = d3.select(domWorkArea)			//选择文档中的body元素
                    .append("svg")				//添加一个svg元素
                    .attr("width", width-13)		//设定宽度
                    .attr("height", height-13)      //设定高度
                    ;
    // 要保存的属性
    svg.attr("data-lineMaxId",0);  
    svg.attr("data-groupMaxId",0);
    // 不需要保存的属性
    svg.datum({});

    var svgnode =  svg.node();
    svgnode.dataset.backgroundColor = "white";

    // 事件绑定
    svgnode.onmousemove = function(e) {
        var mx = e.layerX;
        var my = e.layerY;

        if(linkLineSystem.mode == LinkLineMode.ChooseOne) {
            var d3line = linkLineSystem.d3line;
            d3line.attr("x2",mx).attr("y2",my);
        }

        if(linkLineSystem.mode == LinkLineMode.ChooseOne || linkLineSystem.mode == LinkLineMode.StartChoose) {
            svg.attr("cursor","Crosshair");
        }
    };

    svgnode.oncontextmenu  = function(e) {
        if(linkLineSystem.mode == LinkLineMode.ChooseOne) {
            cancleChoose();
            // 取消线条
            cancleLinkLine();
            linkLineSystem.mode = LinkLineMode.StartChoose;
        }

        return false;
    };

    initSelectSVG(svg);

    // 键盘事件
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];

        // 按下 ESC
        if (e && e.keyCode == 27) {
            // 移除连线
            cancleLinkLine();
            linkLineSystem.mode = LinkLineMode.Nothing;
            svg.attr("cursor","Default");
        } else if (e && (e.keyCode == 46 || (e.keyCode == 8 && e.target.tagName == "BODY"))) {
            // 按下 delete
            if(linkLineSystem.mode == LinkLineMode.ChooseOne) {
                // 移除取消
                cancleChoose();

                // 删除连线
                if(selectedSVGList.length == 0) {
                    for(var i = 0;i<selectedLinkLineList.length;i++) {
                        removeLinkLine(selectedLinkLineList[i]);
                    }
                }

                // 取消连线
                cancleLinkLine();
                linkLineSystem.mode = LinkLineMode.StartChoose;
            } else if(linkLineSystem.mode == LinkLineMode.Nothing) {
                // 删除连线
                if(selectedSVGList.length == 0) {
                    for(var i = 0;i<selectedLinkLineList.length;i++) {
                        removeLinkLine(selectedLinkLineList[i]);
                    }
                }

                // 删除选择的图形 
                for(var i = 0; i < selectedSVGList.length; i++) {
                    var d3g = selectedSVGList[i];
                    removeChoose(d3g);
                }
                
                // 取消选择
                cancleChoose();
            }
        } else if(e && e.keyCode == 67 && e.ctrlKey) {
            console.log("Ctrl + C");
            // 赋值选择的组件
            markCopySVG();
        } else if(e && e.keyCode == 86 && e.ctrlKey) {
            console.log("Ctrl + V");
            copyToSVG(svg);
        } else if(e && e.keyCode == 83 && e.ctrlKey) {
            
            function download(filename,content,contentType) {
                if (!contentType) contentType = 'application/octet-stream';
                var a = document.createElement('a');
                var blob = new Blob([content], { 'type': contentType });
                a.href = window.URL.createObjectURL(blob);
                a.download = filename;
                a.click();
            };

            console.log("Ctrl + S");
            
            // console.log(svgnode.outerHTML);
            download("download.svg",svgnode.outerHTML);
        }

        console.log(e.keyCode);
    };

    var d3lineGroups = svgCreateLineGroups(svg);
    
    // 添加属性。
    svg.datum().d3lineGroups = d3lineGroups;

    // 创建自定义元素
    var d3defs = svg.append("defs");

    // 创建箭头
    createAllowMarker(d3defs);

    insertRect.onclick = function() {
        clearSystemStatus(svg);
        svgAppendRect(svg);
    }

    insertEllipse.onclick = function() {
        clearSystemStatus(svg);
        svgAppendEllipse(svg);
    }

    insertP.onclick = function() {
        clearSystemStatus(svg);
        svgAppendDiv(svg);
    }

    insertCode.onclick = function() {
        clearSystemStatus(svg);
        svgAppendCode(svg);
    }

    linkArrowObject.onclick = function() {
        cancleLinkLine();
        linkLineSystem.mode = LinkLineMode.StartChoose;
    }

    alignmentCenterHorizontalBtn.onclick = function() {
        alignmentCenterHorizontal(selectedSVGList);
    }

    alignmentEdgeUpperBtn.onclick = function() {
        alignmentEdgeUpper(selectedSVGList);
    }

    alignmentEdgeLowerBtn.onclick = function() {
        alignmentEdgeLower(selectedSVGList);
    }

    alignmentEdgeLeftBtn.onclick = function() {
        alignmentEdgeLeft(selectedSVGList);
    }

    alignmentEdgeRightBtn.onclick = function() {
        alignmentEdgeRight(selectedSVGList);
    }

    alignmentCenterVerticalBtn.onclick = function() {
        alignmentCenterVertical(selectedSVGList);
    }

    color0.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            d3SvgSetColor(svg, selectedSVGList[i],"rgb(115, 161, 191)");
        }
    }

    color1.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            d3SvgSetColor(svg, selectedSVGList[i],"rgb(115, 191, 118)");
        }
    }

    color2.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            d3SvgSetColor(svg, selectedSVGList[i],"rgb(252, 131, 131)");
        }
    }

    color3.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            d3SvgSetColor(svg, selectedSVGList[i],"black");
        }
    }

    color4.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            d3SvgSetColor(svg, selectedSVGList[i],"white");
        }
    }

    backgroundColorBlack.onclick = function() {
        $("svg").css("background-color","rgb(30,30,30)");
        svg.node().dataset.backgroundColor = "black";
        svg.selectAll("text").attr("fill","white");
    }

    backgroundColorWhite.onclick = function() {
        $("svg").css("background-color","white");
        svg.node().dataset.backgroundColor = "white";
        svg.selectAll("text").attr("fill","black");
    }

    bottomLevel.onclick = function() {
        cutToFirst(svg, selectedSVGList);
    }

    // SVG 画布扩展宽度
    exportLeft.onclick = function() {
        var w = parseFloat(svg.attr("width"));
        svg.attr("width", w + 100);
    }

    // SVG 画布扩展高度
    exportDown.onclick = function() {
        var h = parseFloat(svg.attr("height"));
        svg.attr("height", h + 100);
    }

    equalHeight.onclick = function() {
        if(selectedSVGList.length >= 2) {
            var baseBox = getGroupRect(selectedSVGList[0]);
            for(var i = 1;i<selectedSVGList.length;i++) {
                var d3g = selectedSVGList[i];
                var box = getGroupRect(d3g);
                setSize(d3g, box.width, baseBox.height);
                moveChooseNodes(d3g);
                rePosLinkLine(d3g);
                resetTextPosition(d3g);
            }
        }
    }

    equalWidth.onclick = function() {
        if(selectedSVGList.length >= 2) {
            var baseBox = getGroupRect(selectedSVGList[0]);
            for(var i = 1;i<selectedSVGList.length;i++) {
                var d3g = selectedSVGList[i];
                var box = getGroupRect(d3g);
                setSize(d3g, baseBox.width, box.height);
                moveChooseNodes(d3g);
                rePosLinkLine(d3g);
                resetTextPosition(d3g);
            }
        }
    }

    equalWidthToHeight.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            var d3g = selectedSVGList[i];
            var box = getGroupRect(d3g);
            setSize(d3g, box.height, box.height);
            rePosLinkLine(d3g);
            resetTextPosition(d3g);
            moveChooseNodes(d3g);
        }
    }

    equalHeightToWidth.onclick = function() {
        for(var i = 0;i<selectedSVGList.length;i++) {
            var d3g = selectedSVGList[i];
            var box = getGroupRect(d3g);
            setSize(d3g, box.width, box.width);
            rePosLinkLine(d3g);
            resetTextPosition(d3g);
            moveChooseNodes(d3g);
        }
    }
    
}