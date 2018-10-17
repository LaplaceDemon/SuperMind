var choosingSVG = null;

// 被选择的连线
var selectedLinkLineList  = [];
// 被选择的SVG集合。
var selectedSVGList = [];

// 选择显示点，临时变量
var choosingPointDeltaX = 0.0;
var choosingPointDeltaY = 0.0;

var DragSize = 8;

function bindDragPointHandler(d3DragPoint) {
    var choosingPointDragHandler = d3.drag()
        .on("start", function () {
            // 对选中的物体为拖拽点，物体添加选中事件
            // 拖拽点
            choosingPointDeltaX = parseInt(d3DragPoint.node().dataset.x) - d3.event.x;
            choosingPointDeltaY = parseInt(d3DragPoint.node().dataset.y) - d3.event.y;
        })
        .on("drag", function () {
            var X = (d3.event.x + choosingPointDeltaX);
            var Y = (d3.event.y + choosingPointDeltaY);
            
            // 拖拽点，产生变形
            d3DragPoint.attr("x", X)
                    .attr("y", Y)
                    .attr("data-x",X)
                    .attr("data-y",Y);

            var controlSVG = d3DragPoint.controlSVG;

            if(d3DragPoint.node().dataset.index == 0) {
                var newChoosingSVGWidth = getGroupRect(controlSVG.datum().choosingNodes[2]).x - getGroupRect(controlSVG.datum().choosingNodes[0]).x - DragSize;
                var newChoosingSVGHeight = getGroupRect(controlSVG.datum().choosingNodes[2]).y - getGroupRect(controlSVG.datum().choosingNodes[0]).y - DragSize;

                controlSVG.attr("transform", "translate(" + (X+DragSize) + "," + (Y+DragSize) + ")").attr("data-x",X+DragSize).attr("data-y",Y+DragSize);
            } else if(d3DragPoint.node().dataset.index == 1) {
                var newChoosingSVGWidth = getGroupRect(controlSVG.datum().choosingNodes[1]).x - getGroupRect(controlSVG.datum().choosingNodes[3]).x - DragSize;
                var newChoosingSVGHeight = getGroupRect(controlSVG.datum().choosingNodes[3]).y - getGroupRect(controlSVG.datum().choosingNodes[1]).y - DragSize;
                var chooseSVGRect = getGroupRect(controlSVG);

                controlSVG.attr("transform", "translate(" + chooseSVGRect.x + "," + (Y+DragSize) + ")").attr("data-y",Y+DragSize);
            } else if(d3DragPoint.node().dataset.index == 2) {
                var newChoosingSVGWidth = getGroupRect(controlSVG.datum().choosingNodes[2]).x - getGroupRect(controlSVG.datum().choosingNodes[0]).x - DragSize;
                var newChoosingSVGHeight = getGroupRect(controlSVG.datum().choosingNodes[2]).y - getGroupRect(controlSVG.datum().choosingNodes[0]).y - DragSize;

            } else if(d3DragPoint.node().dataset.index == 3) {
                var newChoosingSVGWidth = getGroupRect(controlSVG.datum().choosingNodes[1]).x - getGroupRect(controlSVG.datum().choosingNodes[3]).x - DragSize;
                var newChoosingSVGHeight = getGroupRect(controlSVG.datum().choosingNodes[3]).y - getGroupRect(controlSVG.datum().choosingNodes[1]).y - DragSize;
                var chooseSVGRect = getGroupRect(controlSVG);

                controlSVG.attr("transform", "translate(" + (X+DragSize) + "," + (chooseSVGRect.y) + ")").attr("data-x",X+DragSize);                
            }

            setSize(controlSVG,newChoosingSVGWidth,newChoosingSVGHeight)
            // 被控制的SVG，移动四周的点。
            moveChooseNodes(controlSVG);

            rePosLinkLine(controlSVG);
            resetTextPosition(controlSVG);
        });

        choosingPointDragHandler(d3DragPoint);
}


