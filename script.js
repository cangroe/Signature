$(document).ready(function(){
	Built.initialize('blt1568dbf6624f7922', 'signature');

	$("h1").css("color","#A7C942");
	$("#cardTable tr th").each(function() {
		$(this).css({"border":"1px solid #98bf21"});
		$(this).css({"cursor":"pointer"});
		$(this).css({"color":"#A43900"});
		$(this).click(function() {
			if($(this).html()=="Create") cardCreate();
			if($(this).html()=="Read") cardRead(0);
			if($(this).html()=="Update") cardUpdate();
			if($(this).html()=="Delete") cardDelete();
		});
	});
	$("#userTable tr th").each(function() {
		$(this).css({"border":"1px solid #98bf21"});
		$(this).css({"cursor":"pointer"});
		$(this).css({"color":"#A43900"});
		$(this).click(function() {
			if($(this).html()=="Register") userRegister();
			if($(this).html()=="Login") userLogin();
			if($(this).html()=="Update") userUpdate();
			if($(this).html()=="Logout") userLogout();
		});
	});
	$("#registerForm,#loginForm,#updateForm").css("display","none");
	$("#feedback").css("color","#A43900");
	$("#feedback").css("display","none");
	$('#userTable tr th:eq(1)').click();

	$("#createForm, #readForm, #updateCardForm, #deleteMessage").css("display","none");
}); 

var uidHisCard;
var hisCard;

