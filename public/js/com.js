/* 
* 获取当前时间 格式为YYYY-MM-DD
*/
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/**
 * 该方法待完善修改
 * $form : form表单的ID
 * json : JSON数据
 */
var fillForm = function($form, json) {
	$ = layui.jquery;			//引用layui中的jquery
    var jsonObj = json;         //保存json数据
    //判断json数据是否是字符串
    if (typeof json === 'string') {
        //转化为json对象
        jsonObj = $.parseJSON(json);
    }
    // 遍历json对象
    for (var key in jsonObj) { 
        var objtype = jsonObjType(jsonObj[key]); // 获取值类型
        //如果是数组，一般都是数据库中多对多关系
        if (objtype === "array") {
            var obj1 = jsonObj[key];
            for ( var arraykey in obj1) {
                var arrayobj = obj1[arraykey];
                for ( var smallkey in arrayobj) {
                    setCkb(key, arrayobj[smallkey]);
                    break;
                }
            }
        } else if (objtype === "object") { // 如果是对象，啥都不错，大多数情况下，会有 xxxId
            //这样的字段作为外键表的id
        } else if (objtype === "string") { // 如果是字符串
            var str = jsonObj[key];
            var tagobjs = $("[name=" + key + "]", $form);
            if ($(tagobjs[0]).attr("type") == "radio") {// 如果是radio控件
                $.each(tagobjs, function(keyobj, value) {
                    if ($(value).attr("val") == jsonObj[key]) {
                        value.checked = true;
                    }
                });
                continue;
            }
            $("[name=" + key + "]", $form).val(jsonObj[key]);
        } else { // 其他的直接赋值
            $("[name=" + key + "]", $form).val(jsonObj[key]);
        }
    }
}
//插入checkbox数据
var setCkb = function(name, value) {
    // 不知为何找不到具体标签;目前有问题
    $("[name=" + name + "][val=" + value + "]").attr("checked", "checked");
}
var fillckb = function(name, json) {
    var jsonObj = json;
    if (typeof json === 'string') {
        jsonObj = $.parseJSON(json);
    }
    var str = jsonObj[name];
    if (typeof str === "string") {
        var array = str.split(",");
        $.each(array, function(key, value) {
            setCkb(name, value);
        });
    }
};
/*
**获取json数据的值类型
**obj  json数据的值
*/
var jsonObjType = function(obj) {
    //判断值类型
    if (typeof obj === "object") {
        //值转换为 JSON 字符串。
        var teststr = JSON.stringify(obj);
        if (teststr[0] == '{' && teststr[teststr.length - 1] == '}')
            return "class";
        if (teststr[0] == '[' && teststr[teststr.length - 1] == ']')
            return "array";
    }
    return typeof obj;
};