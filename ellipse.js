function svgAppendEllipse(svg) {
    var d3g = svg.append("g").attr("transform","translate(0,0)")
                            .attr("data-x",0).attr("data-y",0)
                            .attr("cursor","pointer")
                            .attr("class","EllipseNode");
    // maxid
    var groupMaxId = svg.node().dataset.groupMaxId;
    var newGroupMaxId = parseInt(groupMaxId) + 1;
    d3g.attr("id" , "g_" + newGroupMaxId);
    svg.attr("data-groupMaxId", newGroupMaxId);
    // 将附加属性都绑定在datum
    d3g.datum({});

    var ellipse = d3g.append("ellipse")
        // .attr("fill","rgb(115, 161, 191)")
        .attr("fill-opacity",0.3)
        // .attr("stroke","rgb(115, 161, 191)")
        .attr("stroke-width",3)
        .attr("cursor","pointer")
        .attr("class","shape");

    var d3text = d3g.append("text").text("").attr("cursor","pointer")
    // .attr("fill","black")
    ;
    d3SvgSetColor(svg, d3g, "rgb(115, 161, 191)");
    resizeTextShape(d3g, ellipse, d3text);
    bindEventHandle(d3g, svg);
    bindDragSVGHandler(svg, d3g);
    return d3g;
}