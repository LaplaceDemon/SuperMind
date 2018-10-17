function svgAppendDiv(svg) {
    var d3g = svg.append("g").attr("transform","translate(0,0)")
                            .attr("data-x",0).attr("data-y",0)
                            .attr("cursor","pointer")
                            .attr("class","DivNode");

    // maxid
    var groupMaxId = svg.node().dataset.groupMaxId;
    var newGroupMaxId = parseInt(groupMaxId) + 1;
    d3g.attr("id" , "g_" + newGroupMaxId);
    svg.attr("data-groupMaxId", newGroupMaxId);
   
    // 添加foreignObject
    var d3ForeignObject = d3g.append("foreignObject");
    var domForeignObject = d3ForeignObject.node();
    var $ForeignObject = $(domForeignObject).css("overflow-y","auto");
    
    // 添加rect
    var d3Rect = d3g.append("rect")
        .attr("rx",3)
        .attr("ry",3)
        .attr("fill-opacity",0.3)
        .attr("stroke-width",3)
        .attr("cursor","pointer")
        .attr("class","shape");

    // 添加div
    var $div = $("<div></div>")
    .css("margin-left","5px").css("margin-top","5px")
    ;
    
    $ForeignObject.append($div);
    
    // 把所有附加属性都绑定到datum上，否则事件响应有问题。
    d3g.datum({});

    // 设置颜色
    d3SvgSetColor(svg, d3g, "white");

    // 设置大小
    d3Rect.attr("width",300).attr("height",200);
    d3ForeignObject.attr("width",300).attr("height",200);

    // resizeTextShape(d3g,rect,d3text);
    bindEventHandle(d3g,svg);
    bindDragSVGHandler(svg, d3g);

    $(d3Rect.node()).mousewheel(function(event, delta) {
        var dir = delta > 0 ? 'Up' : 'Down';
        if (dir == 'Up') {
            console.log('向上滚动');
            domForeignObject.scrollTop -= 20;
        } else {
            console.log('向下滚动');
            domForeignObject.scrollTop += 20;
        }
        return false;

    });
    
    return d3g;
}