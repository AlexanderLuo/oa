var conf = {}
var user = {}
function error() {
    layer.msg("未知异常")
}

avalon.ready(function () {
    var vm = avalon.define({
        $id: "adminVm",
        tegr_id: 0,   //集团ID
        school_id: 0,//学校ID
        class_id: 0,
        roleList: [{id: 1, name: "教师"}, {id: 8, name: "集团管理员"}],
        sexList: [{id: 0, name: "男"}, {id: 1, name: "女"}],
        selfId: "",


        tegerList2: [{id: 16, name: "管理员"}, {id: 4, name: "专家（客服）"}],
        tegerList: [],
        schoolList: [],

        list: [],


        tegerReq: 0,
        teacherReq: 0,
        schoolReq: 0,
        classReq: 0,
        parentReq: 0,
        studentReq: 0,


        //逻辑
        queryUrl: "",
        queryData: {},
        addUrl: "",
        addData: {},
        revUrl: "",
        revData: {},
        delUrl: "",
        delData: "",
        dataList: [],
        popData: {},
        //控制
        weight: 1,  //权限
        curPage: "",  //当前路由
        checkAllFlag: false,  //全选标志
        pop: false,
        //数据
        pageSize: 10,
        pageNo: 1,
        total: 1,
        records: 0,

        //查看集团下的老师
        tegrName: "",
        schoolName: "",
        className: "",
        isReving: false,

        //查询条件
        teger_search: 0,
        school_search: 0,


        //用户添加
        addName: "",


        addAccount: "",
        addSummary: "",
        //集团添加
        addTegrName: "",
        addAdmin: "",
        adminList: [],
        //学校添加
        addTegr: 0,
        addSchoolName: "",
        addAddr: "",
        addPhone: "",
        addUserName: "", //用户添加
        addOtherName: "",
        parentLock: false,
        addRole: "",
        //添加教师
        addMark: "",
        //添加班级
        addSchoolId: "",
        addClass: "",
        //添加学生
        addBrith: "",
        addParent: "",
        addSex: 0,

        //补充字段
        addTe: "",


        //单词首字母大写
        upperPage: function () {
            var word = vm.curPage.toLowerCase().replace(/\b\w+\b/g, function (word) {
                return word.substring(0, 1).toUpperCase() + word.substring(1);
            });
            return word;
        },
        querytTeg: function (callback) {
            vm.tegerList = []
            $.ajax({
                url: conf.baseUrl + conf.getTegrList,
                type: "post",
                data: {user_id: user.user_id}
            }).done(function (data) {
                var json = eval("(" + data + ")");// 解析json
                if (json.code == 200) {
                    vm.tegerList = json.result;
                    vm.tegr_id = vm.tegerList[0].tegr_id;
                    // layer.msg("加载成功",1,9)
                    callback();
                } else {
                   layer.msg("获取集团列表失败，原因："+json.msg);
                }
            })
        },
        query: function (pageNo) {
            vm.pageNo = pageNo;
            vm.records = 0;
            vm.total = 1;
            vm.checkAllFlag = false;
            vm.queryData.page = pageNo;
            vm.dataList = []
            var path = vm.upperPage();
            $.ajax({url: vm.queryUrl, type: "post", data: vm.queryData}).done(function (data) {
                vm.queryHandle(data, vm["get" + path])
            })
            if (vm.curPage == 'teger') {
                $.ajax({
                    url: conf.baseUrl + conf.queryAdmin,
                    data: {
                        user_id: user.user_id
                    },
                    type: "post"
                }).done(function (data) {
                    vm.queryHandle(data, function (json) {
                        vm.adminList = json.returnObject
                        vm.addAdmin = json.returnObject[0].user_id
                    })
                })
            }
        },
        rev: function () {
            var path = vm.upperPage();
            var check = vm.popData.isLegal();
            console.log(check);
            if (check == true) {
                $.ajax({url: vm.revUrl, type: "post", data: vm.popData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "添加成功" || json.msg == "修改成功") {
                        layer.msg(json.msg,1,9);
                        vm.close();
                        vm.query(1);
                    } else {
                        layer.msg(json.msg);
                    }
                })
            } else if (!check) {
                layer.msg("请填写完整")
            } else {
                layer.msg(check);
            }
        },
        add: function () {
            if (vm.isReving) {
                vm.rev();
                return;
            }
            var path = vm.upperPage();
            var check = vm.popData.isLegal();
            if (check == true) {
                console.log(vm.popData.collecData())
                $.ajax({url: vm.addUrl, type: "post", data: vm.popData.collecData()}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "添加成功" || json.msg == "修改成功") {
                        layer.msg(json.msg,1,9);
                        vm.close();
                        vm.query(1)
                    } else {
                        layer.msg(json.msg);
                    }
                })
            } else if (!check) {
                layer.msg("请填写完整")
            } else {
                layer.msg(check);
            }

        },
        queryHandle: function (data, callback, error) {
            var json = eval("(" + data + ")");// 解析json
            if (json.code == 200) {
                layer.msg("加载成功",1,9)
                callback(json);
            } else {
                layer.msg("加载失败"+json.msg);
            }
        },
        open: function (el) {
            console.log(el)
            vm.pop = vm.curPage;
            vm.isReving = false;
            vm.popData = {
                isLegal: function () {
                },
                collecData: function () {
                }
            }
            var reg = /^1(3|4|5|7|8)\d{9}$/;
            switch (vm.curPage) {
                case 'admin':
                    if (el) {
                        vm.isReving = true
                        vm.addUserName = el.name
                        vm.addOtherName = el.username
                        vm.addTegr = el.role_type
                        vm.addMark = el.remark,
                            vm.popData = {
                                isLegal: function () {
                                    var data = vm.popData.collecData();
                                    if (data.name.trim() == "" || data.username.trim() == "") {
                                        return false;
                                    } else {
                                        if (data.name.length > 12) {
                                            return "姓名超过12字符";
                                        }
                                        if (!reg.test(data.username)) {
                                            console.log(data.username);
                                            console.log(reg.test(data.username));
                                            return "账号请填写正确的电话号码";
                                        } else {
                                            return true;
                                        }
                                    }
                                },
                                collecData: function () {
                                    return {
                                        user_id: el.user_id,
                                        name: vm.addUserName,
                                        username: vm.addOtherName,
                                        role_type: vm.addTegr,
                                        remark: vm.addMark
                                    }
                                }
                            }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.name.trim() == "" || data.username.trim() == "") {
                                    return false;
                                } else {
                                    if (data.name.length > 12) {
                                        return "姓名超过12字符";
                                    }
                                    if (!reg.test(data.username)) {
                                        return "账号请填写正确的电话号码";
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    user_id: el.user_id,
                                    name: vm.addUserName,
                                    username: vm.addOtherName,
                                    role_type: vm.addTegr,
                                    remark: vm.addMark
                                }
                            }
                        }
                    }
                    break;
                case 'teger':
                    if (el) {
                        vm.isReving = true
                        vm.addAdmin = el.user_id
                        vm.addTegrName = el.tegr_name

                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.tegr_name.length > 12) {
                                    return "集团名称超过12字符";
                                }
                                if (data.user_id == 0 || data.tegr_name.trim() == "") {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            collecData: function () {
                                return {
                                    tegr_id: el.tegr_id,
                                    user_id: user.user_id,
                                    tegr_name: vm.addTegrName
                                }
                            }
                        }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.tegr_name.length > 12) {
                                    return "集团名称超过12字符";
                                }
                                if (data.user_id == 0 || data.tegr_name.trim() == "") {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                            collecData: function () {
                                return {
                                    user_id: user.user_id,
                                    tegr_name: vm.addTegrName
                                }
                            }
                        }
                    }
                    break;
                case 'school':
                    if (el) {
                        vm.isReving = true
                        vm.addTegr = el.tegr_id
                        vm.addSchoolName = el.school_name
                        vm.addPhone = el.school_call
                        vm.addUserName = el.school_person
                        vm.addAddr = el.school_address
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.tegr_id == 0 || data.user_id == 0 || data.school_name.trim() == "" ) {
                                    return false;
                                } else {
                                    if (data.school_name.length > 12) {
                                        return "学校名称超过12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                if(vm.weight==2){
                                    vm.addTegr = user.tegr_id;
                                }
                                return {
                                    school_id: el.school_id,
                                    tegr_id: vm.addTegr,
                                    school_name: vm.addSchoolName,
                                    // school_call: vm.addPhone,
                                    // school_person: vm.addUserName,
                                    // school_address: vm.addAddr
                                }
                            }
                        }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.tegr_id == 0 || data.school_name.trim() == "" || data.tegr_id == ""
                                ) {
                                    return false;
                                } else {
                                    if (data.school_name.length > 12) {
                                        return "学校名称超过12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                if(vm.weight==2){
                                    vm.addTegr = user.tegr_id;
                                }
                                return {
                                    tegr_id: vm.addTegr,
                                    school_name: vm.addSchoolName,
                                }
                            }
                        }
                    }
                    break;
                case "teacher":
                    if (el) {
                        vm.isReving = true
                        vm.addUserName = el.username
                        vm.addName = el.name
                        vm.addMark = el.remark;
                        vm.addRole = el.role_type
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.name.trim() == "" || data.username.trim() == "") {
                                    return false;
                                } else {
                                    if (data.name.length > 12) {
                                        return "姓名超过12字符";
                                    }
                                    if (!reg.test(data.username)) {
                                        return "账号请填写正确的电话号码"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    teacher_id: el.teacher_id,
                                    username: vm.addUserName,
                                    name: vm.addName,
                                    role_type: vm.addRole,
                                    remark: vm.addMark
                                }
                            }
                        }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.username.trim() == "" || data.name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.name.length > 12) {
                                        return "姓名超过12字符";
                                    }
                                    if (!reg.test(data.username)) {
                                        return "账号请填写正确的电话号码"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    tegr_id: vm.addTe,
                                    username: vm.addUserName,
                                    name: vm.addName,
                                    role_type: vm.addRole,
                                    remark: vm.addMark
                                }
                            }
                        }
                    }
                    break;
                case "class":
                    if (el) {
                        vm.isReving = true
                        vm.addClass = el.class_name
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.class_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.class_name.length > 12) {
                                        return "班级名称大于12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    class_id: el.class_id,
                                    class_name: vm.addClass,
                                }
                            }
                        }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.class_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.class_name.length > 12) {
                                        return "班级名称大于12字符"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                return {
                                    school_id: vm.school_id,
                                    class_name: vm.addClass,
                                }
                            }
                        }
                    }
                    break;
                case "student":
                    if (el) {
                        vm.isReving = true
                        vm.addName = el.child_name
                        vm.addSex = el.child_sex
                        vm.addBrith = new Date(el.child_birthday).Format("yyyy-MM-dd")
                        vm.addParent = el.name
                        vm.addPhone = el.username

                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                var date = new Date();
                                if (data.child_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.child_name.length > 12) {
                                        return "学生姓名超过12字符";
                                    } else if (date < data.child_birthday) {
                                        return "所选生日不得大于当前时间";
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                var ti = new Date(vm.addBrith).getTime();
                                return {
                                    child_id:el.child_id,
                                    tegr_id: vm.tegr_id,
                                    school_id: vm.school_id,
                                    class_id: vm.class_id,
                                    child_name: vm.addName,
                                    child_sex: vm.addSex,
                                    child_birthday: ti,
                                    name: vm.addParent,
                                    username: vm.addPhone
                                }
                            }
                        }

                    } else {
                        vm.popData = {
                            isLegal: function () {
                                var date = new Date();
                                var data = vm.popData.collecData();
                                if (data.child_name.trim() == "") {
                                    return false;
                                } else {
                                    if (data.child_name.length > 12) {
                                        return "学生姓名超过12字符"
                                    } else if (date < data.child_birthday) {
                                        return "所选生日不得大于当前时间";
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                var ti = new Date(vm.addBrith).getTime();
                                console.log(ti);
                                return {
                                    tegr_id: vm.tegr_id,
                                    school_id: vm.school_id,
                                    class_id: vm.class_id,
                                    child_name: vm.addName,
                                    child_sex: vm.addSex,
                                    child_birthday: ti,
                                    name: vm.addParent,
                                    username: vm.addPhone

                                }
                            }
                        }
                    }
                    break;
                case "parent":
                    if (el) {
                        vm.isReving = true;
                        vm.addName = el.name;
                        vm.addUserName = el.username;
                        vm.addMark = el.remark;
                        vm.popData = {
                            isLegal: function () {
                                var data = vm.popData.collecData();
                                if (data.name.trim() == "" || data.username.trim() == "") {
                                    return false;
                                } else {
                                    if (data.name.length > 12) {
                                        return "姓名超过12字符";
                                    }
                                    if (!reg.test(data.username)) {
                                        return "账号请填写正确的电话号码"
                                    } else {
                                        return true;
                                    }
                                }
                            },
                            collecData: function () {
                                var ti = new Date(vm.addBrith).getTime();
                                return {
                                    parent_id: el.parent_id,
                                    name: vm.addName,
                                    username: vm.addUserName,
                                    remark: vm.addMark,
                                }
                            }
                        }

                    }
                    break;
            }


        },
        getAdmin: function (json) {
            var li = json.returnObject.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.records = json.returnObject.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            vm.dataList = li;
        },
        getTeger: function (json) {
            var li = json.result.list;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.dataList = li;
        },

        getTeacher: function (json) {
            vm.teacherReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            var li = json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })

            vm.dataList = li;

        },
        getSchool: function (json) {
            vm.schoolReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)

            var li = json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.dataList = li
        },
        getClass: function (json) {
            vm.classReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            var li = json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.dataList = li
        },
        getParent: function (json) {
            vm.parentReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            var li = json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.dataList = li
        },
        getStudent: function (json) {
            vm.studentReq = json.result.last_req_time;
            vm.records = json.result.total_count;
            vm.total = Math.ceil(vm.records / vm.pageSize)
            var li = json.result.list;
            li.forEach(function (p1, p2, p3) {
                p1.check = false;
            })
            vm.dataList = li
        },
        //全选
        checkAll: function () {
            vm.checkAllFlag = !vm.checkAllFlag
            vm.dataList.forEach(function (el) {
                el.check = vm.checkAllFlag;
            })
        },
        //单选
        checkOne: function (el) {
            el.check = !el.check;
            var no = vm.dataList.filter(function (al) {
                return al.check == false;
            })
            if (no.length == 0) {
                vm.checkAllFlag = true
            }
            if (no.length > 0) {
                vm.checkAllFlag = false
            }

        },
        router: function (str) {
            vm.dataList = [];
            vm.checkAllFlag = false;
            vm.curPage = str;
            vm.addUrl = "";
            vm.addTegr = 0;
            vm.addName = "";
            vm.addParent = "";
            vm.addSex = "";
            vm.addBrith = "";
            if(vm.weight == 3) {
                vm.tegr_id = vm.tegerList[0].tegr_id;
                vm.teger_search = vm.tegerList[0].tegr_id
            }else {
                vm.tegr_id = user.tegr_id;
                vm.teger_search = user.tegr_id;
            }


            var path = vm.upperPage();
            var c = conf;
            var b = c.baseUrl;
            vm.addUrl = b + c["add" + path]
            vm.delUrl = b + c["del" + path]
            vm.revUrl = b + c["rev" + path]
            vm.queryUrl = b + c["query" + path]

            vm.pageAdapter();
            if (vm.curPage != 'parent') {
                vm.query(1);
            }
        },
        pageAdapter: function (str) {
            vm.queryData = {}
            if (!str) {
                switch (vm.curPage) {
                    case "admin":
                        vm.queryData = {
                            user_id: user.user_id,
                            last_req_time: 0,
                            page: vm.pageNo,
                            page_size: vm.pageSize
                        }
                        break;
                    case "teger":
                        vm.queryData = {
                            user_id: user.user_id,
                            degr_id: vm.degr_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.tegerReq
                        }
                        break;
                    //todo 配置tegr ID
                    case "teacher":
                        // console.log(vm.addTe)
                        if(vm.weight==2){
                            vm.addTe = user.tegr_id;
                        }
                        vm.queryData = {
                            user_id: user.user_id,
                            tegr_id: vm.addTe,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.teacherReq
                        };
                        break;
                    //todo 配置tegr ID
                    case "school":
                        if(vm.weight == 3){
                        vm.querytTeg();
                        }
                        vm.queryData = {
                            tegr_id: vm.teger_search,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.schoolReq
                        }
                        break;
                    case "class":
                        vm.queryData = {
                            tegr_id: vm.tegr_id,
                            school_id: vm.school_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.classReq
                        }
                        break;
                    //todo 配置tegr ID
                    case "parent":
                        $.ajax({
                            url: conf.baseUrl + conf.querySchool,
                            type: "post",
                            data: {
                                tegr_id: vm.teger_search,
                                page: 1,
                                page_size: 800,
                                last_req_time: 0
                            }
                        }).done(function (data) {
                            vm.queryHandle(data, function (json) {
                                vm.schoolList = json.result.list;
                                vm.school_search = json.result.list[0].school_id
                                vm.queryData = {
                                    tegr_id: vm.teger_search,
                                    school_id: vm.school_search,
                                    page: vm.pageNo,
                                    page_size: vm.pageSize,
                                    last_req_time: vm.parentReq
                                }
                                vm.query(1)
                            })
                        })
                        break;
                    case "student":
                        vm.queryData = {
                            class_id: vm.class_id,
                            school_id: vm.school_id,
                            page: vm.pageNo,
                            page_size: vm.pageSize,
                            last_req_time: vm.studentReq
                        }
                        break;
                }
            }
        },
        //关掉
        close: function () {
            vm.pop = false;
            vm.isReving = false;
            vm.addUserName = ""
            vm.addOtherName = ""
            vm.addTegr = 0;
            vm.addName = "";
            vm.addParent = "";
            vm.addSex = "";
            vm.addBrith = "";
            vm.addAccount = ""
            vm.addParent = "";
            vm.addSummary = ""
            vm.addRole = ""
            //集团添加
            vm.addTegrName = ""
            vm.addAdmin = ""
            //学校添加
            vm.addTegr = ""
            vm.addSchoolName = ""
            vm.addAddr = ""
            vm.addPhone = ""
            vm.addUserName = ""//用户添加
            vm.addOtherName = ""
            vm.addMark = ""
            if (vm.curPage != 'teacher') {
                vm.addTe = ""
            }
            vm.addClass = ""
        },
        delPop: function () {
                vm.del();
        },
        del: function () {
            var ids = ""
            var li = []
            var idKey = ""
            var task

            switch (vm.curPage) {
                case "admin":
                    idKey = "user_id"
                    for (var a = 0; a < vm.dataList.length; a++) {
                        if (vm.dataList[a].check == true) {
                            if (vm.dataList[a][idKey] != vm.selfId) {
                                li.push(vm.dataList[a][idKey])
                            }
                        }
                    }
                    for (var b = 0; b < li.length; b++) {
                        ids = ids + li[b]
                        if (b != li.length - 1) {
                            ids = ids + ","
                        }
                        vm.delData = {
                            delete_user_id: ids,
                            user_id: user.user_id
                        }
                    }
                    task = function () {
                        vm.delData.delete_user_id = ids;
                    }
                    break;
                case "teger":
                    vm.delData = {
                        delete_tegr_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "tegr_id"
                    task = function () {
                        vm.delData.delete_tegr_id = ids;
                    }
                    break;
                case "teacher":
                    vm.delData = {
                        delete_user_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "user_id"
                    task = function () {
                        vm.delData.delete_user_id = ids;
                    }
                    break;
                case "school":
                    vm.delData = {
                        delete_school_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "school_id"
                    task = function () {
                        vm.delData.delete_school_id = ids;
                    }
                    break;

                case "class":
                    vm.delData = {
                        delete_class_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "class_id"
                    task = function () {
                        vm.delData.delete_class_id = ids;
                    }
                    break;
                case "parent":
                    vm.delData = {
                        delete_user_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "user_id"
                    task = function () {
                        vm.delData.delete_user_id = ids;
                    }
                    break;
                case "student":
                    vm.delData = {
                        delete_child_id: ids,
                        user_id: user.user_id
                    }
                    idKey = "child_id"
                    task = function () {
                        vm.delData.delete_child_id = ids;
                    }
                    break;
            }

            for (var a = 0; a < vm.dataList.length; a++) {
                if (vm.dataList[a].check == true) {
                    li.push(vm.dataList[a][idKey])
                }
            }
            for (var b = 0; b < li.length; b++) {
                ids = ids + li[b]
                if (b != li.length - 1) {
                    ids = ids + ","
                }
            }
            task();

            if (ids == "") {
                layer.closeAll()
                layer.msg("请选择删除项")
                return ;
            }
            var path = vm.upperPage();
            layer.confirm("确定删除吗？", function () {
                $.ajax({url: vm.delUrl, type: "post", data: vm.delData}).done(function (data) {
                    var json = eval("(" + data + ")")
                    if (json.msg == "删除成功" || json.msg == "成功") {
                        layer.msg("操作成功",1,9);
                        vm.query(1);
                        layer.close();
                    } else {
                        layer.msg("操作失败," + json.msg);
                    }
                })
            }, layer.closeAll())

        },
        seeTeacher: function (el) {
            vm.addTe = el.tegr_id
            vm.tegrName = el.tegr_name
            vm.router('teacher')
        },
        seeClass: function (el) {
            vm.tegr_id = el.tegr_id
            vm.school_id = el.school_id
            vm.schoolName = el.school_name
            vm.router('class')
        },
        seeStudent: function (el) {
            vm.class_id = el.class_id
            vm.className = el.class_name
            vm.school_id = el.school_id;
            vm.router('student')
        },
        init: function () {
            var userr = getLocalValue('user');
            if (userr == null) {
                location.href = "/oa/login.html";
            }
            user = userr;
            var ty = user.role_type;
            vm.selfId = user.user_id;
            if (ty == "8") {
                vm.weight = 2
            }
            else if (ty == "16" || ty == "32") {
                vm.weight = 3
            } else {
                vm.weight = 1
            }
            $.ajax({
                url: "/oa/conf/config.json",
                // success: function(res){
                //     conf=res
                //     vm.router("device")
                //     vm.querytTeg()
                // },
                complete: function (res) {
                    conf = eval("(" + res.responseText + ")")
                        if (vm.weight == 2) {
                            vm.roleList = [{id: 1, name: "教师"}];
                            vm.router('teacher')
                        }
                        if (vm.weight == 3) {
                            vm.querytTeg(function () {
                                vm.router('admin')
                            })
                        }
                        if (vm.weight == 1) {
                            vm.router('school')
                        }
                    }



            });


        }
    })


    avalon.scan()
    vm.init();

    avalon.filters.roleTypeFilter = function (value, args, args2) {
        var str = "";
        switch (value) {
            case 1:
                str = "教师";
                break;
            case  2:
                str = "家长";
                break;
            case  4:
                str = "专家（客服）";
                break;
            case  8:
                str = "集团组长";
                break;
            case  16:
                str = "管理员";
                break;
            case  32:
                str = "超级管理员";
                break;
        }
        return str;
    }

    avalon.filters.sexxFilter = function (str) {
        if (str == 1 || str == '1') {
            return "女"
        }
        else return "男"
    }


    vm.$watch("teger_search", function (data) {
        vm.queryData.tegr_id = data;
        if (vm.curPage == 'parent') {
            vm.dataList = []
            vm.querytTeg(function () {
                $.ajax({
                    url: conf.baseUrl + conf.querySchool,
                    type: "post",
                    data: {
                        tegr_id: data,
                        page: 1,
                        page_size: 800,
                        last_req_time: 0
                    }
                }).done(function (data) {
                    var json = eval("(" + data + ")");// 解析json
                    if (json.code == 200) {
                        vm.schoolList = json.result.list;
                        vm.school_search = json.result.list[0].school_id || "请选择"
                    }
                })
            });
        }
        if (vm.curPage == 'school') {
            vm.queryData.tegr_id = data;
            vm.query(1)

        }
    })
    vm.$watch("school_search", function (data) {
        vm.queryData.school_id = data;
        if (vm.curPage == 'parent') {
            vm.query(1)
        } else {
            vm.query(1)
        }
    })


})