function setPostionLinkLineStartPoint(d3line,d3gStart,d3gEnd) {
    var d3gStartRect = getGroupRect(d3gStart);
    var d3gEndRect = getGroupRect(d3gEnd);
    var X = d3gStartRect.x;
    var Y = d3gStartRect.y;
    var W = d3gStartRect.width;
    var H = d3gStartRect.height;

    var linex1 =  d3gStartRect.x + d3gStartRect.width/2;
    var liney1 =  d3gStartRect.y + d3gStartRect.height/2;
    var linex2 = d3gEndRect.x + d3gEndRect.width/2;
    var liney2 = d3gEndRect.y + d3gEndRect.height/2;

    var lw = linex2 - linex1;
    var lh = liney2 - liney1;
    
    var dx = 0;
    var dy = 0;

    var classType = d3gStart.attr("class");
    if(classType == "RectNode" || classType == "DivNode" || classType == "CodeNode") {
        if(lh == 0 && lw != 0) {
            dx = lw>0 ? -W/2 : W/2;
            dy = 0;
        } else if(lh != 0 && lw == 0) {
            dx = 0;
            dy = lh > 0? -H/2 : H/2;
        } else if(lh == 0 && lw == 0) {
            dx = 0;
            dy = 0;
        } else {
            var alpha = lh/lw;
            if(Math.abs(alpha) > H/W) {
                dy = lh > 0? -H/2 : H/2;
                dx = dy * lw / lh;
            } else {
                dx = lw>0?-W/2:W/2;
                dy = dx * alpha;
            }
        }

        var center = {"x": (X + W/2) - dx,"y" : (Y + H/2) - dy};
        d3line.attr("x1",center.x).attr("y1",center.y);
    } else if(classType == "EllipseNode") {
        if(lh == 0 && lw != 0) {
            dx = lw>0 ? -W/2 : W/2;
            dy = 0;
        } else if(lh != 0 && lw == 0) {
            dx = 0;
            dy = lh > 0? -H/2 : H/2;
        } else if(lh == 0 && lw == 0) {
            dx = 0;
            dy = 0;
        } else {
            var cx = W/2;
            var cy = H/2;
            // 解方程求得：
            var alpha = lh/lw;
            dx = -Math.sqrt(cx*cx*cy*cy/(cy*cy + cx*cx*alpha*alpha));
            dy = alpha * dx;

            if(lw < 0) {
                dx = -dx;
                dy = -dy;
            }
        }
        
        var p = {"x": (X + W/2) - dx,"y" : (Y + H/2) - dy};
        d3line.attr("x1",p.x).attr("y1",p.y);
    }

}

function setPostionLinkLineEndPoint(d3line,d3gEnd,d3gStart) {
    var d3gStartRect = getGroupRect(d3gStart);
    var d3gEndRect = getGroupRect(d3gEnd);

    var X = d3gEndRect.x;
    var Y = d3gEndRect.y;
    var W = d3gEndRect.width;
    var H = d3gEndRect.height;
    var linex1 =  d3gStartRect.x + d3gStartRect.width/2;
    var liney1 =  d3gStartRect.y + d3gStartRect.height/2;
    var linex2 = d3gEndRect.x + d3gEndRect.width/2;
    var liney2 = d3gEndRect.y + d3gEndRect.height/2;

    var lw = linex2 - linex1;
    var lh = liney2 - liney1;

    var dx = 0;
    var dy = 0;

    var classType = d3gEnd.attr("class");
    if(classType == "RectNode" || classType == "DivNode" || classType == "CodeNode") {
        if(lh == 0 && lw != 0) {
            dx = lw>0 ? -W/2 : W/2;
            dy = 0;
        } else if(lh != 0 && lw == 0) {
            dx = 0;
            dy = lh > 0? -H/2 : H/2;
        } else if(lh == 0 && lw == 0) {
            dx = 0;
            dy = 0;
        } else {
            var alpha = lh/lw;
            if(Math.abs(alpha) > H/W) {
                dy = lh > 0? -H/2 : H/2;
                dx = dy * lw / lh;
            } else {
                dx = lw>0?-W/2:W/2;
                dy = dx * alpha;
            }
        }
    
        var center = {"x": (X + W/2) + dx,"y" : (Y + H/2) + dy};
        d3line.attr("x2",center.x).attr("y2",center.y);
    } else if(classType == "EllipseNode") {
        if(lh == 0 && lw != 0) {
            dx = lw>0 ? W/2 : -W/2;
            dy = 0;
        } else if(lh != 0 && lw == 0) {
            dx = 0;
            dy = lh > 0? H/2 : -H/2;
        } else if(lh == 0 && lw == 0) {
            dx = 0;
            dy = 0;
        } else {
            var cx = W/2;
            var cy = H/2;
            // 解方程求得：
            var alpha = lh/lw;
            dx = Math.sqrt(cx*cx*cy*cy/(cy*cy + cx*cx*alpha*alpha));
            dy = alpha * dx;

            if(lw < 0) {
                dx = -dx;
                dy = -dy;
            }
        }
        
        var center = {"x": (X + W/2) - dx,"y" : (Y + H/2) - dy};
        d3line.attr("x2",center.x).attr("y2",center.y);
    }
}

