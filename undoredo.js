function Queue(size) {
    var list = [];

    // 取出队列中的元素
    this.take = function() {
        return list.shift();
    }

    //向队列中添加数据
    this.push = function(data) {
        if (data==null) {
            return false;
        }
        //如果传递了size参数就设置了队列的大小
        if (list.length == size) {
            list.shift();
        }

        list.push(data);
        // list.unshift(data);
        return true;
    }

    //从队列中取出数据
    this.pop = function() {
        return list.pop();
    }

    //返回队列的大小
    this.size = function() {
        return list.length;
    }

    //返回队列的内容
    this.data = function() {
        return list;
    }
}

function Command(command,params0,params1) {
    this.command = command;
    // 原始参数
    this.params0 = params0;
    // 新参数
    this.params1 = params1;
}

function pushCommand(queue,command) {
    queue.push(command);
}

function popCommand(queue) {
    return queue.pop();
}