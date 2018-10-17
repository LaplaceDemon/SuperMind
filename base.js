function getGroupRect(d3g) {
    var d3node = d3g.node();
    var d3gBBox = d3node.getBBox();

    return {
        "x":parseFloat(d3node.dataset.x),
        "y":parseFloat(d3node.dataset.y),
        "width":d3gBBox.width,
        "height":d3gBBox.height
    }
}

function d3SvgMove(d3g,x,y) {
    d3g.attr("transform", "translate(" + x + "," + y + ")").attr("data-x",x).attr("data-y",y);    
}

function d3SvgSetColor(svg, d3g, color) {
    var borderColor;
    var textColor;
    if(color == "white") {
        borderColor = "black";
    } else {
        borderColor = color;
    }
    
    if(svg.node().dataset.backgroundColor == "black") {
        textColor = "white";
    } else {
        textColor = "black";
    }

    d3g.select(".shape").attr("fill",color).attr("stroke",borderColor);
    d3g.select("text").attr("fill",textColor);
}

// 重置文本与图形的大小
function resizeTextShape(d3g,d3shape,d3text) {
    // 最小的大小
    var minRectWidth = 70;
    var minRectHeight = 50;

    var shapeSVG =  d3shape.node();
    var textRect = d3text.node().getBBox();
    var shapeRect0 = shapeSVG.getBBox();

    // 原大小
    var oldShapeWidth = shapeRect0.width;
    var oldShapeHeight = shapeRect0.height;

    // 预计大小
    var newShapeWidth = textRect.width * 1.2;
    var newShapeHeight = textRect.height * 1.2;

    // 实际大小
    var realShapeWidth = oldShapeWidth;
    var realShapeHeight = oldShapeHeight;
    
    // 设置宽
    if(oldShapeWidth < newShapeWidth) {
        realShapeWidth = newShapeWidth;
    }
    if(realShapeWidth < minRectWidth) {
        realShapeWidth = minRectWidth
    }

    // 设置高
    if(oldShapeHeight < newShapeHeight) {
        realShapeHeight = newShapeHeight;
    }
    if(realShapeHeight < minRectHeight) {
        realShapeHeight = minRectHeight;
    }

    if(d3g.attr("class") == "RectNode") {
        // 矩形
        d3shape.attr("width", realShapeWidth);
        d3shape.attr("height", realShapeHeight);
    } else if (d3g.attr("class") == "EllipseNode") {
        // 椭圆
        d3shape
        .attr("cx", realShapeWidth/2).attr("cy", realShapeHeight/2)
        .attr("rx", realShapeWidth/2).attr("ry", realShapeHeight/2);
    }

    // 文本的位置，始终在矩形中心
    d3text
        .attr("x", (realShapeWidth - textRect.width)/2 )
        .attr("y", (realShapeHeight)/2 + textRect.height / 3);


    if(d3g.node().dataset.selected && d3g.node().dataset.selected == "true") {
        moveChooseNodes(d3g);
    }
}

function parseTransform(translate) {
    var splitIndex = translate.indexOf(",");
    var left = translate.substr(10, splitIndex - 10 );
    var top = translate.substr(splitIndex + 1, translate.length - 2 - splitIndex);
    return {"left":left,"top":top};
}


// 重置文本位置
function resetTextPosition(d3g) {
    var d3gClass = d3g.attr("class");

    if(d3gClass == "RectNode" || d3gClass == "EllipseNode") {
        var d3GroupRect = getGroupRect(d3g);

        // 矩形大小
        var rectRectWidth = d3GroupRect.width;
        var rectRectHeight = d3GroupRect.height;
    
        // 文本
        var d3text = d3g.select("text");
        var textRect = d3text.node().getBBox();
    
        // 设置文本大小
        d3text
        .attr("x", (d3GroupRect.width - textRect.width)/2 )
        .attr("y", (d3GroupRect.height + textRect.height)/2 ); 
    }
}

function setSize(d3g,width,height) {
    var d3gClass = d3g.attr("class");
    if(d3gClass == "RectNode") {
        d3g.select("rect").attr("width",width).attr("height",height);
    } else if(d3gClass == "EllipseNode") {
        d3g.select("ellipse")
        .attr("cx", width/2).attr("cy", height/2)
        .attr("rx", width/2).attr("ry", height/2);
    } else if(d3gClass == "DivNode" || d3gClass == "CodeNode") {
        d3g.select("foreignObject").attr("width",width).attr("height",height);
        d3g.select("rect").attr("width",width).attr("height",height);
    }
}