// 对被选择的SVG创建选择子系统。
function createSelectSubSystem(svg, d3SelectedSVG) {
    console.log("选择",d3SelectedSVG);
    var d3Rect00 = svg.append("rect").attr('fill','gray').attr("width",DragSize).attr("height",DragSize).attr("cursor","nw-resize").attr("data-index",0).attr("x",-10).attr("y",-10);
    var d3Rect01 = svg.append("rect").attr('fill','gray').attr("width",DragSize).attr("height",DragSize).attr("cursor","ne-resize").attr("data-index",1).attr("x",-10).attr("y",-10);
    var d3Rect02 = svg.append("rect").attr('fill','gray').attr("width",DragSize).attr("height",DragSize).attr("cursor","se-resize").attr("data-index",2).attr("x",-10).attr("y",-10);
    var d3Rect03 = svg.append("rect").attr('fill','gray').attr("width",DragSize).attr("height",DragSize).attr("cursor","sw-resize").attr("data-index",3).attr("x",-10).attr("y",-10);

    // 绑定拖拽点
    if(d3SelectedSVG && !d3SelectedSVG.datum().choosingNodes) {
        // 附加属性
        d3SelectedSVG.datum().choosingNodes = [];
    }

    // 绑定或添加“已被选择”属性
    if(d3SelectedSVG) {
        // 表示已经被选择
        // 由于该属性必须被传递，所以必须绑定到属性元素上。
        d3SelectedSVG.node().dataset.selected = true;
    }
    
    // 0
    d3SelectedSVG.datum().choosingNodes.push(d3Rect00);
    bindDragPointHandler(d3Rect00);
    d3Rect00.controlSVG = d3SelectedSVG;
    // 1
    d3SelectedSVG.datum().choosingNodes.push(d3Rect01);
    bindDragPointHandler(d3Rect01);
    d3Rect01.controlSVG = d3SelectedSVG;
    // 2
    d3SelectedSVG.datum().choosingNodes.push(d3Rect02);
    bindDragPointHandler(d3Rect02);
    d3Rect02.controlSVG = d3SelectedSVG;
    // 3
    d3SelectedSVG.datum().choosingNodes.push(d3Rect03);
    bindDragPointHandler(d3Rect03);
    d3Rect03.controlSVG = d3SelectedSVG;

    // 把选择的SVG添加到已选择集合
    selectedSVGList.push(d3SelectedSVG);

    // 移动
    moveChooseNodes(d3SelectedSVG);
}

function createSelectLineSubSystem(d3line) {
    d3line.attr("stroke","red");
    selectedLinkLineList.push(d3line);
}

// 取消选择
function cancleChoose() {
    console.log("取消所有的选择");
    // choosingSVG = null;
    for(var i = 0;i<selectedSVGList.length;++i) {
        var d3SelectedSVG = selectedSVGList[i];
        d3SelectedSVG.node().dataset.selected = false;
        // 删除元素
        d3SelectedSVG.datum().choosingNodes[0].remove();
        d3SelectedSVG.datum().choosingNodes[1].remove();
        d3SelectedSVG.datum().choosingNodes[2].remove();
        d3SelectedSVG.datum().choosingNodes[3].remove();
        // 列表置空
        d3SelectedSVG.datum().choosingNodes = [];
    }
    // 列表置空
    selectedSVGList = [];

    // 线条颜色复原
    for(var i = 0; i<selectedLinkLineList.length; i++) {
        var selectedLinkLine = selectedLinkLineList[i];
        selectedLinkLine.attr("stroke","grey");
        selectedLinkLine = null;
    }
    // 线条列表置空
    selectedLinkLineList = [];
}

