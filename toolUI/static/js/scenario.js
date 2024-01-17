// 创建舞台
var width = $('#drawing-board').width()
var height = width * 2
// var height = window.innerHeight;


var stage = new Konva.Stage({
    container: 'drawing-board', //指定放置舞台的容器
    width: width, //设置宽高
    height: height,
})

// 创建层
var layer
var container = stage.container();
var target      // 记录当前图形目标


$('#start').click(function () {
    boardClear()
    layer = new Konva.Layer();
    stage.add(layer); //将层添加至舞台
    drawModel()
})

// 绘制模版
// #region
function drawModel() {
    var select = $("#column").val()
    drawBackground()
    if (select === 'single') {
        drawSingleModel()
    }
    else {
        drawDoubleModel()
    }

    layer.draw();
    changeSize();
}

// 绘制背景
function drawBackground() {
    let backgroundColor = "rgb(245, 245, 245)"
    // let backgroundColor = "rgb(49, 52, 53)"
    rectBackground = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: backgroundColor,
        opacity: 1,
        name: 'background'
    });

    addCursor(rectBackground);
    layer.add(rectBackground);
    layer.draw();

}

// 绘制单列模版
function drawSingleModel() {
    var marginX = 40
    var marginY = 40
    var singleW = 700
    var singleH = 350
    var color = "rgb(96, 127, 213)"

    for (let i = 0; i < 4; i++) {
        let rect_x = marginX
        let rect_y = marginY + (singleH + marginY) * (i % 4)
        drawRect('rect' + i, rect_x, rect_y, singleW, singleH, color)
    }

}

// 绘制双列模版
function drawDoubleModel() {
    var marginX = 20
    var marginY = 20
    var doubleW = 360
    var doubleH = 540
    var color = "rgb(96, 127, 213)"

    for (let i = 0; i < 6; i++) {
        let rect_x = (i % 2) * doubleW + (i % 2 + 1) * marginX
        let rect_y = marginY + (doubleH + marginY) * Math.floor(i / 2)
        drawRect('rect' + i, rect_x, rect_y, doubleW, doubleH, color)
    }
}


// 绘制矩形
function drawRect(rectID, rectX, rectY, rectW, rectH, color) {
    rectBox = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectW,
        height: rectH,
        fill: color,
        opacity: 0.7,
        draggable: true,
        name: rectID
    });

    addCursor(rectBox);
    layer.add(rectBox);
}
// #endregion

// 拖动调整
// #region
// 点击图形触发事件
var target      // 记录当前图形目标
// 图形变化
function changeSize() {
    stage.on('click tap', function (e) {
        // if click on empty area - remove all transformers
        if (e.target === stage) {
            // stage.find('Transformer').destroy();
            if (stage.find('Transformer').length > 0) {
                stage.find('Transformer')[0].destroy()
            }
            layer.draw();
            target = null;  // 移除目标
            return;
        }

        // 双击取消选择
        e.target.on('dblclick', function () {
            deletSelect()
            target = null
            return;
        })

        // remove old transformers
        // TODO: we can skip it if current rect is already selected
        // stage.find('Transformer').destroy();
        if (stage.find('Transformer').length > 0) {
            stage.find('Transformer')[0].destroy()
        }
        target = e.target   //记住目标
        e.target.on('click', function () {
            offKeyboardEvent()
            onKeyboardEvent(); // 添加键盘监听

        });

        // create new transformer

        var tr = new Konva.Transformer();
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
    });
}


// #endregion

// 清除画布
function boardClear() {
    stage.destroyChildren()
}

// 取消选择框
function deletSelect() {
    if (stage.find('Transformer').length > 0) {
        stage.find('Transformer')[0].destroy()
    }
    layer.draw();
    target = null;  // 移除目标
}


// 更换图片
// #region
$("#addImg").change(function (e) {
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);

    addImg(url)
    // 图片添加

})

function addImg(url) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
        var img_x = target.x()
        var img_y = target.y()
        var img_width = Math.round(target.width() * target.scaleX())
        var img_height = Math.round(target.height() * target.scaleY())


        // now load the Konva image
        var theImg = new Konva.Image({
            image: img,
            x: img_x,
            y: img_y,
            width: img_width,
            height: img_height,
            draggable: true,
            rotation: 0
        });

        layer.add(theImg);
        target.remove();
        target = theImg
        layer.draw();
        target = theImg
    }

}
// #endregion


// add cursor styling
function addCursor(rectBox) {
    rectBox.on('mouseenter', function () {
        stage.container().style.cursor = 'move';
    });

    rectBox.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });
}

//保存img图片
// #region
function downloadImg() {
    var dataURL = stage.toDataURL({ pixelRatio: 3 })
    var link = document.createElement('a')
    link.download = getNameByDate()
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    delete link

    function getNameByDate() {
        let date = new Date()
        let name = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() + '.jpg'
        console.log(name)
        return name
    }
}

$("#toImg").click(function () {
    downloadImg()
})
// #endregion

// 监听键盘事件
// #region
function onKeyboardEvent() {
    container.tabIndex = 1;
    container.focus();

    container.addEventListener('keydown', keyboardMove)
}

// 移除监听键盘事件
function offKeyboardEvent() {
    container.removeEventListener('keydown', keyboardMove)
}

// 键盘移动
const keyboardMove = (e) => {
    const DELTA = 4;
    if (e.keyCode === 37) {
        target.x(target.x() - DELTA);
    } else if (e.keyCode === 38) {
        target.y(target.y() - DELTA);
    } else if (e.keyCode === 39) {
        target.x(target.x() + DELTA);
    } else if (e.keyCode === 40) {
        target.y(target.y() + DELTA);
    } else {
        return;
    }
    e.preventDefault();
    // updateText(target);
    layer.batchDraw();
}



// #endregion
