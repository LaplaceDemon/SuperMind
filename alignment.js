function alignmentEdgeUpper(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            d3SvgMove(d3SVGList[i], svgRect.x , baseRect.y);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

function alignmentEdgeLower(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        var baseLowerEdgeY = baseRect.y + baseRect.height;

        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            var y = baseLowerEdgeY - svgRect.height;
            d3SvgMove(d3SVGList[i], svgRect.x , y);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

function alignmentCenterHorizontal(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        var baseCenterY = baseRect.y + baseRect.height/2;
        // var baseX = baseRect.x + baseRect.width/2;

        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            var svgCenterY = baseCenterY - svgRect.height/2;
            d3SvgMove(d3SVGList[i], svgRect.x , svgCenterY);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

function alignmentCenterVertical(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        // var baseCenterY = baseRect.y + baseRect.height/2;
        var baseCenterX = baseRect.x + baseRect.width/2;

        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            var svgCenterX = baseCenterX - svgRect.width/2;
            d3SvgMove(d3SVGList[i], svgCenterX , svgRect.y);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

function alignmentEdgeLeft(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        // var baseCenterY = baseRect.y + baseRect.height/2;
        // var baseCenterX = baseRect.x + baseRect.width/2;

        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            // var svgCenterY = baseCenterY - svgRect.height/2;
            d3SvgMove(d3SVGList[i], baseRect.x, svgRect.y);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

function alignmentEdgeRight(d3SVGList) {
    if(d3SVGList.length >= 2) {
        // 获取第一个元素的位置
        var baseRect = getGroupRect(d3SVGList[0]);
        var baseRightEdgeX = baseRect.x + baseRect.width;

        for(var i = 1; i < d3SVGList.length; ++i) {
            var svgRect = getGroupRect(d3SVGList[i]);
            var x = baseRightEdgeX - svgRect.width;
            d3SvgMove(d3SVGList[i], x , svgRect.y);
            rePosLinkLine(d3SVGList[i]);
            moveChooseNodes(d3SVGList[i]);
        }
    }
}