function setPostionLinkLineStartPointForChooseOne(d3line, d3gStart) {
    var d3gStartRect = getGroupRect(d3gStart);

    var X = d3gStartRect.x;
    var Y = d3gStartRect.y;
    var W = d3gStartRect.width;
    var H = d3gStartRect.height;

    var center = {"x": (X + W/2),"y" : (Y + H/2)};
    d3line.attr("x1",center.x).attr("y1",center.y).attr("x2",center.x).attr("y2",center.y);
}

function rePosStartLinkLine(d3line,d3StartGroup) {
    var endId = d3line.node().dataset.bindEnd;
    if(endId) {
        var d3EndGroup = d3.select("#"+endId);
        setPostionLinkLineStartPoint(d3line,d3StartGroup,d3EndGroup);
        setPostionLinkLineEndPoint(d3line,d3EndGroup,d3StartGroup);
    }
}

function rePosEndLinkLine(d3line,d3EndGroup) {
    var startId = d3line.node().dataset.bindStart;
    if(startId) {
        var d3StartGroup = d3.select("#"+startId);
        setPostionLinkLineEndPoint(d3line,d3EndGroup,d3StartGroup);
        setPostionLinkLineStartPoint(d3line,d3StartGroup,d3EndGroup);
    }
}

function rePosLinkLine(d3g) {
    var lineStartStr = d3g.node().dataset.lineStart;
    var lineEndStr = d3g.node().dataset.lineEnd;

    if(lineStartStr && lineStartStr.length > 0) {
        var startlines = lineStartStr.split(",");
        for(var i = 0;i<startlines.length;i++) {
            var d3line = d3.select("#" + startlines[i]);
            rePosStartLinkLine(d3line,d3g);
        }
    }

    if(lineEndStr && lineEndStr.length > 0) {
        var endlines = lineEndStr.split(",");
        for(var i = 0;i<endlines.length;i++) {
            var d3line = d3.select("#" + endlines[i]);
            rePosEndLinkLine(d3line,d3g);
        }
    }
}


var LinkLineMode = {"Nothing":0,"StartChoose":1,"ChooseOne":2,"ChooseTwo":3};
var linkLineSystem = {
    "mode":LinkLineMode.Nothing,
    "d3line":null
};

function cancleLinkLine() {
    // 取消线条
    if(linkLineSystem.mode == LinkLineMode.ChooseOne) {
        if(linkLineSystem.d3line) {
            linkLineSystem.d3line.remove();
            linkLineSystem.d3line = null;
        }
    }
}

