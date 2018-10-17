var copyD3SVGList = [];

// 标记将要拷贝的SVG
function markCopySVG() {
    // 清空
    copyD3SVGList = [];
    for(var i = 0;i<selectedSVGList.length;i++) {
        copyD3SVGList.push(selectedSVGList[i]);
    }
}

// 赋值，并且拷贝到SVG中去
function copyToSVG(svg) {
    // 取消原来的选择，选择新的粘贴
    cancleChoose();

    // 复制组件
    for(var i = 0; i<copyD3SVGList.length; i++) {
        var d3g0 = copyD3SVGList[i];
        var domD3g0 = d3g0.node();
        // 赋值DOM
        var cloneNewDom = domD3g0.cloneNode(true);
        var cloneNewD3G = d3.select(cloneNewDom);

        // 新id
        var groupMaxId = svg.node().dataset.groupMaxId;
        var newGroupMaxId = parseInt(groupMaxId) + 1;
        cloneNewD3G.attr("id" , "g_" + newGroupMaxId);
        svg.attr("data-groupMaxId", newGroupMaxId);

        // 不需要的属性，不要复制
        cloneNewD3G.attr("data-line-start","").attr("data-line-end","");

        // 位置偏移
        d3SvgMove(cloneNewD3G, parseFloat(cloneNewDom.dataset.x) + 30, parseFloat(cloneNewDom.dataset.y) + 30);

        // 附加属性
        cloneNewD3G.datum({choosingNodes:[]});

        // 绑定事件
        bindEventHandle(cloneNewD3G, svg);
        bindDragSVGHandler(svg, cloneNewD3G);

        // 添加DOM
        svg.node().appendChild(cloneNewDom);
        createSelectSubSystem(svg, cloneNewD3G);
    }

    copyD3SVGList = [];
}

function cutToFirst(svg, d3SvgList) {
    var domDefsNext = svg.select("defs").node().nextSibling;

    var newSelectedSVGList = [];
    for(var i = 0; i < d3SvgList.length; i++) {
        var d3g0 = d3SvgList[i];
        var domD3g0 = d3g0.node();
        // 赋值DOM
        var cloneNewDom = domD3g0.cloneNode(true);
        var cloneNewD3G = d3.select(cloneNewDom);

        // 附加属性的复制
        cloneNewD3G.datum(d3g0.datum());

        // 绑定事件
        bindEventHandle(cloneNewD3G, svg);
        bindDragSVGHandler(svg, cloneNewD3G);

        

        // svg.node().appendChild(cloneNewDom);
        // createSelectSubSystem(svg, cloneNewD3G);

        // 添加DOM
        svg.node().insertBefore(cloneNewDom, domDefsNext);
        newSelectedSVGList.push(cloneNewD3G);
    }

    // 新的选择项
    selectedSVGList = newSelectedSVGList;
    // 删除原来的元素
    for(var i = 0; i < d3SvgList.length; i++) {
        d3SvgList[i].remove();
    }
}

function cutToLast() {
    
}