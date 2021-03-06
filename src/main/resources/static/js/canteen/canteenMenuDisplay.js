window.onload = function () {
    var timeToMenus = {};
    let currentMenuID;
    init();

    $(document).on('click', '.shop-cartbutton', function () {
        let d = {};
        d.menuID = currentMenuID;
        d.kind = $(this).siblings(".shopmenu-food-kind").text();
        d.id = $(this).siblings(".shopmenu-food-id").text();
        d.name = $(this).siblings(".shopmenu-food-name").text();
        d.price = $(this).siblings(".shopmenu-food-price").text();
        console.log(d);

        $.ajax({
            url: "/member/cart/add",
            type: "post",
            data:JSON.stringify(d),
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                alert(data['message']);
            },
            fail: function (data) {
                alert("fail");
            }
        })
    });

    //进入购物车
    $(".toolbar-cartbtn").click(function () {
        window.location.href = "cartCheckout.html";
    });

    //换时间查看
    $(document).on('click','.shopnav-tab',function () {
        let time = $(this).text();
        $(".shopmenu-nav").empty();
        $(".shopmenu-main").empty();
        initHtmlByDate(time);

    });

    function init() {
        $.ajax({
            url: "/canteen/menu/display",
            type: "post",
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                console.log(data);
                $(".topbar-member-name").text(data['memberName']);
                if (data['menus'].length == 0){
                    alert("商家还未发布订单");
                }
                initFirst(data['menus']);
            },
            fail: function (data) {
                alert("fail");
            }
        })

    }

    function initFirst(menus) {
        initTimeMap(menus);
        let time = menus[0]['time'];
        initHtmlByDate(time);
    }

    function initTimeMap(data) {
        for (var i = 0; i < data.length; i++) {
            var menu = data[i];
            var time = menu['time'];
            timeToMenus[time] = menu;
            var html = '<a class="shopnav-tab" menu-id="'+ menu['id'] +'">' + time + '</a>';
            $(".shopnav-left").append(html);
        }
    }

    function initHtmlByDate(time) {
        var menu = timeToMenus[time];

        //要修改当前ｍｅｎｕ的id
        currentMenuID =menu['id'];

        var dishes = menu['dishes'];

        console.log(menu);
        console.log(dishes);

        //得到category和dish的map
        var categoryTodishes = initCategoryMap(dishes);
        console.log(categoryTodishes);
        initMenuNav(categoryTodishes);

        initDishes(categoryTodishes);

        let combos = menu['combos'];
        //添加combo
        initCombo(combos);
    }

    function initCategoryMap(dishes) {
        var categoryTodishes = {};
        for (var j = 0; j < dishes.length; j++) {
            var dish = dishes[j];
            var dishCategory = dish['dishCategory'];
            console.log(categoryTodishes[dishCategory], dishCategory);
            if (categoryTodishes[dishCategory] == undefined) {
                categoryTodishes[dishCategory] = [];
            }

            console.log('dish', dishCategory, dish);
            categoryTodishes[dishCategory].push(dish);
        }

        return categoryTodishes;
    }

    function initMenuNav(categoryTodishes) {
        for (var category in categoryTodishes) {
            var html = '<a href="javascript:">' + category + '</a>';
            $(".shopmenu-nav").append(html);
        }

        var ahtml = '<a href="javascript:">套餐</a>';
        $(".shopmenu-nav").append(ahtml);
    }

    function initDishes(categoryTodishes) {
        for (var category in categoryTodishes) {
            var all_dishes = categoryTodishes[category];

            let html = '<div class="shopmenu-list clearfix">';
            html += '<h3 class="shopmenu-title ng-binding">' + category + '</h3>';

            for (var i = 0; i < all_dishes.length; i++) {
                var dish = all_dishes[i];
                html += '<div class="shopmenu-food">\n' +
                    '                <div class="shopmenu-food-main">\n' +
                    '                    <h3 class="shopmenu-food-kind">dish</h3>\n' +
                    '                    <h3 class="shopmenu-food-id ui-ellipsis">' + dish['id'] + '</h3>\n' +
                    '                    <h3 class="shopmenu-food-name ui-ellipsis">' + dish['name'] + '</h3>\n' +
                    '                    <p class="color-mute ui-ellipsis">' + dish['description'] + '</p>\n' +
                    '                    <span style="color: red">￥</span>\n' +
                    '                    <span class="shopmenu-food-price color-stress ui-ellipsis">' + dish['price'] + '</span>\n' +
                    '<p></p>\n' +
                    '                    <span>剩余 </span>\n' +
                    '                    <span class="shopmenu-food-remnants ui-ellipsis">' + dish['remnants'] + '</span>' +
                    '                    <button class="shop-cartbutton">加入购物车</button>\n' +
                    '                </div>\n' +
                    '            </div>';
            }

            html += '    </div>\n';

            $(".shopmenu-main").append(html);
        }
    }

    function initCombo(combos) {
        let comboHtml = '<div class="shopmenu-list clearfix">';
        comboHtml += '<h3 class="shopmenu-title ng-binding">套餐</h3>';

        for (var i = 0; i < combos.length; i++) {
            var combo = combos[i];
            comboHtml += '<div class="shopmenu-food">\n' +
                '                <div class="shopmenu-food-main">\n' +
                '<h3 class="shopmenu-food-kind">combo</h3>\n' +
                '                    <h3 class="shopmenu-food-id ui-ellipsis">' + combo['id'] + '</h3>\n' +
                '                    <h3 class="shopmenu-food-name ui-ellipsis">' + combo['name'] + '</h3>\n' +
                '                    <p class="color-mute ui-ellipsis">' + combo['description'] + '</p>\n' +
                '                    <span>￥</span>\n' +
                '                    <span class="shopmenu-food-price color-stress ui-ellipsis">' + combo['price'] + '</span>\n' +
                '<p></p>\n' +
                '                    <span>剩余 </span>\n' +
                '                    <span class="shopmenu-food-remnants ui-ellipsis">' + combo['remnants'] + '</span>' +
                '                    <button class="shop-cartbutton">加入购物车</button>\n' +
                '                </div>\n' +
                '            </div>';
        }

        comboHtml += '    </div>\n';

        $(".shopmenu-main").append(comboHtml);
    }

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

}





