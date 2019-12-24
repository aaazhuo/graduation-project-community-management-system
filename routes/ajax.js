var express = require('express');
var mongoose = require('../common/dbConnection');
var router = express.Router();

var Schema = mongoose.Schema;

// 用户登录表
var User = mongoose.model('User', new Schema({
    username: String,
    password: String,
    name:String,
    phone:String,
    gender:String
}, { collection: 'user' }));

// 房屋信息表
var House = mongoose.model('House', new Schema({
    address: String,
    structure: String,
    area: Number,
    rentalPrice: Number,
    salePrice: Number,
    desc: String,
    status: String
}, { collection: 'house' }));

// 房屋业主信息表
var Household = mongoose.model('Household', new Schema({
    houseId:String,
    address:String,
    name: String,
    phone: Number,
    IDcard: Number,
    status: String,
    isOwner: String,
    desc: String
}, { collection: 'household' }));

// 物业费用信息表
var Cost = mongoose.model('Cost', new Schema({
    houseId: String,    
    address: String,
    type:String,
    startTime: String,
    endTime: String,
    actualAmount: Number,
    alreadyPaid: Number,
    status:String,
    desc: String
}, { collection: 'cost' }));

// 维修/投诉任务信息表
var Task = mongoose.model('Task', new Schema({
    houseId: String,    
    address: String,
    name: String,
    phone: String,
    submitTime:String,
    endTime:String,
    type: String,
    status:String,
    content: String,
}, { collection: 'task' }));

/* 登陆接口逻辑 */
router.post('/login', function(req, res, next){
    req.session.user = null;
    User.findOne({username:req.body.username, password:req.body.password}, function(err,doc){
        if(err) console.log(err)
        if(doc){
            req.session.user = {
                username:doc.username,
                id:doc._id,
                name:doc.name,
                phone:doc.phone,
                gender:doc.gender
            }
            res.send({
                errcode:0
            })
        } else {
            res.send({
                errcode:1,
                msg:'用户名或密码错误哟=_=||'
            });
        }
    })
})

/* 获取上下文数据 */
router.post('/getContext', function(req, res, next){
    res.send({
        errcode:0,
        data:{
            user:req.session.user
        },
        msg:'获取数据成功'
    })
})


/* 
*  我的面板模块接口
*  getPerson：获取登陆个人用户基本信息
*  changePersonInfo: 修改登陆个人用户基本信息
*/

/* 获取登陆个人用户基本信息 */
router.post('/getPerson', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    User.findById(req.session.user.id, function(err,doc){
        if(err) {
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return;
        }
        if(doc){  
            res.send({
                errcode:0,
                data:{
                    username: doc.username,
                    name: doc.name,
                    phone: doc.phone,
                    gender: doc.gender,
                },
                msg:'获取个人信息成功'
            })
        } else {
            res.send({
                errcode:1,
                msg:'获取不到个人信息'
            })
        }
    })
});

/* 修改登陆个人用户基本信息 */
router.post('/changePersonInfo', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    User.findById(req.session.user.id, function(err,doc){
        if(err) {
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return;
        }
        doc.name = req.body.name;
        doc.phone = req.body.phone;
        doc.gender = req.body.gender;
        doc.save(function(err){
            if(!err){
                res.send({
                    errcode:0,
                    msg:'更新个人信息成功=_=!'
                })
            } else {
                res.send({
                    errcode:4,
                    msg:'更新个人信息失败：' + err.messages
                })
            }
        })
    })
});

/* 修改登陆个人用户密码 */
router.post('/changePwd', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    User.findById(req.session.user.id, function(err,doc){
        if(err) {
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return;
        }
        if(doc.password === req.body.oldPassword){
            doc.password = req.body.newPassword;
            doc.save(function(err){
                if(!err){
                    res.send({
                        errcode:0,
                        msg:'修改密码成功=_=!'
                    })
                } else {
                    res.send({
                        errcode:4,
                        msg:'修改密码成功失败：' + err.messages
                    })
                }
            })
        } else {
            res.send({
                errcode:5,
                msg:'旧密码错误，请输入正确的旧密码'
            }) 
        }
    })
});



