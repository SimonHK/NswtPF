var printData = null;

//----------------打印调用方法（打印数据、模板）
//----------------除默认打印，调用自定义打印模板，需要根据店铺设置来处理打印数据，即店铺可设置自有的打印模板
//----------------打印数据：pfData,配置数据:configData
function test_pushprintData(spfData, sconfig, ptype) {

    //打印时间、销售时间的转换
    var date = new Date();
    var year = date.getFullYear();//当前年份
    var month = date.getMonth();//当前月份
    var data = date.getDate();//天
    var hours = date.getHours();//小时
    var minute = date.getMinutes();//分
    var second = date.getSeconds();//秒
    var time = year + "/" + fnW((month + 1)) + "/" + fnW(data) + " " + fnW(hours) + ":" + fnW(minute) + ":" + fnW(second);

    var pfData = JSON.parse(spfData);
    var config = JSON.parse(sconfig);
    if (config && config.cof && config.cof.sv_uc_dayin) {
        var PrintConfig = JSON.parse(config.cof.sv_uc_dayin);
        if (PrintConfig != '[]' && PrintConfig != "" && PrintConfig != null) {
            ptype = PrintConfig.xiaopiao == 58 ? 0 : 1;
        }
    }
    if (config && config.cof && config.cof.sv_pfconfig && config.cof.sv_pfconfig.length > 10) {
        try {
            var configData = JSON.parse(config.cof.sv_pfconfig);
            var postData = {
                //-------------头部数据-----------------
                "HeaderList": [],
                //-------------中部数据-----------------
                "BodyList": [],
                //-------------标题数据-----------------
                "TitleList": [],
                //-------------页脚数据-----------------
                "FooterList": [
                ],
                //-------------店铺logo数据-----------------
                "LogoData": null,
                //-------------二维码数据-----------------
                "QRCodeData": null,
                //-----------------1：打印，0：预览-----------------
                "Action": 1,
                //-----------------0:58mm,1:80mm-----------------
                "PageType": ptype
            };

            var h_config = configData.h.split(','); //读取"0,0,0,0,0,0,0"的开关配置
            var t_config = configData.b.split(',');
            var b_config = pfData.content;
            var f_config = configData.f.split(',');
            var q_config = configData.q;
            var l_config = configData.l;
            if (h_config && h_config.length > 0) {
                if (h_config.length > 0 && h_config[0] == 1)
                    postData.HeaderList.push({ "Content": convertString(config.user.sv_us_name), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                if (h_config.length > 1 && h_config[1] == 1) {
                    //取手机号码
                    postData.HeaderList.push({ "Content": "微信" + convertString(config.user.sv_ul_mobile), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                }
                // if (h_config.length > 2 && h_config[2] == 1)
                //postData.HeaderList.push({ "Content":  (new Date()).Format("yyyy.MM.dd hh:mm:ss"), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                //if (h_config.length > 3 && h_config[3] == 1)
                //postData.HeaderList.push({ "Content": "Post机号：" , "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 4 && h_config[4] == 1)
                    postData.HeaderList.push({ "Content": "单号：" + convertString(pfData.order_running_id), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                if (h_config.length > 5 && h_config[5] == 1)
                    postData.HeaderList.push({ "Content": "收银员：" + pfData.userinfo.operator, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 6 && h_config[6] == 1)
                    postData.HeaderList.push({ "Content": "会员姓名：" + pfData.userinfo.sv_mr_name, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 7 && h_config[7] == 1)
                    postData.HeaderList.push({ "Content": "会员卡号：" + pfData.userinfo.sv_mr_cardno, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                postData.HeaderList.push({ "Content": "......................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });


            }

            if (t_config && t_config.length > 0) {
                var _t = "";
                if (t_config.length > 0 && t_config[0] == 1) {
                    _t += "商品      ";
                    postData.TitleList.push({
                        "Content": "商品  ",
                        "Columns": 1,
                        "RowNum": 1,
                        "RowMaxLength": 10,
                        "Align": 1,
                        "TextFont": 0,
                        "Width": 10
                    });
                }
                if (t_config.length > 2 && t_config[2] == 1) {
                    _t += "礼品      ";
                    postData.TitleList.push({ "Content": "礼品", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 10 });
                }
                if (t_config.length > 1 && t_config[1] == 1) {
                    _t += "   单价    ";
                    postData.TitleList.push({ "Content": "单价", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 });
                }

                if (t_config.length > 3 && t_config[3] == 1) {
                    _t += "   积分    ";
                    postData.TitleList.push({ "Content": "积分", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 });
                }

                if (t_config.length > 4 && t_config[4] == 1) {
                    _t += "数量 ";
                    postData.TitleList.push({ "Content": "数量", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 4 });
                }
                if (t_config.length > 5 && t_config[5] == 1) {
                    _t += "小计 ";
                    postData.TitleList.push({ "Content": "小计", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 });
                }
                if (t_config.length > 6 && t_config[6] == 1) {
                    _t += "合计 ";
                    postData.TitleList.push({ "Content": "合计", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 });
                }
                postData.HeaderList.push({ "Content": _t, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

            }
            var product_number = 0;
            if (b_config && b_config.length > 0) {
                for (var i = 0; i < b_config.length; i++) {
                    var b_str = "";
                    if (b_config[i].product != undefined && t_config.length > 0 && t_config[0] == 1)
                        b_str = b_config[i].product + ",";
                    if (b_config[i].sv_name != undefined && t_config.length > 2 && t_config[2] == 1)
                        b_str += b_config[i].sv_name + ",";
                    if (b_config[i].unitPrice != undefined && t_config.length > 1 && t_config[1] == 1)
                        b_str += b_config[i].unitPrice + ",";
                    if (b_config[i].sv_integral != undefined && t_config.length > 3 && t_config[3] == 1)
                        b_str += b_config[i].sv_integral + ",";
                    if (b_config[i].sv_number != undefined && t_config.length > 4 && t_config[4] == 1) {
                        b_str += b_config[i].sv_number + ",";
                        product_number += parseInt(b_config[i].sv_number);
                    }
                    if (b_config[i].subtotal != undefined && t_config.length > 5 && t_config[5] == 1)
                        b_str += b_config[i].subtotal + ",";
                    if (b_config[i].sumintegral != undefined && t_config.length > 6 && t_config[6] == 1)
                        b_str += b_config[i].sumintegral + ",";
                    b_str = b_str.replace(/,$/gi, "");
                    postData.BodyList.push({ "Content": b_str, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                }
            }
            if (f_config && f_config.length > 0) {
                postData.FooterList.push({ "Content": "......................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 1 && f_config[1] == 1)
                    postData.FooterList.push({ "Content": "礼品总数： " + product_number, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 2 && f_config[2] == 1)
                    // postData.FooterList.push({ "Content": "金额合计： ¥ " + pfData.order_receivable, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                    //if (f_config.length > 3 && f_config[3] == 1)
                    // postData.FooterList.push({ "Content": "优惠金额：¥ " + pfData.DiscountAmount, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    if (f_config.length > 4 && f_config[4] == 1)
                        postData.FooterList.push({ "Content": "储值余额：¥ " + pfData.userinfo.sv_mw_availableamount, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                //if (f_config.length > 5 && f_config[5] == 1)
                //postData.FooterList.push({ "Content": "剩余次数：" + pfData.RemainingNumber, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                //if (f_config.length > 6 && f_config[6] == 1)
                //postData.FooterList.push({ "Content": "累计欠款：" + pfData.CumulativeArrears, "Columns": 2, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (f_config.length > 7 && f_config[7] == 1)
                    postData.FooterList.push({ "Content": "支付方式：积分兑换", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 8 && f_config[8] == 1)
                    postData.FooterList.push({ "Content": "积分（本次/剩余）：" + pfData.Finfo.remaining_integral, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 9 && f_config[9] == 1)
                    postData.FooterList.push({ "Content": "销售时间：" + time, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (f_config.length > 10 && f_config[10] == 1)
                    postData.FooterList.push({ "Content": "电话：" + convertString(config.user.sv_us_phone), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 11 && f_config[11] == 1)
                    postData.FooterList.push({ "Content": "地址：" + convertString(config.user.sv_us_address), "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });


                postData.FooterList.push({ "Content": "打印时间：" + time, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                postData.FooterList.push({ "Content": "谢谢惠顾，欢迎下次光临", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            }
            //打印店铺二维码
            if (q_config && q_config.ImageString) {
                postData.FooterList.push({ "Content": "二维码", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                postData.QRCodeData = q_config;
            }

            //打印店铺扩展信息
            PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_ExtraInfo");
            if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                var extra_info = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                if (extra_info) {
                    if (extra_info.toLowerCase.indexOf('<br/>') > 0) {
                        var extra_infos = extra_info.split('<br/>');
                        for (var i = 0; i < extra_infos.length; i++) {
                            postData.FooterList.push({ "Content": extra_infos[i], "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                        }
                    } else {
                        postData.FooterList.push({ "Content": extra_info, "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    }
                }
            }


            postData.FooterList.push({ "Content": "—————————————————————————————-", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            if (l_config && l_config.ImageString) {
                postData.FooterList.push({ "Content": "", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (l_config.ImageString.indexOf("http") > 0) {
                    postData.LogoData = l_config;
                } else {
                    l_config.ImageString = "http://decerp.cc" + l_config.ImageString
                    postData.LogoData = l_config;
                }
            }
            postData.FooterList.push({ "Content": "..........................................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            //Cef.openMyPc(JSON.stringify(data2), JSON.stringify(configData), 0);
            //------------待扩展，数据注入、校验

            Cef.CustormPrint(JSON.stringify(postData), '' + receptionPtNum + '', receptionPtName);

        } catch (e) {
        }
    } else {
        layer.msg("礼品小票打印只支持自定义积分打印模板");
    }
}
//totalAmount应收总金额 deserved活动积分赠送现金优惠 givingtype 1积分类型，2减免丶赠送金额
function pushprintData(spfData, sconfig, ptype, totalAmount, deserved, givingtype) {
    //打印时间、销售时间的转换
    var date = new Date();
    var year = date.getFullYear();//当前年份
    var month = date.getMonth();//当前月份
    var data = date.getDate();//天
    var hours = date.getHours();//小时
    var minute = date.getMinutes();//分
    var second = date.getSeconds();//秒
    var time = year + "/" + fnW((month + 1)) + "/" + fnW(data) + " " + fnW(hours) + ":" + fnW(minute) + ":" + fnW(second);
    var pfData = JSON.parse(spfData);
    var config = JSON.parse(sconfig);
    var strptype = 0;
    if (config && config.cof && config.cof.sv_uc_dayin) {
        var PrintConfig = JSON.parse(config.cof.sv_uc_dayin);
        if (PrintConfig != '[]' && PrintConfig != "" && PrintConfig != null) {
            strptype = PrintConfig.xiaopiao == 58 ? 0 : 1;
            if (PrintConfig.xiaopiao == 58) {
                strptype = 0;
            }
            else if (PrintConfig.xiaopiao == 80) {
                strptype = 1;
            }
            else if (PrintConfig.xiaopiao == 210) {
                strptype = 2;
            }
            else {
                strptype = 0;
            }
        }
    }
    if (config && config.cof && config.cof.sv_pfconfig && config.cof.sv_pfconfig.length > 10) {
        try {
            var Ismember;
            if (pfData.user.sv_mr_cardno) {
                Ismember = isNullOrWhiteSpace(pfData.user.sv_mr_cardno);//判断是否是会员 
            }
            var theintegral = 0;//本次积分
            var money = pfData.order_receivable;//钱，默认合计
            var ratiointegral = 1;//比例积分
            var integral = "";//积分(本次/累计积分)
            var sv_mw_availablepoint = 0;//累计积分
            var pointtocashset = "";//消费积分
            var preferentialMoney = 0;//优惠金额
            if (Ismember) {
                if (config.cof.sv_uc_pointtocashset != '[]' && config.cof.sv_uc_pointtocashset != "" && config.cof.sv_uc_pointtocashset != null)
                { pointtocashset = JSON.parse(config.cof.sv_uc_pointtocashset); }
                if (pointtocashset != '[]' && pointtocashset != "" && pointtocashset != null) {
                    money = pointtocashset[0];
                    ratiointegral = pointtocashset[1];
                }
                theintegral = parseInt(pfData.order_receivable / money * ratiointegral);
                sv_mw_availablepoint = pfData.user.sv_mw_availablepoint;
                integral = theintegral + "/ " + sv_mw_availablepoint;
                if (givingtype == 1 && givingtype > 0) {
                    integral = integral + "(含活动消费赠送" + deserved + "积分)";
                }
                preferentialMoney = parseInt((totalAmount - pfData.order_receivable) * 100) / 100 + "";
            }
            if (givingtype == 2) {
                preferentialMoney = preferentialMoney == 0 ? deserved + "(活动消费减免" + deserved + "元)" : preferentialMoney + "(含活动消费减免" + deserved + "元)";

            }
            var configData = JSON.parse(config.cof.sv_pfconfig);
            var postData = {
                //-------------头部数据-----------------
                "HeaderList": [],
                //-------------中部数据-----------------
                "BodyList": [],
                //-------------标题数据-----------------
                "TitleList": [],
                //-------------页脚数据-----------------
                "FooterList": [
                ],
                //-------------店铺logo数据-----------------
                "LogoData": null,
                //-------------二维码数据-----------------
                "QRCodeData": null,
                //-----------------1：打印，0：预览-----------------
                "Action": 1,
                //-----------------0:58mm,1:80mm-----------------
                "PageType": strptype,
                "PagePadding": 0
            };
            var h_config = configData.h.split(','); //读取"0,0,0,0,0,0,0"的开关配置
            var t_config = configData.b.split(',');
            var b_config = pfData.prlist;
            var f_config = configData.f.split(',');
            var q_config = configData.q;
            var l_config = configData.l;
            if (h_config && h_config.length > 0) {
                if (h_config.length > 0 && h_config[0] == 1)
                    postData.HeaderList.push({ "Content": convertString(config.user.sv_us_name), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                if (h_config.length > 1 && h_config[1] == 1) {
                    //取手机号码
                    postData.HeaderList.push({ "Content": "微信" + convertString(config.user.sv_ul_mobile), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                }
                //if (h_config.length > 2 && h_config[2] == 1)
                //postData.HeaderList.push({ "Content":  (new Date()).Format("yyyy.MM.dd hh:mm:ss"), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                //if (h_config.length > 3 && h_config[3] == 1) 
                //postData.HeaderList.push({ "Content": "Post机号：" , "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 4 && h_config[4] == 1)
                    postData.HeaderList.push({ "Content": "单号：" + convertString(pfData.order_running_id), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (h_config.length > 5 && h_config[5] == 1)
                    postData.HeaderList.push({ "Content": "收银员：" + sv_current_operato, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 6 && h_config[6] == 1 && Ismember)
                    postData.HeaderList.push({ "Content": "会员姓名：" + pfData.user.sv_mr_name, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (h_config.length > 7 && h_config[7] == 1 && Ismember)
                    postData.HeaderList.push({ "Content": "会员卡号：" + pfData.user.sv_mr_cardno, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (strptype < 2)
                {
                    if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
                        postData.HeaderList.push({ "Content": "......................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    } else
                    {
                        postData.HeaderList.push({ "Content": "..........................................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    }
                }
            }

            var StrWidth = 0;
            var PagePadding = 0;
            if (strptype == 1) {//80mm
                StrWidth = 3;
                PagePadding = 5;
            } else if (strptype == 2)//A4 210mm
            {
                StrWidth = 10;
                PagePadding = 20;				
				postData.PagePadding = PagePadding;
            }
            if (t_config && t_config.length > 0) {
                var _t = "";
                if (t_config.length > 0 && t_config[0] == 1) {

                    if (strptype == 1) {
                        _t += "商品              ";
                    }
                    else {
                        _t += "商品     ";
                    }
                    postData.TitleList.push({
                        "Content": "商品",
                        "Columns": 1,
                        "RowNum": 1,
                        "RowMaxLength": 10,
                        "Align": 1,
                        "TextFont": 0,
                        "Width": 10 + StrWidth
                    });
                }

                if (t_config.length > 2 && t_config[2] == 1) {
                    if (strptype == 1) {
                        _t += "礼品              ";
                    }
                    else {
                        _t += "礼品     ";
                    }
                    postData.TitleList.push({ "Content": "礼品", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 10 + StrWidth });
                }

                if (t_config.length > 1 && t_config[1] == 1) {
                    _t += "   单价    ";
                    postData.TitleList.push({ "Content": "单价", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 + StrWidth });
                }

                if (t_config.length > 3 && t_config[3] == 1) {
                    _t += "   积分    ";
                    postData.TitleList.push({ "Content": "积分", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 + StrWidth });
                }


                if (t_config.length > 4 && t_config[4] == 1) {
                    if (strptype == 1) {
                        _t += "数量     ";
                    }
                    else {
                        _t += "数量 ";
                    }
                    postData.TitleList.push({ "Content": "数量", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 4 + StrWidth });
                }

                if (t_config.length > 5 && t_config[5] == 1) {
                    _t += "小计 ";
                    postData.TitleList.push({ "Content": "小计", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 + StrWidth });
                }

                if (t_config.length > 6 && t_config[6] == 1) {
                    _t += "合计 ";
                    postData.TitleList.push({ "Content": "合计", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 1, "Width": 5 + StrWidth });
                }
                if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
                } else {
                    postData.HeaderList.push({ "Content": _t, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                }

            }
            var product_num = 0;//商品总数
            if (b_config && b_config.length > 0) {
                var meter_goods = [];//次卡商品 
                for (var i = 0; i < b_config.length; i++) {
                    product_num += b_config[i].product_num;
                    if (b_config[i].type == true) {
                        //次卡消费
                        var b_str = b_config[i].product_name + "," + b_config[i].product_num + ",-" + b_config[i].product_num + "," + (b_config[i].cnum - b_config[i].product_num);
                        meter_goods.push({ "Content": b_str, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    } else {
                        //普通消费
                        var b_str = b_config[i].product_name + "," + b_config[i].product_unitprice + "," + b_config[i].product_num + "," + b_config[i].product_total;
                        postData.BodyList.push({ "Content": b_str, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    }
                }

                if (meter_goods && meter_goods.length > 0) {
                    var b_str = "项目,次数,实扣,剩余";
                    postData.BodyList.push({ "Content": b_str, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                    for (var j = 0; j < meter_goods.length; j++) {
                        postData.BodyList.push(meter_goods[j]);
                    }
                }
            }
            if (f_config && f_config.length > 0) {
                if (strptype < 2)
                {
                    if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android) {
                        postData.FooterList.push({ "Content": "............................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    } else
                    {
                        postData.FooterList.push({ "Content": "..........................................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    }
                }
                if (f_config.length > 1 && f_config[1] == 1)
                    postData.FooterList.push({ "Content": "商品总数： " + product_num, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 2 && f_config[2] == 1)
                    postData.FooterList.push({ "Content": "金额合计： ¥ " + pfData.order_receivable, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 3 && f_config[3] == 1 && (Ismember || (typeof preferentialMoney == "string" && preferentialMoney.indexOf("活动") >= 0)))
                    postData.FooterList.push({ "Content": "优惠金额：¥ " + preferentialMoney, "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });


                if (f_config.length > 4 && f_config[4] == 1 && Ismember)
                    postData.FooterList.push({ "Content": "储值余额：¥ " + pfData.user.sv_mw_availableamount, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                //if (f_config.length > 4 && f_config[4] == 1 && Ismember)
                //postData.FooterList.push({ "Content": "剩余次数：", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                //if (f_config.length > 5 && f_config[5] == 1)
                //postData.FooterList.push({ "Content": "累计欠款：¥ 200", "Columns": 2, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (f_config.length > 7 && f_config[7] == 1) {
                    var order_payment = pfData.order_payment;
                    if (isNullOrWhiteSpace(pfData.order_payment2) && (pfData.order_payment2.indexOf("待") < 0 || pfData.order_payment2 != "待收")) {
                        order_payment = order_payment + "(" + pfData.order_money + ")/" + pfData.order_payment2 + "(" + pfData.order_money2 + ")";
                    }
                    postData.FooterList.push({ "Content": "支付方式：" + order_payment + " ", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                }
                if (f_config.length > 8 && f_config[8] == 1 && Ismember)
                    postData.FooterList.push({ "Content": "积分（本次/累计）：" + integral, "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 9 && f_config[9] == 1)
                    postData.FooterList.push({ "Content": "销售时间：" + time, "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                if (f_config.length > 10 && f_config[10] == 1)
                    postData.FooterList.push({ "Content": "电话：" + convertString(config.user.sv_us_phone), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                if (f_config.length > 11 && f_config[11] == 1)
                    postData.FooterList.push({ "Content": "地址：" + convertString(config.user.sv_us_address), "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });


                //postData.FooterList.push({ "Content": "打印时间：" + (new Date()).Format("yyyy.MM.dd hh:mm:ss"), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                postData.FooterList.push({ "Content": "谢谢惠顾，欢迎下次光临", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            }
            if (q_config && q_config.ImageString) {
                postData.FooterList.push({ "Content": "二维码", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                postData.QRCodeData = q_config;
            }


            if (strptype < 2) {
                postData.FooterList.push({ "Content": "—————————————————————————————-", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            }
            if (l_config && l_config.ImageString) {
                if (l_config.ImageString.indexOf("http") >= 0) {
                    postData.LogoData = l_config;
                    postData.FooterList.push({ "Content": "", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                } else {
                    l_config.ImageString = "http://decerp.cc" + l_config.ImageString
                    postData.LogoData = l_configpostData.FooterList.push({ "Content": "", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                }
            }
            if (strptype < 2) {
                //postData.FooterList.push({ "Content": "..........................................................", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
            }

            //A4纸张类型重新排版<<<3列布局<<<居左布局
            if (strptype == 2) {
                //3列布局
                if (postData && postData.HeaderList && postData.HeaderList.length > 0) {
                    var columnsStart = 1;
                    //排除第一个和最后一个列
                    for (var i = 1; i < postData.HeaderList.length - 1; i++) {
                        if (columnsStart > 3)
                            columnsStart = 1;
                        postData.HeaderList[i].Align = 0;
                        postData.HeaderList[i].Columns = columnsStart;
                        columnsStart++;
                    }
                }
                //3列布局
                if (postData && postData.FooterList && postData.FooterList.length > 0) {
                    var columnsStart = 1;
                    //排除第一个和最后一个列
                    for (var i = 0; i < postData.FooterList.length - 1; i++) {
                        if (columnsStart > 3)
                            columnsStart = 1;
                        postData.FooterList[i].Columns = columnsStart;
                        columnsStart++;
                    }
                }

            }

            //打印店铺扩展信息
            PreferentialTopUpGivingConfigList("PrintSeting", "PrintSet_ExtraInfo");

            if (Preferential_TopUpGiving_ConfigList != null && Preferential_TopUpGiving_ConfigList.length > 0) {
                var extra_info = Preferential_TopUpGiving_ConfigList[0].sv_detail_value;
                if (extra_info) {
                    if (extra_info.toLowerCase().indexOf('<br/>') > 0) {
                        var extra_infos = extra_info.split('<br/>');
                        for (var i = 0; i < extra_infos.length; i++) {
                            postData.FooterList.push({ "Content": extra_infos[i], "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                        }
                    } else {
                        postData.FooterList.push({ "Content": extra_info, "Columns": 1, "RowNum": 2, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });
                    }
                }
            }

            //Cef.openMyPc(JSON.stringify(data2), JSON.stringify(configData), 0);
            //------------待扩展，数据注入、校验
            // 前台打印
            if (parseInt(receptionPtNum) > 0 && receptionPtName != null && receptionPtName != '') {
                //是否Windows客户端环境
                if (((typeof Cef) !== 'undefined')) {
                    if (printSet_network_device_font_islabel) { // 前台标签打印机是否启用    
                        if (b_config && b_config.length > 0) {
                            var order_no = 0;
                            for (var ii = 0; ii < b_config.length; ii++) {
                                for (var iii = 0; iii < b_config[ii].product_num; iii++) {
                                    order_no++;
                                    var labelData = [];
                                    labelData.push({
                                        "Content": convertString(pfData.order_running_id) + "-" + order_no,
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 9,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": b_config[ii].product_name,
                                        "Columns": 1,
                                        "RowNum": 3,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 15,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "",
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 10,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "￥" + b_config[ii].product_unitprice + "元",
                                        "Columns": 2,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 1,
                                        "TextFont": 0,
                                        "TextFontSize": 8,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "【" +
                                            convertString(config.user.sv_us_name) +
                                            "】" +
                                            "电话:" +
                                            convertString(config.user.sv_us_phone),
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "谢谢惠顾!",
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": hours + ":" + minute,
                                        "Columns": 2,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 1,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    var tempdata = {
                                        "FooterList": labelData,
                                        "QRCodeData": null,
                                        "Action": 1,
                                        "PageType": 4,
                                        "PagePadding": 10
                                    };
                                    if (((typeof Cef) !== 'undefined')) {
                                        Cef.LabelPrint(JSON.stringify(tempdata),
                                            '' + receptionPtNum + '',
                                            receptionPtName,
                                            false,
                                            40,
                                            30);
                                    }
                                }
                            }
                        }
                    } else {
                        Cef.CustormPrint(JSON.stringify(postData), '' + receptionPtNum + '', receptionPtName);
                    }
                }else if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android)
                {
                    //是否Android客户端运行环境
                    try
                    {
                        //Android客户端打印
                        cordova.plugins.barcodeScanner.print(
                            function(result) {
                            },
                            function(error) {
                                alert("打印失败: " + error);
                            },
                            {
                                myPrintData: JSON.stringify(postData)

                            }
                        );
                    } catch (e)
                    {
                        alert("打印失败: " + e.message);
                    }
                }
            }
            else {
                if (((typeof Cef) !== 'undefined')) {
                    Cef.CustormPrint(JSON.stringify(postData));
                }
                //是否Android客户端运行环境
                else if (decerpbrowser && decerpbrowser.versions && decerpbrowser.versions.android)
                {
                    try
                    {
                        //Android客户端打印
                        cordova.plugins.barcodeScanner.print(
                            function(result) {
                            },
                            function(error) {
                                alert("打印失败: " + error);
                            },
                            {
                                myPrintData: JSON.stringify(postData)

                            }
                        );
                    } catch (e)
                    {
                        alert("打印失败: " + e.message);
                    }
                }
            }


            // 后台打印
            if (printSet_network_enable) {
                if (printSet_network_device_back_islabel) { // 临时给客户打印
                    //是否标签机打印
                    if (backstagePtNum > 0) {
                        //处理标签数据
                        if (b_config && b_config.length > 0) {
                            var order_no = 0;
                            for (var ii = 0; ii < b_config.length; ii++) {
                                for (var iii = 0; iii < b_config[ii].product_num; iii++) {
                                    order_no++;
                                    var labelData = [];
                                    labelData.push({
                                        "Content": convertString(pfData.order_running_id) + "-" + order_no,
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 9,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": b_config[ii].product_name,
                                        "Columns": 1,
                                        "RowNum": 3,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 15,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "",
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 10,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "￥" + b_config[ii].product_unitprice + "元",
                                        "Columns": 2,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 1,
                                        "TextFont": 0,
                                        "TextFontSize": 8,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "【" + convertString(config.user.sv_us_name) + "】" + "电话:" + convertString(config.user.sv_us_phone),
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": "谢谢惠顾!",
                                        "Columns": 1,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 0,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    labelData.push({
                                        "Content": hours + ":" + minute,
                                        "Columns": 2,
                                        "RowNum": 1,
                                        "RowMaxLength": 10,
                                        "Align": 1,
                                        "TextFont": 0,
                                        "TextFontSize": 7,
                                        "Width": 0
                                    });
                                    var tempdata = {
                                        "FooterList": labelData,
                                        "QRCodeData": null,
                                        "Action": 1,
                                        "PageType": 4,
                                        "PagePadding": 10
                                    };
                                    if (((typeof Cef) !== 'undefined')) {
                                        Cef.LabelPrint(JSON.stringify(tempdata),
                                            '' + backstagePtNum + '',
                                            backstagePtName,
                                            false,
                                            40,
                                            30);
                                    }
                                }
                            }
                        }

                    }
                }
                else {
                    //普通后台打印
                    postData.FooterList = [{}];
                    var a = [];
                    a.push({ "Content": "后台打印", "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 1, "TextFont": 0, "Width": 0 });
                    a.push({ "Content": "单号：" + convertString(pfData.order_running_id), "Columns": 1, "RowNum": 1, "RowMaxLength": 10, "Align": 0, "TextFont": 0, "Width": 0 });

                    a.push(postData.HeaderList[postData.HeaderList.length - 1]);
                    postData.HeaderList = a;
                    if (backstagePtNum > 0) {
                        Cef.CustormPrint(JSON.stringify(postData), '' + backstagePtNum + '', backstagePtName);
                    }
                }
            }
        } catch (e) {
        }
    }
    else
    {
        try {
            Cef.openMyPc(spfData, sconfig, ptype, 1, '' + receptionPtNum + '', receptionPtName);
            // 后台打印
            if (printSet_network_enable && backstagePtNum > 0)
            {
                Cef.openMyPc(spfData, sconfig, ptype, 1, '' + backstagePtNum + '', backstagePtName);
            }
        } catch (e) {

        } 
    }
}
//------------模板实现----收银
function decerp_print(pfData) {
    try {
        Cef.CustrmPrint(JSON.stringify(pfData));
    } catch (e) {

    }
}


function convertString(str) {
    if (str) return str;
    else return "";
}

//补位，如果时间为小于两位数的时候，前面加上‘0’
function fnW(str) {
    var num;
    str >= 10 ? num = str : num = "0" + str;
    return num;
}
