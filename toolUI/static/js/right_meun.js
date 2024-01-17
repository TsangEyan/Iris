window.onload = function () {
    const menu = document.getElementById('menu');
    window.oncontextmenu = function (e) {
        //取消默认的浏览器自带右键
        e.preventDefault();
        let x = e.offsetX;                //触发点到页面窗口左边的距离
        let y = e.offsetY;
        let winWidth = window.innerWidth; //窗口的内部宽度（包括滚动条）
        let winHeight = window.innerHeight;
        let menuWidth = menu.offsetWidth; //菜单宽度
        let menuHeight = menu.offsetHeight;
        x = winWidth - menuWidth >= x ? x : winWidth - menuWidth;
        y = winHeight - menuHeight >= y ? y : winHeight - menuHeight;
        menu.style.top = y + 'px';
        menu.style.left = x + 'px';
        if (x > (winWidth - menuWidth - submenu.offsetWidth)) {
            submenu.style.left = '-200px';
        } else {
            submenu.style.left = '';
            submenu.style.right = '-200px';
        }
        menu.classList.add('active');
    }
    // 关闭右键菜单
    window.addEventListener('click', function () {
        menu.classList.remove('active');
    })
}
// 菜单功能测试
function log(i) {
    alert(i);
}