/* 
*   房屋管理模块接口
*   addHouse：新增房屋信息接口
*   getHouseInfo： 获取房屋信息接口
*   updateHouseInfo： 编辑更新房屋信息接口
*   deleteHouseInfo：删除房屋信息接口
*   updateHouseStatus：编辑更新房屋状态信息接口
*/
/* 新增房屋信息接口 */
router.post('/addHouse',function(req,res,next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    var h = new House({
        address:req.body.address,
        structure:req.body.structure,
        area:req.body.area,
        rentalPrice:req.body.rentalPrice,
        salePrice:req.body.salePrice,
        desc:req.body.desc,
        status:'空闲'
    })
    h.save(function(err,doc){
        if(err) {
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return;
        }
        if(doc){
            res.send({
                errcode:0
            })
        } else {
            res.send({
                errcode:1,
                msg:'添加房屋失败=_=||'
            });
        }
    })
});

/* 获取房屋信息接口 */
router.get('/getHouseInfo',function(req,res,next){
    var condition = {};
    var page = parseInt(req.query.page || 1);
    var limit = parseInt(req.query.limit || 12);
    if(req.query.address){
        condition.address = {$regex: new RegExp(req.query.address, 'i')}; 
    }
    if(req.query.status){
        condition.status = req.query.status;
    }
    if(req.query.structure){
        condition.structure = {$regex: new RegExp(req.query.structure, 'i')}; 
    }
    if(req.query.area_min || req.query.area_max){
        condition.area = {
            $gte: (req.query.area_min==='' ? 0 : req.query.area_min),
            $lte:(req.query.area_max==='' ? 2147483647 : req.query.area_max)
        }; 
    }
    if(req.query.price_min || req.query.price_max){
        if(req.query.type === 0){
            condition.rentalPrice = {
                $gte: (req.query.price_min==='' ? 0 : req.query.price_min),
                $lte:(req.query.price_max==='' ? 0 : req.query.price_max)
            } 
        }else if(req.query.type === 1) {
            condition.salePrice = {
                $gte: (req.query.price_min==='' ? 0 : req.query.price_min),
                $lte:(req.query.price_max==='' ? 0 : req.query.price_max)
            }; 
        }
    }
    House.find(condition)
         .skip((page-1)*limit)
         .limit(limit)
         .exec(function(err,doc){
            if(err) {
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(doc){
                House.where(condition).count(function(err, count){
                    if(err) {
                        res.send({
                            errcode:3,
                            msg:'数据库错误：'+err.messages
                        })
                        console.log(err)
                        return 
                    }
                    res.send({
                        errcode:0,
                        msg:'获取房屋信息成功=_=',
                        data:doc,
                        total:count
                    })
                })
               
            }
         })
});

/* 编辑更新房屋信息接口 */
router.post('/updateHouseInfo', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    House.update(
        {_id:req.body._id},//查询匹配条件
        /* 修改的参数 */
        {
            address:req.body.address,
            structure:req.body.structure,
            area:req.body.area,
            status:req.body.status,
            rentalPrice:req.body.rentalPrice,
            salePrice:req.body.salePrice,
            desc:req.body.desc
        },
        /* 回调函数 */
        function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(result.ok === 1){
                res.send({
                    errcode:0,
                    msg:'更新房屋信息成功=_=',
                })
            }
        }
    )
});

/* 删除房屋信息接口 */
router.post('/deleteHouseInfo', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    House.deleteOne({_id:req.body._id},function(err){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        } else {
            res.send({
                errcode:0,
                msg:'删除房屋信息成功=_=',
            })
        }
    })
});

