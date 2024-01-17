// 左侧 控制text or UI
// #region 
var labels = document.getElementsByClassName("label-container")
function showReview(num) {
    for (label of labels) {
        label.classList.remove("label-active")
    }
    labels[num].classList.add("label-active")
}
// #endregion
chooseData()
var scenario = 'recommendation'
var path = '/static/img/recommendation.json'
var select = '.' + scenario + '>.img-box>img'
var imgSet = []


function chooseData() {
    for (let i = 0; i < 3; i++) {
        $("div.button-box>input[type='button']").eq(i).click(function (e) {
            showReview(i)            // dataClass = this.value
            scenario = this.value
            path = '/static/img/' + scenario + '.json'
            select = '.' + scenario + '>.img-box>img'
            loadData()
            selectModel()

            console.log(path)
            console.log(scenario)
            console.log(select)

        })
    }
}
// selectModel()
function loadData() {
    imgSet = []
    $.getJSON(path, function (data) {
        for (let i = 0; i < 10; i++) {
            imgSet.push(data.layouts[i])
        }
        console.log(data)
    });
}

// 点击图片绘制
function selectModel() {
    for (let i = 0; i < 10; i++) {
        $(select).eq(i).click(function () {
            stageInit(i);
            drawModel(i);
            console.log(i)
            // console.log("i type:" + typeof (i));
        });
    }

}






// 中间画板
// #region
// 根据输入展示图片
// 创建舞台
var layer;
var stage
var rectBox;
var container
var target  // 记录当前目标

var width = 1350
var height = 1350

function stageInit(num) {
    let bwidth = imgSet[num].elements[0].w
    let bheight = imgSet[num].elements[0].h
    $(".drawing-board-container").width(bwidth)
    $(".drawing-board-container").height(bheight)
    stageBuild(bwidth, bheight)
    // $(".drawing-board-container").width(width)
    // $(".drawing-board-container").height(height)
    // stageBuild(width, height)
}

function stageBuild(width, height) {
    stage = new Konva.Stage({
        container: 'drawing-board', //指定放置舞台的容器
        width: width, //设置宽高
        height: height,

    });
    container = stage.container();
}


// 修改stage 大小
$("#change-background").click(function () {
    change_w = $("#background_w").val();
    change_h = $("#background_h").val();
    $(".drawing-board-container").width(change_w)
    $(".drawing-board-container").height(change_h)
    stage.width(change_w)
    stage.height(change_h)
    container = stage.container();
})

// 选中模版中间绘制
function drawModel(num) {
    boardClear();
    // 创建层
    layer = new Konva.Layer();
    stage.add(layer); //将层添加至舞台
    // alert('click is ' + imgText[num]);
    for (let i = 0; i < imgSet[num].elements.length; i++) {
        // background
        if (i === 0) {
            let rectOpacity = 1
            drawRect('background', imgSet[num].elements[i].x, imgSet[num].elements[i].y, imgSet[num].elements[i].w, imgSet[num].elements[i].h, imgSet[num].elements[i].color, rectOpacity, drag = null)
        } else {
            let rectOpacity = 0.7
            drawRect('rect' + i, imgSet[num].elements[i].x, imgSet[num].elements[i].y, imgSet[num].elements[i].w, imgSet[num].elements[i].h, imgSet[num].elements[i].color, rectOpacity, drag = 'ture')
        }
    }


    layer.draw();
    changeSize();

}


// 绘制矩形
function drawRect(rectID, rectX, rectY, rectW, rectH, rectColor, rectOpacity, drag) {
    rectBox = new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectW,
        height: rectH,
        fill: rectColor,
        opacity: rectOpacity,
        draggable: drag,
        name: rectID
    });

    addCursor(rectBox);
    layer.add(rectBox);
}


// 清除画布
function boardClear() {
    // stage.clear();
    stage.destroyChildren()
}


// add cursor styling
function addCursor(rectBox) {
    rectBox.on('mouseenter', function () {
        stage.container().style.cursor = 'move';
    });

    rectBox.on('mouseleave', function () {
        stage.container().style.cursor = 'default';
    });
}


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
            updateText(e.target);
            return;
        }

        // if (e.target.name() === 'background') {
        //     deletSelect()
        //     target = null
        //     return;
        // }

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
            updateText(e.target);

        });

        // create new transformer
        if (e.target.name() === 'text') {
            addTextTransformer()
            return;

        } else {
            var tr = new Konva.Transformer();
            layer.add(tr);
            tr.attachTo(e.target);
            layer.draw();
            textChange(e.target);
        }

    });
}

// 取消选择框
function deletSelect() {
    if (stage.find('Transformer').length > 0) {
        stage.find('Transformer')[0].destroy()
    }
    layer.draw();
    target = null;  // 移除目标
}


