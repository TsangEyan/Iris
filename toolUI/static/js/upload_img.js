var uploadImgSrc    //图片路径

// 上传poster图片
// 上传poster图片
$('#add-poster-img-btn').click(function () {
    $('#add-poster-img').click()
})

$('#add-poster-img').on('change', function () {
    cleanImgUpload()
    console.log(this.files)
    console.log(this.files[0])
    getObjectURL(this.files[0])
    console.log(uploadImgSrc)
    $(".content-img-upload").append('<img src=' + uploadImgSrc + '>');
})

function cleanImgUpload() {
    $(".content-img-upload").empty();
}



//建立一個可存取到該file的url
function getObjectURL(file) {
    uploadImgSrc = null

    if (window.createObjectURL != undefined) { // basic
        uploadImgSrc = window.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        uploadImgSrc = window.webkitURL.createObjectURL(file);
    }
}