/* 编辑更新房屋状态信息接口 */
router.post('/updateHouseStatus', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    House.update(
        {_id:req.body._id},//查询匹配条件
        /* 修改的参数 */
        {
            status : req.body.status
        },
        /* 回调函数 */
        function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(result.ok === 1){
                res.send({
                    errcode:0,
                    msg:'成功=_=',
                })
            }
        }
    )
});

/* 
*   房屋业主管理模块接口
*   getHouseholdInfo： 获取房屋业主基本信息接口
*   getHouseAddress： 获取房屋住址接口
*   updateHousehold： 编辑更新房屋业主信息接口
*   addHousehold：新增房屋业主接口
*/

/* 获取房屋业主基本信息接口 */
router.get('/getHouseholdInfo',function(req,res,next){
    var condition = {};
    var page = parseInt(req.query.page || 1);
    var limit = parseInt(req.query.limit || 12);
    if(req.query.name){
        condition.name = {$regex: new RegExp(req.query.name, 'i')}; 
    }
    Household.find(condition)
         .skip((page-1)*limit)
         .limit(limit)
         .exec(function(err,doc){
            if(err) {
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            Household.where(condition).count(function(err, count){
                if(err) {
                    res.send({
                        errcode:3,
                        msg:'数据库错误：'+err.messages
                    })
                    console.log(err)
                    return 
                }
                res.send({
                    errcode:0,
                    msg:'获取房屋业主信息成功=_=',
                    data:doc,
                    total:count
                })
            })
        })
});

/* 获取房屋住址接口 */
router.get('/getHouseAddress',function(req,res,next){
    House.find(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                data:doc,
                msg:'获取房屋住址数据成功=_=',
            })
        } else {
            res.send({
                errcode:1,
                msg:'数据库没有数据=_=||',
            })
        }
        
    })
});

/* 编辑更新房屋业主信息接口 */
router.post('/updateHousehold', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    Household.update(
        {_id:req.body._id},//查询匹配条件
        /* 修改的参数 */
        {
            IDcard: req.body.IDcard,
            address:req.body.address,
            houseId:req.body.houseId,
            isOwner:req.body.isOwner,
            name:req.body.name,
            phone:req.body.phone,
            status : req.body.status,
            des:req.body.des
        },
        /* 回调函数 */
        function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(result.ok === 1){
                res.send({
                    errcode:0,
                    msg:'成功=_=',
                })
            }
        }
    )
});

/* 删除房屋信息接口 */
router.post('/deleteHousehold', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    Household.deleteOne({_id:req.body._id},function(err){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        } else {
            res.send({
                errcode:0,
                msg:'删除房屋信息成功=_=',
            })
        }
    })
});

/* 新增房屋业主接口 */
router.post('/addHousehold',function(req,res,next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    var h = new Household({
        houseId:req.body.houseId,
        address:req.body.address,
        name: req.body.name,
        phone: req.body.phone,
        IDcard: req.body.IDcard,
        status: req.body.status,
        isOwner: req.body.isOwner,
        desc: req.body.desc
    })
    h.save(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                msg:'新添加房屋业主成功=_='
            })
        } else {
            res.send({
                errcode:1,
                msg:'添加房屋业主失败=_=||'
            });
        }
    })
})

/* 
*   房屋物业收费模块接口
*   getProperty： 获取房屋物业基本信息接口
*   updateProperty： 编辑更新房屋物业缴费信息接口
*   addcost: 新增房屋物业收费接口
*/