// 根据文本框输入调整图片
// #region
// <input> 实时改动 rectBox -> <input>
function textChange(e) {
    e.on('dragmove', function () {
        updateText(e);
    });
    e.on('transform', function () {
        updateText(e);
    });
};

// updateText  rectBox -> <input>
function updateText(e) {
    $("#rectX").val(Math.round(e.x()));
    $("#rectY").val(Math.round(e.y()));
    $("#rectW").val(Math.round(e.width() * e.scaleX()));
    $("#rectH").val(Math.round(e.height() * e.scaleY()));
};


// updateRect  <input> -> rectBox
// 键盘输入触发，文本框改变不触发
// function updateRect(e) {

// }
// #endregion

// 键盘操作
// #region 
// 监听键盘事件
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
    const DELTA = 2;
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
    updateText(target);
    layer.batchDraw();
}
// #endregion


// 图层up/down
// #region
$("#up").click(function () {
    target.moveUp();
    layer.draw();
})

$("#down").click(function () {
    target.moveDown();
    layer.draw();
})
// #endregion


// save stage as a json string
// #region
var json
$("#tojson").click(function () {
    json = stage.toJSON();
    console.log(json);
});
// #endregion


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
    deletSelect()
    downloadImg()
})
// #endregion

//删除元素
$("#delet").click(function () {
    target.remove();
    target = null
})


// 更换图片
// #region
$("#addImg").change(function (e) {
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.src = url;
    addImg()
    // 图片添加
    function addImg() {
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
            // target.destroy();
            target = theImg
            layer.draw();
            target = theImg
        }

    }
})

// #endregion


// 文本编辑
// #region
var textNode
var textarea
var tr


// 调整字体大小
$("#front-change").click(function () {
    var frontSize = $("#front-size").val()
    if (frontSize != null) {
        textNode.fontSize(frontSize)
    }
})

// 添加文本
$("#addText").click(function () {
    addText()
})

function addText() {
    textNode = new Konva.Text({
        text: 'Some text here',
        x: 50,
        y: 80,
        fontSize: 28,
        draggable: true,
        width: 200,
        name: 'text',
        selectable: true
    });

    layer.add(textNode);
    addTextTransformer()

    // 双击编辑文字
    textNode.on('dblclick', () => {
        typedText()

    });

    function typedText() {
        // hide text node and transformer:
        textNode.hide();
        tr.hide();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNode.absolutePosition();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
            x: $("canvas").offset().left + textPosition.x,
            y: $("canvas").offset().top + textPosition.y,
        };

        // create textarea and style it
        textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height =
            textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        textarea.style.zIndex = 100;
        rotation = textNode.rotation();
        var transform = '';
        if (rotation) {
            transform += 'rotateZ(' + rotation + 'deg)';
        }

        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
            px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        function removeTextarea() {
            textarea.parentNode.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            textNode.show();
            tr.show();
            // tr.forceUpdate();
        }

        function setTextareaWidth(newWidth) {
            if (!newWidth) {
                // set width for placeholder
                newWidth = textNode.placeholder.length * textNode.fontSize();
            }
            // some extra fixes on different browsers
            var isSafari = /^((?!chrome|android).)*safari/i.test(
                navigator.userAgent
            );
            var isFirefox =
                navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
            if (isSafari || isFirefox) {
                newWidth = Math.ceil(newWidth);
            }

            var isEdge =
                document.documentMode || /Edge/.test(navigator.userAgent);
            if (isEdge) {
                newWidth += 1;
            }
            textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function (e) {
            // hide on enter
            // but don't hide on shift + enter
            if (e.keyCode === 13 && !e.shiftKey) {
                textNode.text(textarea.value);
                removeTextarea();
            }
            // on esc do not set value back to node
            if (e.keyCode === 27) {
                removeTextarea();
            }
        });

        textarea.addEventListener('keydown', function (e) {
            scale = textNode.getAbsoluteScale().x;
            setTextareaWidth(textNode.width() * scale);
            textarea.style.height = 'auto';
            textarea.style.height =
                textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
            if (e.target !== textarea) {
                textNode.text(textarea.value);
                removeTextarea();
            }
        }
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
        });
    }
}

// 文本transformer
function addTextTransformer() {
    tr = new Konva.Transformer({
        node: textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        // set minimum width of text
        boundBoxFunc: function (oldBox, newBox) {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
        },
    });

    textNode.on('transform', function () {
        // reset scale, so only with is changing by transformer
        textNode.setAttrs({
            width: textNode.width() * textNode.scaleX(),
            scaleX: 1,
        });
    });

    layer.add(tr);
}
// #endregion

// #endregion


