$(function(){
	var schoolName = "",schoolType = $(".lx option:selected").val(),Area="",City = "",Zone="",manageName="",manageSex="",phoneNumber="",ECode="",Tpeople="",Tname="",schoolXType=$(".xz option:selected").val();
	var ddsId = "",ddsName=""
	
	//从地址栏获取地址栏id
	$.getRequest = function () {
        if (arguments.length > 0) {
            var url = window.location.search, reg, retVal;
            reg = new RegExp("(^\\?|&)" + arguments[0].toLowerCase() + "=([^&]*)(&|$)");
            retVal = url.match(reg);
            return $.isArray(retVal) && retVal.length >= 3 ? decodeURIComponent(retVal[2]) : '';
        } else
            return decodeURIComponent(window.location.search.slice(1));
    }
	var d = $.getRequest("d");
	var d1  = d.split(",")
	if(d1.length <=1){
		$(".tjr").css("display","none")
	}
	$.dialog = function(obj){
		$(".content").css("-webkit-overflow-scrolling", "auto");
		var div = $("<div>").addClass("alert").append(
			$("<div>").append(
				$("<span>").addClass("title").html(obj.title||'提示')
			).append(
				$("<span>").addClass("msg").html(obj.msg)
			).append(
				$("<span>").addClass("btn").html(obj.btn||'确定').click(function(){
					div.remove();
					if(obj.success) obj.success();
					$(".content").css("-webkit-overflow-scrolling", "touch");
				})
			)
		).appendTo($("body"));
		if(obj.after)
			obj.after(div);
	};
	//封装的ajax方法
	$.ajax_ = function(obj) {
		$.ajax({
			type: "Post",
			url: "http://server.yphtoy.com/Garden.ashx/" + obj.method,
			data: JSON.stringify(obj.data),
			xhrFields: { withCredentials: true },
       		crossDomain: true,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function(data) {
				obj.success(data)
			},
			error: function(err) {
				obj.error(err);
			}
		});
	};
	function setTime(){
		var num = 60;
		$(".DoCode").text("5s后重发")
		var t = setInterval(function(){
			if(num>0){
				num--;
				$(".DoCode").text(num +"s后重发")
			}else{
				clearInterval(t)
				$(".DoCode").css("background","#22AC38").text('发送验证码')
			}
		},1000)
	}
	//-------------------------------------------------------------------------------------------------------------------
	
	//根据代理商id获取代理商名称
	var dName;
	if(d!==""||$(".dds option").length==1){
		$.ajax_({
			method:"GetDistriNameByIdStr",
			data:{
				disIds:d
			},
			success:function(e){
				var data = JSON.parse(e.d);
				if(data.Result == true){
					$(".TPeopleName").val(data.Msg);
					dName = data.Msg;
					var dataMsg = JSON.parse(data.Msg).list;
					console.log(dataMsg)
					dataMsg.forEach(function(item,index){
						$("<option>").attr("value",item.id).text(item.name).appendTo($(".dds"))
					})
				}else{
					console.log(data.Msg);
				}
				console.log(e.d);
			},
			error:function(e){
				console.log(e);
			}
		})
	}else{
		console.log("代理商id为空");
	}
	
	$(".dds").change(function(){
		ddsId = $(".dds option:selected").val();
		ddsName = $(".dds option:selected").text();
//		alert(ddsId + "---"+ddsName)
	})
//	$('.schoolType').selectFilter({
//		callBack : function (val){  //-----------学校类型
//			//返回选择的值
//			console.log(val+'-学校类型')
//			 = val;
//		}
//	});
	$(".lx").change(function(){
		 schoolType = $(".lx option:selected").val();
	})

	$(".xz").change(function(){
		schoolXType = $(".xz option:selected").val();
	})
	
	$(".sheng").change(function(){
		var id = $(".sheng option:selected").val();
		Area = id;
		console.log(id   +"--省")
		getCity(id);
	})
	$(".shi").change(function(){
		var id = $(".shi option:selected").val();
		City  = id
		console.log(id   +"--市")
		getZone(id);
	});
	$(".qu").change(function(){
		var id = $(".qu option:selected").val();
		Zone  = id;
		console.log(id   +"--区")
	})
	//获取 省市区
	$.ajax_({
		method:"getArea",
		data:{area:""},
		success:function(e){
			var data = JSON.parse(e.d);
			$(".sheng").empty();
			var str = ""
			data.forEach(function(item,index){
				str += "<option value='"+ item.id+"'>"+item.name + "</option>"
			})
			$(".sheng").html(str);
		},
		error:function(e){
			console.log(e)
		}
	});
	function getCity(id){
		$.ajax_({
			method:"getCity",
			data:{id:id},
			success:function(e){
				var data = JSON.parse(e.d);
				$(".shi").empty();
				data.forEach(function(item,index){
					$("<option>").attr("value",item.id).text(item.name).appendTo($(".shi"));
					console.log(index);
					if(index == 0){
						getZone(item.id)
					}
				});
				
			},
			error:function(e){
				console.log(e)
			}
			
		})
	}
	function getZone(id){
		$.ajax_({
			method:"getZone",
			data:{id:id},
			success:function(e){
				var data = JSON.parse(e.d);
				$(".qu").empty();
				data.forEach(function(item,index){
					$("<option>").attr("value",item.id).text(item.name).appendTo($(".qu"))
				})
				var id = $(".qu option:selected").val();
				Zone  = id;
			},
			error:function(e){
				console.log(e)
			}
			
		})
	}
	//发送验证码
	$(".DoCode").click(function(){
		var phoneNum = $(".Phone").val();
		//发送验证码
		if(phoneNum!=""&&$(this).text() == "发送验证码"){
			
			setTime();
			$(this).css("background","#ccc");
			$.ajax_({
				method:"GetMsgCode",
				data:{"cellPhone":phoneNum},
				success:function(e){
					console.log(e.d)
				},
				error:function(e){
					console.log(e)
				}
			})
			
		}else{
			$(".Phone").focus();
		}
		
	});
	$(".schoolName").blur(function(e){
		schoolName = $(".schoolName").val();
	})
	$(".ManageName").blur(function(){
		manageName = $(this).val()
	});
	$(".Phone").blur(function(){
		phoneNumber = $(this).val()
	})
	$(".ECode").blur(function(){
		ECode = $(this).val()
	})
	//验证手机号
	$(".Phone").blur(function(){
		
		if($(this).val() !="" && !(/^1[34578]\d{9}$/.test($(this).val().replace(/\s/g,"")))){ 
        	 
        	$(this).focus();
        	$.dialog({msg:"手机号码有误，请重填"})
    	} 
	});
	//点击提交的时候
	$(".submit").click(function(){
		if(schoolName == ""){
			$.dialog({msg:"请输入学校名称"})
			return
		}
		
		
		if(Zone == ""){
			$.dialog({msg:"请选择省、市、区"})
			return
		}
		if(manageName ==""){
			$.dialog({msg:"请输入院长姓名"})
			return
		}
		if(phoneNumber== ""){
			$.dialog({msg:"请输入手机号"})
			return
		}
		if(ECode==""){
			$.dialog({msg:"请输入验证码"})
			return
		}
		$.ajax_({
			method:"SaveReceiveCustomerSchool",
			data:{
				distri_id:ddsId,     //代理商id
				distri_name:ddsName,    //---------------代理商名称
				school_name : schoolName,  //-------------------学校名称
				school_type : schoolType,  //学校类型
        		school_nature :schoolXType ,   //学校性质
        		school_area: Zone,  //-------------------------------------------------这款里有问题
        		school_gardener_name:manageName,   //-------------园长姓名
        		school_gardener_sex : 2,   //园长性别
        		school_phone: phoneNumber,  //手机号
        		sms_code:ECode  ,//手机验证码
			},
			success:function(e){
				console.log(e);
				var data = JSON.parse(e.d);
				if(data.Result == true){
					$.dialog({msg:"注册成功，请等待我们的审核，审核成功后将会有专人联系您"});
					schoolName = "";manageName="";phoneNumber="";ECode="";
					$("input").val("")
				}else{
					$.dialog({msg:"注册失败"});
				}
			},
			error:function(e){
				console.log(e)
				console.log(e)
				console.log(e)
				console.log(e)
				console.log(e)
				console.log(e)
				console.log(e)
				console.log(e)
			}
		})
	})
	
})