/* 获取房屋物业基本信息接口 */
router.get('/getProperty',function(req,res,next){
    var condition = {};
    var page = parseInt(req.query.page || 1);
    var limit = parseInt(req.query.limit || 12);
    if(req.query.address){
        condition.address = {$regex: new RegExp(req.query.address, 'i')}; 
    }
    if(req.query.type){
        condition.type = req.query.type; 
    }
    if(req.query.status){
        condition.status = req.query.status;
    }
    Cost.find(condition)
         .skip((page-1)*limit)
         .limit(limit)
         .exec(function(err,doc){
            if(err) {
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            Cost.where(condition).count(function(err, count){
                if(err) {
                    res.send({
                        errcode:3,
                        msg:'数据库错误：'+err.messages
                    })
                    console.log(err)
                    return 
                }
                res.send({
                    errcode:0,
                    msg:'获取房屋业主信息成功=_=',
                    data:doc,
                    total:count
                })
            })
        })
});

/* 编辑更新房屋物业缴费信息接口 */
router.post('/updateProperty', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    Cost.update(
        {_id:req.body._id},//查询匹配条件
        /* 修改的参数 */
        {
            status: req.body.status,
            alreadyPaid:req.body.alreadyPaid
        },
        /* 回调函数 */
        function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(result.ok === 1){
                res.send({
                    errcode:0,
                    msg:'缴费成功=_=',
                })
            }
        }
    )
});

/* 新增房屋物业收费接口 */
router.post('/addcost',function(req,res,next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    var h = new Cost({
        houseId: req.body.houseId,
        address: req.body.address,
        actualAmount: req.body.actualAmount,
        alreadyPaid: req.body.alreadyPaid,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        status: req.body.status,
        desc: req.body.desc,
        type: req.body.type
    })
    h.save(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                msg:'添加成功=_='
            })
        } else {
            res.send({
                errcode:1,
                msg:'添加失败=_=||'
            });
        }
    })
})

/* 
*   房屋维修/投诉模块接口
*   getRepairComplaint 获取房屋维修/投诉基本信息接口
*   updateRepairComplainty 编辑更新房屋维修/投诉状态信息接口
*   addcost: 新增维修/投诉接口
*/

/* 获取房屋维修/投诉基本信息接口 */
router.get('/getRepairComplaint',function(req,res,next){
    var condition = {};
    var page = parseInt(req.query.page || 1);
    var limit = parseInt(req.query.limit || 12);
    if(req.query.address){
        condition.address = {$regex: new RegExp(req.query.address, 'i')}; 
    }
    if(req.query.content){
        condition.content = {$regex: new RegExp(req.query.content, 'i')}; 
    }
    if(req.query.address){
        condition.name = {$regex: new RegExp(req.query.name, 'i')}; 
    }
    if(req.query.type){
        condition.type = req.query.type; 
    }
    if(req.query.status){
        condition.status = req.query.status;
    }
    Task.find(condition)
         .skip((page-1)*limit)
         .limit(limit)
         .exec(function(err,doc){
            if(err) {
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            Task.where(condition).count(function(err, count){
                if(err) {
                    res.send({
                        errcode:3,
                        msg:'数据库错误：'+err.messages
                    })
                    console.log(err)
                    return 
                }
                res.send({
                    errcode:0,
                    msg:'获取房屋业主信息成功=_=',
                    data:doc,
                    total:count
                })
            })
        })
});

/* 编辑更新房屋维修/投诉状态信息接口 */
router.post('/updateRepairComplainty', function(req, res, next){
    if(!req.session.user){
        res.send({
            errcode:2,
            msg:'未登录，暂无权限'
        })
        return
    }
    Task.update(
        {_id:req.body._id},//查询匹配条件
        /* 修改的参数 */
        {
            status: req.body.status,
            endTime:req.body.endTime
        },
        /* 回调函数 */
        function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            if(result.ok === 1){
                res.send({
                    errcode:0,
                    msg:'任务处理成功=_=',
                })
            }
        }
    )
});

/* 新增维修/投诉接口 */
router.post('/addRepairCpmplaint',function(req,res,next){
    var h = new Task({
        houseId: req.body.houseId,
        address: req.body.address,
        name: req.body.name,
        phone: req.body.phone,
        type: req.body.type,
        submitTime: req.body.submitTime,   
        status: req.body.status,
        content: req.body.content
    })
    h.save(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                msg:'添加成功=_='
            })
        } else {
            res.send({
                errcode:1,
                msg:'添加失败=_=||'
            });
        }
    })
})