function removeLinkLine(d3line) {
    var lineId = d3line.attr("id");
    var startId = d3line.node().dataset.bindStart;
    var lineStartIdStr = d3.select("#" + startId).node().dataset.lineStart;
    var arr = lineStartIdStr.split(",");
    var newArr = [];
    for(var i = 0;i<arr.length;i++) {
        if(arr[i] != lineId) {
            newArr.push(arr[i]);
        }
    }
    d3.select("#" + startId).node().dataset.lineStart = newArr.join(",");

    var endId = d3line.node().dataset.bindEnd;
    var lineEndIdStr = d3.select("#" + endId).node().dataset.lineEnd;
    var arr = lineEndIdStr.split(",");
    var newArr = [];
    for(var i = 0;i<arr.length;i++) {
        if(arr[i] != lineId) {
            newArr.push(arr[i]);
        }
    }
    d3.select("#" + endId).node().dataset.lineEnd = newArr.join(",");
    d3line.remove();
}

function svgCreateLineGroups(svg) {
    var lineGroups = svg.append("g").attr("id","lineGroups");
    return lineGroups;
}

// 添加线条
function svgAppendLinkLine(svg, d3lineGroups, d3StartGroup) {
    var d3line = d3lineGroups.append("line")
            .attr("x1",0).attr("y1",0).attr("x2",0).attr("y2",0)
            .attr("stroke","grey").attr("stroke-width",3)
            .attr("marker-end","url(#arrow)")
            .attr("cursor","pointer");

    var lineMaxId = svg.node().dataset.lineMaxId;
    var newlineMaxId = parseInt(lineMaxId) + 1;
    d3line.attr("id" , "l_" + newlineMaxId);
    svg.attr("data-lineMaxId", newlineMaxId);

    if(d3StartGroup) {
        // 固定线条的开始点
        var startGroupId = d3StartGroup.attr("id");
        d3line.attr("data-bindStart",startGroupId);
        setPostionLinkLineStartPointForChooseOne(d3line, d3StartGroup);
    }

    return d3line;
}

function linkLine(d3line, d3EndGroup) {
    var startGroupId = d3line.node().dataset.bindStart;
    var endGroupId = d3EndGroup.attr("id");

    // 不允许线条的头尾相同
    if(startGroupId == endGroupId) {
        return false;
    }

    var lineId = d3line.attr("id");

    // 通过各种Id进行节点关联
    d3line.attr("data-bindEnd",endGroupId);
    var d3StartGroup = d3.select("#"+startGroupId);
    var lineStartStr = d3StartGroup.node().dataset.lineStart;
    if(lineStartStr && lineStartStr.length > 0) {
        d3StartGroup.node().dataset.lineStart += ("," + lineId);
    } else {
        d3StartGroup.node().dataset.lineStart = lineId;
    }

    var lineEndStr = d3EndGroup.node().dataset.lineEnd;
    if(lineEndStr && lineEndStr.length > 0) {
        d3EndGroup.node().dataset.lineEnd += ("," + lineId);
    } else {
        d3EndGroup.node().dataset.lineEnd = lineId;
    }

    // 设置线条位置
    rePosEndLinkLine(d3line, d3EndGroup);

    // 绑定事件,效果都不好
    /*
    d3line.on("click",function() {
        console.log("line click");
        d3line.attr("stroke","red");
        d3.event.stopPropagation();
        return false;
    });
    */

    d3line.node().onclick = function(e) {
        createSelectLineSubSystem(d3line);
        e.stopPropagation();
        return false;
    }

    return true;
}


function createAllowMarker(d3defs) {
     //箭头
     var d3marker= d3defs.append("marker")
     .attr("id", "arrow")
     //.attr("markerUnits","strokeWidth")  //设置为strokeWidth箭头会随着线的粗细发生变化
     .attr("markerUnits","userSpaceOnUse")
     .attr("viewBox", "0 -5 10 10")  //坐标系的区域
     .attr("refX", 10)  //箭头坐标
     .attr("refY", 0)
     .attr("markerWidth", 12)  //标识的大小
     .attr("markerHeight", 12)
     .attr("orient", "auto")  //绘制方向，可设定为：auto（自动确认方向）和 角度值
     .attr("stroke-width",0)  //箭头宽度
     .append("path")
     .attr("d", "M0,-5L10,0L0,5")  //箭头的路径
     .attr('fill','gray');  //箭头颜色

     return d3marker;
}