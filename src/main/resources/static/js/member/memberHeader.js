$(".topbar-member-area").mouseover(function () {
    console.log(111);
    $(".user-menu").css("display", "block");
});
$(".topbar-member-area").mouseout(function () {
    $(".user-menu").css("display", "none");
});

$(".user-menu").mouseover(function () {
    $(".user-menu").css("display", "block");
})

$(".user-menu").mouseout(function () {
    $(".user-menu").css("display", "none");
});

$('.log-off').click(function () {
    let res = confirm("确定注销吗？");
    if (res == true) {
        $.ajax({
            url: "/member/logoff",
            type: "post",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data["message"]);
                window.location.href = "login.html";
            },
            fail: function (data) {
                alert("fail");
            }
        });
    }
})

$(".log-out").click(function () {
    window.location.href = "login.html";
})