// 删除选中
function removeChoose(d3g) {
    // 获取所有线
    var lineStartStr = d3g.node().dataset.lineStart;
    var lineEndStr = d3g.node().dataset.lineEnd;

    // 线开始端
    if(lineStartStr && lineStartStr.length > 0) {
        var startlines = lineStartStr.split(",");
        for(var i = 0;i<startlines.length;i++) {
            // 要删除的线的Id
            var d3lineId = startlines[i];
            // 线
            var d3line = d3.select("#" + d3lineId);
            // 线结束端
            var endId = d3line.node().dataset.bindEnd;
            var endGroupSVG = d3.select("#" + endId).node();
            // 结束端所有线Id
            var lineIdArray = endGroupSVG.dataset.lineEnd.split(",");
            var newLineIdArray = [];
            for(var n = 0; n < lineIdArray.length; n++) {
                if(lineIdArray[n] != d3lineId) {
                    newLineIdArray.push(lineIdArray[n]);
                }
            }
           
            // 新的线条字符串
            if(newLineIdArray.length > 0) {
                // 新的线条字符串
                var lineIdArrayStr = newLineIdArray.join(",");
                endGroupSVG.dataset.lineEnd = lineIdArrayStr;
            } else {
                endGroupSVG.dataset.lineEnd = "";
            }

            // 删除线条
            d3line.remove();
        }
    }

    // 线结束端
    if(lineEndStr && lineEndStr.length > 0) {
        var endlines = lineEndStr.split(",");
        for(var i = 0;i<endlines.length;i++) {
            // 要删除的线的Id
            var d3lineId = endlines[i];        
            // 线
            var d3line = d3.select("#" + d3lineId);
            // 线开始端
            var startId = d3line.node().dataset.bindStart;
            var startGroupSVG = d3.select("#" + startId).node();
            // 结束端所有线Id
            var lineIdArray = startGroupSVG.dataset.lineStart.split(",");
            var newLineIdArray = [];
            for(var n = 0; n < lineIdArray.length; n++) {
                if(lineIdArray[n] != d3lineId) {
                    newLineIdArray.push(lineIdArray[n]);
                }
            }
            // 新的线条字符串
            if(newLineIdArray.length > 0) {
                var lineIdArrayStr = newLineIdArray.join(",");
                startGroupSVG.dataset.lineStart = lineIdArrayStr;
            } else {
                startGroupSVG.dataset.lineStart = "";
            }
            
            // 删除线条
            d3line.remove();
        }
    }

    // 删除选择的组件
    d3g.remove();
}

// 移动选中组件的四个拖拽点
function moveChooseNodes(controlSVG) {
    var groupBox = getGroupRect(controlSVG);

    controlSVG.datum().choosingNodes[0].attr("x",groupBox.x -DragSize).attr("y",groupBox.y - DragSize)
        .attr("data-x",groupBox.x - DragSize).attr("data-y",groupBox.y - DragSize);

    controlSVG.datum().choosingNodes[1].attr("x",groupBox.x + groupBox.width).attr("y", groupBox.y - DragSize)
        .attr("data-x",groupBox.x + groupBox.width).attr("data-y",groupBox.y - DragSize);

    controlSVG.datum().choosingNodes[2].attr("x",groupBox.x + groupBox.width).attr("y", groupBox.y + groupBox.height)
        .attr("data-x",groupBox.x + groupBox.width).attr("data-y",groupBox.y + groupBox.height);

    controlSVG.datum().choosingNodes[3].attr("x",groupBox.x - DragSize).attr("y",groupBox.y + groupBox.height)
        .attr("data-x",groupBox.x - DragSize).attr("data-y",groupBox.y + groupBox.height);
}

function pointInRect(point,rect) {
    if(rect.x < point.x && point.x < rect.x + rect.width && rect.y < point.y && point.y < rect.y + rect.height) {
        return true;
    }
    return false;
}

function getEventPos(event,svg) {
    if(event.type.indexOf("touch") >= 0) {
        var domsvg = svg.node();
        var domoffset = domsvg.getBoundingClientRect();
        return {
            "x":event.touches[0].clientX - domoffset.left,
            "y":event.touches[0].clientY- domoffset.top
        };
    } else {
        return {
            "x":event.offsetX,
            "y":event.offsetY
        };
    }
}