/* 
*   后台首页接口
*   getRepairComplaint 获取房屋维修/投诉基本信息接口
*   updateRepairComplainty 编辑更新房屋维修/投诉状态信息接口
*   addcost: 新增维修/投诉接口
*/
/* 获取房屋业主总数接口 */
router.get('/getHouseholdCount',function(req,res,next){
    Household.find(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                data:doc.length,
                msg:'获取房屋业主总数数据成功=_=',
            })
        } else {
            res.send({
                errcode:1,
                msg:'数据库没有数据=_=||',
            })
        }
        
    })
});
/* 获取房屋总数接口 */
router.get('/getHouseCount',function(req,res,next){
    House.find(function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        if(doc){
            res.send({
                errcode:0,
                data:doc.length,
                msg:'获取房屋总数成功=_=',
            })
        } else {
            res.send({
                errcode:1,
                msg:'数据库没有数据=_=||',
            })
        }
        
    })
});
/* 获取维修接口 */
router.get('/getRepairCount',function(req,res,next){
    var t1,t2
    Task.find(
        {
            type:'维修',
            status:'未处理'
        },function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        t1 = doc.length;
        Task.find({
            type:'维修',
            status:'已处理',
            endTime:req.query.endTime
        },function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            t2 = result.length;
            res.send({
                errcode:0,
                data:{
                    unprocessed:t1,
                    processed:t2
                },
                msg:'获取维修数据成功=_=',
            })
        })
    })
});
/* 获取投诉接口 */
router.get('/getComplaintCount',function(req,res,next){
    var t1,t2
    Task.find(
        {
            type:'投诉',
            status:'未处理'
        },function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        t1 = doc.length;
        Task.find({
            type:'投诉',
            status:'已处理',
            endTime:req.query.endTime
        },function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            t2 = result.length;
            res.send({
                errcode:0,
                data:{
                    unprocessed:t1,
                    processed:t2
                },
                msg:'获取投诉数据成功=_=',
            })
        })
    })
});
/* 获取租户和住户接口 */
router.get('/gethouseholdCompare',function(req,res,next){
    var tenant,houseUser;
    Household.find(
        {
            status:'已租'
        },function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        tenant = doc.length;
        Household.find(
            {
                status:'已购'
            },function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            houseUser = result.length;
            res.send({
                errcode:0,
                data:{
                    tenant: tenant,
                    houseUser: houseUser
                },
                msg:'获取数据成功'
            })
        })   
    })
});

/* 获取近七日投诉和维修信息接口 */
router.get('/getRepiarCompare',function(req,res,next){
    var time = req.query.time;
    var timeData = new Date(time);
    var time1 = timeData.getTime();
    var realTime = time1 - 604800000;
    var lastTime = new Date(realTime);
    var Y = lastTime.getFullYear() + '-';
    var M = (lastTime.getMonth()+1 < 10 ? '0'+(lastTime.getMonth()+1) : lastTime.getMonth()+1) + '-';
    var D = lastTime.getDate() < 10 ? '0'+(lastTime.getDate()) : lastTime.getDate();
    var times = Y+M+D;
    var repairCount,complaintyCount;
    Task.aggregate([
        {$match:{submitTime:{$regex: new RegExp()}}},
        {$group:{_id:'$存时间的那个字段名', total:{$sum:1}}}

    ])
    Task.find(
        {
            status:'已租'
        },function(err,doc){
        if(err){
            res.send({
                errcode:3,
                msg:'数据库错误：'+err.messages
            })
            console.log(err)
            return 
        }
        tenant = doc.length;
        Task.find(
            {
                status:'已购'
            },function(err,result){
            if(err){
                res.send({
                    errcode:3,
                    msg:'数据库错误：'+err.messages
                })
                console.log(err)
                return 
            }
            houseUser = result.length;
            res.send({
                errcode:0,
                data:{
                    tenant: tenant,
                    houseUser: houseUser
                },
                msg:'获取数据成功'
            })
        })   
    })
});

module.exports = router;

