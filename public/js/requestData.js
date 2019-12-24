layui.define(['jquery'], function(exports){
    var $ = layui.jquery;

    var base = {
        todo: function(func,data,callback){
            $.post('/ajax/'+func,data,function(res){
                callback(res)
            })
        }
    }

    exports('requestData',base);
});
 