function initSelectSVG(svg) {
    // svg 拖动选择
    var choosingRectSVG = null;
    var choosingRectX;
    var choosingRectY;

    var svgDragHandle = d3.drag()
    .on("start", function() {
        // 取消显示选择矩形
        if(choosingRectSVG) {
            choosingRectSVG.remove();
        }
        
        // 判断是否需要出发全局鼠标选择
        var eventTarget = d3.event.sourceEvent.target;
        if(eventTarget.tagName != "svg" && eventTarget.classList.length > 0 && eventTarget.classList[0] == "shape") {
            console.log("不响应-svg-drag-start")
            return ;
        }
        console.log("svg-drag-start");

        // 取消所有已选择的选择
        cancleChoose();

        // choosingRectX = d3.event.x;
        // choosingRectY = d3.event.y;
        var p = getEventPos(d3.event.sourceEvent,svg);
        choosingRectX = p.x;
        choosingRectY = p.y;
        choosingRectSVG = svg.append("rect")
            .attr("fill","blue")
            .attr("fill-opacity",0.3)
            .attr("stroke","blue")
            .attr("stroke-width",1)
            .attr("x", choosingRectX).attr("y", choosingRectY);
    })
    .on("drag", function() {
        console.log("svg-drag-drag");
        var p = getEventPos(d3.event.sourceEvent,svg);
        var w = p.x - choosingRectX;
        var h = p.y - choosingRectY;
        var drawX;
        var drawY;

        if(w < 0) {
            drawX = choosingRectX + w;
            w = -w;
            choosingRectSVG.attr("x", drawX);
        }

        if(h < 0) {
            drawY = choosingRectY + h;
            h = -h;
            choosingRectSVG.attr("y", drawY);
        }

        choosingRectSVG.attr("width", w).attr("height", h);
    })
    .on("end", function() {
        var eventTarget = d3.event.sourceEvent.target;
        if(eventTarget.tagName != "svg" && eventTarget.classList.length > 0 && eventTarget.classList[0] == "shape") {
            console.log("不响应-svg-drag-end")
            return ;
        }
        console.log("svg-drag-end");
        // 开始选择
        var choosingRect = {
            "x" : parseFloat(choosingRectSVG.attr("x")),
            "y" : parseFloat(choosingRectSVG.attr("y")),
            "width" : parseFloat(choosingRectSVG.attr("width")),
            "height" : parseFloat(choosingRectSVG.attr("height"))
        };
        // 遍历所有的Rect,Div
        d3.selectAll("g.RectNode,g.DivNode,g.CodeNode").each(function(data, index) {
            var d3g = d3.select(this);
            var rect = getGroupRect(d3g);

            var flag0 = pointInRect({"x":rect.x, "y":rect.y}, choosingRect);
            var flag1 = pointInRect({"x":rect.x + rect.width, "y":rect.y}, choosingRect);
            var flag2 = pointInRect({"x":rect.x + rect.width, "y":rect.y + rect.height}, choosingRect);
            var flag3 = pointInRect({"x":rect.x, "y":rect.y + rect.height}, choosingRect);

            if(flag0 && flag1 && flag2 && flag3) {
                // 选中
                createSelectSubSystem(svg, d3g);
            }
        });
        // 遍历所有的Ellipse
        d3.selectAll("g.EllipseNode").each(function(data, index) {
            var d3g = d3.select(this);
            var rect = getGroupRect(d3g);

            var flag0 = pointInRect({"x":rect.x, "y":rect.y}, choosingRect);
            var flag1 = pointInRect({"x":rect.x + rect.width, "y":rect.y}, choosingRect);
            var flag2 = pointInRect({"x":rect.x + rect.width, "y":rect.y + rect.height}, choosingRect);
            var flag3 = pointInRect({"x":rect.x, "y":rect.y + rect.height}, choosingRect);

            if(flag0 && flag1 && flag2 && flag3) {
                // 选中
                createSelectSubSystem(svg, d3g);
            }
        });
        // 遍历所有的line
        d3.selectAll("g#lineGroups line").each(function(data, index) {
            var d3line = d3.select(this);

            var flag0 = pointInRect({"x":d3line.attr("x1"), "y":d3line.attr("y1")}, choosingRect);
            var flag1 = pointInRect({"x":d3line.attr("x2"), "y":d3line.attr("y2")}, choosingRect);

            if(flag0 && flag1) {
                // 选中
                createSelectLineSubSystem(d3line);
            }
        });

        // 取消显示选择矩形
        choosingRectSVG.remove();
    });

    // 绑定事件
    svgDragHandle(svg);
}