function cardCreate() {
	//alert("Create");
	$("#createForm").toggle();
	$("#createForm input[name=Submit]").click(function() {
		name= $("#createForm input[name=fname]").val();
		mobile1= $("#createForm input[name=mobile1]").val();
		mobile2= $("#createForm input[name=mobile2]").val();
		email1= $("#createForm input[name=email1]").val();
		email2= $("#createForm input[name=email2]").val();
		company= $("#createForm input[name=company]").val();
		position= $("#createForm input[name=position]").val();
		color= $("#createForm input[name=color]").val();
		console.log(name+","+mobile1+","+mobile2+","+email1+","+email2+","+company+","+position+","+color);

		var card = Built.Object.extend('card');
		var hiscard = new card(); 
		var acl = new Built.ACL();
		acl.setPublicReadAccess(true);
		hiscard.setACL(acl);
		hiscard.set({
			name: name,
			mobile: [mobile1,mobile2],
			email: [email1,email2],
			company: company,
			position: position,
			color: color
		});
		hiscard.save({
			onSuccess: function(data, res) {
				console.log(data);
				hisCard=data;
				uidHisCard=data.uid;
				$("#createForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success: "+uidHisCard);
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			},
			onError: function(err) {
				console.log(err);
				$("#createForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			}
		});
	});
}

function cardRead(flag) {
	//alert("Read");
	$("#readForm").toggle();
	$("#readForm input[name=Submit]").click(function() {
		uid= $("#readForm input[name=uid]").val();

	    var myQuery = new Built.Query('card'); 
	    myQuery.where('uid', uid);
	    myQuery.exec({
		    onSuccess: function(data) {
		    	console.log(data);
		    	hisCard=data;	//data is an array. hisCard[0] is the card.
		    	$('#readForm').hide();
		    	keys =['name','mobile','email','company','position','color'];
		    	table = $('<table></table>').attr("id","cardTable");
		    	table.css({"border":"1px solid #98bf21","border-collapse":"collapse","color":"#A43900"});
		    	$.each(keys, function(index, key) {
				    table.append($('<tr><td>'+key+'</td><td>'+data[0].get(key)+'</td></tr>'));
				});
				table.append("<div style='color:black'>Click to hide and Continue<div>");
				$('#readTable').append(table);
				table.click(function() {
					table.hide();
					switch(flag) {
					case 1: $("#updateCardForm").show(); break;
					case 2: $("#deleteMessage").show(); break;
					}
				});
		    },
		    onError: function(err) {
		    	console.log(err);
				$("#createForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
		    }
	    });
	});
}

function cardUpdate() {
	//alert("Update");
	cardRead(1); //1 unhides the updateCardForm
	$("#updateCardForm input[name=Submit]").click(function() {
		name= $("#updateCardForm input[name=fname]").val();
		mobile1= $("#updateCardForm input[name=mobile1]").val();
		mobile2= $("#updateCardForm input[name=mobile2]").val();
		email1= $("#updateCardForm input[name=email1]").val();
		email2= $("#updateCardForm input[name=email2]").val();
		company= $("#updateCardForm input[name=company]").val();
		position= $("#updateCardForm input[name=position]").val();
		color= $("#updateCardForm input[name=color]").val();
		console.log(name+","+mobile1+","+mobile2+","+email1+","+email2+","+company+","+position+","+color);

		hisCard[0].set({
			name: name,
			mobile: [mobile1,mobile2],
			email: [email1,email2],
			company: company,
			position: position,
			color: color
		});
		hisCard[0].save({
			onSuccess: function(data, res) {
				console.log(data);
				uidHisCard=data.uid;
				$("#updateCardForm").css("display","none");
				$("#readForm input[name=uid]").val(uidHisCard);		    	
				$("#readForm input[name=Submit]").click();
			},
			onError: function(err) {
				console.log(err);
				$("#updateCardForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			}
		});
	});
}

function cardDelete() {
	//alert("Delete");
	cardRead();
	$("#deleteMessage button").click(function() {
		hisCard[0].destroy({
			onSuccess: function(data, res) {
				console.log(data);
				$("#deleteMessage").hide();
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success: "+uidHisCard);
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			},
			onError: function(err) {
				console.log(err);
				$("#deleteMessage").hide();
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			}
		});
	});
}

function userRegister() {
	// alert("Register");
	$("#registerForm").toggle();
	$("#registerForm input[name=Submit]").click(function() {
		first_name= $("#registerForm input[name=fname]").val();
		last_name= $("#registerForm input[name=lname]").val();
		email= $("#registerForm input[name=email]").val();
		password= $("#registerForm input[name=password]").val();
		password_confirmation= $("#registerForm input[name=confirmation]").val();
		console.log(first_name+","+last_name+","+email+","+password+","+password_confirmation);		

	    Built.User.register({
	    	first_name:first_name,
	    	last_name:last_name,
		    email: email,
		    password: password,
		    password_confirmation: password_confirmation,
	    	}, {
		    onSuccess: function(data, res) {
		    	console.log(data);
		    	console.log("Success");
				console.log(res);
		    	$("#registerForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
		    },
		    onError: function(error) {
		   		console.log("Error");
		   		console.log(error);
		    	$("#registerForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
		    } 
		});
	});
}

function userLogin() {
	// alert("Login");
	$("#loginForm").toggle();
	$("#loginForm input[name=Submit]").click(function() {
		email= $("#loginForm input[name=email]").val();
		password= $("#loginForm input[name=password]").val();
		console.log(email+","+password);

	    Built.User.login(
		    email,
		    password, {
			    onSuccess: function(data, response) {
				console.log(data);
				console.log(response);
		    	$("#loginForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			    },
			    onError: function(error) {
			    console.log(error);
		    	$("#loginForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
			    }
		    }
	    );		
	});
}

function userUpdate() {
	//alert("Update");
	$("#updateForm").toggle();
	$("#updateForm input[name=Submit]").click(function() {
		first_name= $("#updateForm input[name=fname]").val();
		last_name= $("#updateForm input[name=lname]").val();
		email= $("#updateForm input[name=email]").val();
		password= $("#updateForm input[name=oldpassword]").val();
		password= $("#updateForm input[name=password]").val();
		password_confirmation= $("#updateForm input[name=confirmation]").val();
		console.log(first_name+","+last_name+","+email+","+password+","+password_confirmation);		

	    Built.User.update({
	    	first_name:first_name,
	    	last_name:last_name,
		    email: email,
		    //oldpassword:password
		    //password: password,
		    //password_confirmation: password_confirmation,
	    	}, {
		    onSuccess: function(data, res) {
		    	console.log(data);
		    	console.log("Success");
				console.log(res);
		    	$("#updateForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
		    },
		    onError: function(error) {
		   		console.log("Error");
		   		console.log(error);
		    	$("#updateForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Error");
		    	setTimeout(function(){
		    		$("#feedback progress").val("100");
		    		$("#feedback").toggle();
		    	}, 3000);
		    } 
		});
	});
}

function userLogout() {
	//alert("Delete");
    Built.User.logout({
	    onSuccess: function(result, response) {
	    	console.log(result.notice);
	   	    $("#feedback").toggle();
		   	$("#feedback h4").html("Success");
		   	setTimeout(function(){
		   		$("#feedback progress").val("100");
	    		$("#feedback").toggle();
	    	}, 3000);	
	    },
	    onError: function(error) {
	    	console.error();
	    	$("#feedback").toggle();
		   	$("#feedback h4").html("Error");
		   	setTimeout(function(){
		   		$("#feedback progress").val("100");
	    		$("#feedback").toggle();
	    	}, 3000);	
	    }
    });
}