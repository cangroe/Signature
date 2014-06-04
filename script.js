$(document).ready(function(){
	Built.initialize('blt1568dbf6624f7922', 'signature');

	$("h1").css("color","#A7C942");
	$("#cardTable tr th").each(function() {
		$(this).css({"border":"1px solid #98bf21"});
		$(this).css({"cursor":"pointer"});
		$(this).css({"color":"#A43900"});
		$(this).click(function() {
			if($(this).html()=="Create") cardCreate();
			if($(this).html()=="Read") cardRead();
			if($(this).html()=="Update") cardUpdate();
			if($(this).html()=="Delete") cardDelete();
			if($(this).html()=="QRCode") QRCode();
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
	$("#registerForm,#loginForm,#updateForm").hide();
	$("#feedback").css("color","#A43900");
	$("#feedback").css("display","none");
	$('#userTable tr th:eq(1)').click(); //Simulate Login button Click Action
	$("#createForm, #readForm, #updateCardForm, #deleteMessage,#qrCode").hide();
	$("#userTable tr th:eq(2),#userTable tr th:eq(3)").hide();
	$("#cardTable,hr:eq(0)").hide();
}); 

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
				uidHisCard=hisCard.uid;
				// hiscard saved for the current user
			    Built.User.update({
			    		hiscard: uidHisCard,
			    	}, {
				    onSuccess: function(data, res) {
				    	console.log(data);
				    	cardRead();
				    	$("#updateCardForm input[name=fname]").val(hisCard.name);
						$("#updateCardForm input[name=mobile1]").val(hisCard.mobile[0]);
						$("#updateCardForm input[name=mobile2]").val(hisCard.mobile[1]);
						$("#updateCardForm input[name=email1]").val(hisCard.email[0]);
						$("#updateCardForm input[name=email2]").val(hisCard.email[1]);
						$("#updateCardForm input[name=company]").val(hisCard.company);
						$("#updateCardForm input[name=position]").val(hisCard.position);
						$("#updateCardForm input[name=color]").val(hisCard.color);
				    },
				    onError: function(error) {
				    	console.log(error);
				    }
			    }); 
				$("#createForm").css("display","none");
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success: ");
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

function cardRead() {
	//alert("Read");
	$(".eachCardTable").remove();
	if(typeof Built.User.getCurrentUser().uid === 'undefined'){
	   $("#readForm").show();		
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return false;
	}

	if(typeof Built.User.getCurrentUser().hiscard === 'undefined' || Built.User.getCurrentUser().hiscard==null){
	   $("#readForm").html("Hasn't Created a Card Yet!");
	   $("#readForm").show();
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return false;
	}
	console.log(Built.User.getCurrentUser().hiscard);
	uid= Built.User.getCurrentUser().hiscard;

    var myQuery = new Built.Query('card'); 
    myQuery.where('uid', uid);
    myQuery.exec({
	    onSuccess: function(data) {
	    	console.log(data);
	    	// hisCard=data[0];	//data is an array. hisCard[0] is the card.
	    	// uidHisCard=data.get('uid');
	    	$('#readForm').hide();
	    	keys =['name','mobile','email','company','position','color'];
	    	table = $('<table></table>').addClass("eachCardTable");
	    	table.css({"border":"1px solid #98bf21","border-collapse":"collapse","color":"#A43900"});
	    	$.each(keys, function(index, key) {
			    table.append($('<tr><td>'+key+'</td><td>'+data[0].get(key)+'</td></tr>'));
			});
			table.append("<div style='color:black'>Click to hide and Continue<div>");
			$('#readTable').append(table);
			table.click(function() {
				table.hide();
			});
			return true;
	    },
	    onError: function(err) {
	    	console.log(err);
			$("#readForm").hide();
	    	$("#feedback").toggle();
	    	$("#feedback h4").html("Error");
	    	setTimeout(function(){
	    		$("#feedback progress").val("100");
	    		$("#feedback").toggle();
	    	}, 3000);
	    	return false;
	    }
    });
}

function cardUpdate() {
	//alert("Update");
	if(typeof Built.User.getCurrentUser().uid === 'undefined'){
	   $("#readForm").show();		
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return;
	}

	if(typeof Built.User.getCurrentUser().hiscard === 'undefined' || Built.User.getCurrentUser().hiscard==null){
	   $("#readForm").html("Hasn't Created a Card Yet!");
	   $("#readForm").show();
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return;
	}
	$("#updateCardForm").toggle(); //1 unhides the updateCardForm
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

		var card= Built.Object.extend('card');
		var hisCard= new card();
		hisCard.setUid(Built.User.getCurrentUser().hiscard);
		hisCard.set({
			name: name,
			mobile: [mobile1,mobile2],
			email: [email1,email2],
			company: company,
			position: position,
			color: color
		});
		hisCard.save({
			onSuccess: function(data, res) {
				console.log(data);
				$("#updateCardForm").hide();
				cardRead();
			},
			onError: function(err) {
				console.log(err);
				$("#updateCardForm").hide();
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
	if(cardRead()===false) {
		return;
	}
	$("#deleteMessage").show();
	var card = Built.Object.extend('card');
	var hisCard = new card();
	hisCard.setUid(Built.User.getCurrentUser().hiscard);
	$("#deleteMessage button").click(function() {
		hisCard.destroy({
			onSuccess: function(data, res) {
				console.log(data);
				$("#deleteMessage").hide();
		    	$("#feedback").toggle();
		    	$("#feedback h4").html("Success: ");
		    	Built.User.refreshUserInfo();
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

function QRCode() {
	$(".dispqrCode").remove();
	if(typeof Built.User.getCurrentUser().uid === 'undefined'){
	   $("#readForm").show();		
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return;
	}

	if(typeof Built.User.getCurrentUser().hiscard === 'undefined' || Built.User.getCurrentUser().hiscard==null){
	   $("#readForm").html("Hasn't Created a Card Yet!");
	   $("#readForm").show();
	   setTimeout(function() {
	   	$("#readForm").hide();
	   },3000);
	   return;
	}
	$("#qrCode").show();
	$('#qrCode button').click(function(){
		//iterative calling. something is Wrong.
		$(".dispqrCode").remove();
		div= $("<div></div>").addClass("dispqrCode");
		$("#qrCode").after(div);
		id= Built.User.getCurrentUser().hiscard;
		$('#qrCode').hide();
		$(".dispqrCode").qrcode({
			render: 'div',
			width: 100,
			height: 100,
			color: '#3a3',
			text: id
		});

		$(".dispqrCode").click(function() {
			$(".dispqrCode").remove();
		});
	});
}

function userRegister() {
	// alert("Register");

	$("#loginForm").hide();
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
		    	$("#feedback h4").html("Error: Check Log");
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
	$("#registerForm").hide();
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
					//Check if this User has a Card already
					if(typeof Built.User.getCurrentUser().hiscard != 'undefined' && Built.User.getCurrentUser().hiscard!=null){
					   $("#cardTable tr th:eq(0)").hide();
					};
			    	$("#loginForm").css("display","none");
			    	$("#feedback").toggle();
			    	$("#feedback h4").html("Success: Welcome "+Built.User.getCurrentUser().first_name);
			    	loginFill(Built.User.getCurrentUser());
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
		   	logoutClear();
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

function loginFill(User) {
	//console.log(User.first_name);
	$("#userTable tr th:eq(2),#userTable tr th:eq(3)").show();
	$("#cardTable,hr:eq(0)").show();
	$("#userTable tr th:eq(0)").show();
	$("#updateForm input[name=fname]").val(User.first_name);
	$("#updateForm input[name=lname]").val(User.last_name);
	$("#updateForm input[name=email]").val(User.email);

	allCards();
	myCards();

	if(typeof User.hiscard === 'undefined' || User.hiscard==null){
	   return;
	}
	var myQuery = new Built.Query('card'); 
    myQuery.where('uid', User.hiscard);
    myQuery.exec({
	    onSuccess: function(data) {
	    	$("#updateCardForm input[name=fname]").val(data[0].get('name'));
			$("#updateCardForm input[name=mobile1]").val(data[0].get('mobile')[0]);
			$("#updateCardForm input[name=mobile2]").val(data[0].get('mobile')[1]);
			$("#updateCardForm input[name=email1]").val(data[0].get('email')[0]);
			$("#updateCardForm input[name=email2]").val(data[0].get('email')[1]);
			$("#updateCardForm input[name=company]").val(data[0].get('company'));
			$("#updateCardForm input[name=position]").val(data[0].get('position'));
			$("#updateCardForm input[name=color]").val(data[0].get('color'));
	    },
	    onError: function(err) {
	    	console.log("Error");	
	    }
    });
}

function logoutClear() {
	document.getElementById("updateForm").reset();
	document.getElementById("loginForm").reset();
	$("#registerForm,#loginForm,#updateForm").hide();
	$("#createForm, #readForm, #updateCardForm, #deleteMessage,#qrCode").hide();
	$("#userTable tr th:eq(2),#userTable tr th:eq(3)").hide();
	$("#cardTable,hr:eq(0)").hide();
	$('#userTable tr th:eq(1)').click();
	$("#dispAllCards").remove();
	$("#dispMyCards").remove();

}

function allCards() {
	divAllCards= $("<div></div>").attr("id","dispAllCards");
	$(divAllCards).css({"width":"50%","float":"left","text-align":"center"});
	$(divAllCards).append("<h4>All Cards</h4>");
	$(divAllCards).append("Click a Card to Add it to your Stack");
    var myQuery = new Built.Query('card');
    myQuery.includeOwner("true");
    myQuery.exec({
	    onSuccess: function(cards) {
		    keys =['name','mobile','email','company','position','color'];
		    $.each(cards, function(index,card) {
		    	table = $('<table></table>').addClass("dispEachCard");
		    	table.css({"border":"1px solid #98bf21","border-collapse":"collapse","color":"#A43900"});
		    	table.css({"margin":"10px"});
		    	$.each(keys, function(index, key) {
				    table.append($('<tr><td>'+key+'</td><td>'+card.get(key)+'</td></tr>'));
				});
				$('#dispAllCards').append(table);
				table.click(function() {
					var UserCard = Built.Object.extend('usercards');
					var userCard = new UserCard();
					userCard.setReference('userid', Built.User.getCurrentUser().uid);
					userCard.setReference('cardid', card.get('uid'));
					userCard.setReference('cardowner', card.get('_owner').uid);
					userCard.save({
						onSuccess: function(data, res) {
							console.log("Added to CardStack");
							$("#dispMyCards").remove();
							myCards();
						},
						onError: function(err) {
							console.log("Error: Couldnt Add to Stack");
							console.log(err);
						}
					});
				});
		    });
	    },
	    onError: function(err) {
	    	console.log("Error Fetching all Cards");
	    }
    });
	$("body").append(divAllCards);
}

function myCards() {
	divMyCards= $("<div></div>").attr("id","dispMyCards");
	$(divMyCards).css({"width":"50%","float":"left","text-align":"center"});
	$(divMyCards).append("<h4>CardStack</h4>");
	$(divMyCards).append("Some Cards maynot have owners since the database is obsolute and cannot be Added.");
	var myQuery = new Built.Query('usercards');
	myQuery.include('cardid');
	myQuery.include('cardowner');
	myQuery.where('userid', Built.User.getCurrentUser().uid);
	myQuery.exec({
		onSuccess: function(usercards) {
		    keys =['name','mobile','email','company','position','color'];
			$.each(usercards, function(index,usercard) {
		    	table = $('<table></table>').addClass("dispMyEachCard");
		    	table.css({"border":"1px solid #98bf21","border-collapse":"collapse","color":"#A43900"});
		    	table.css({"margin":"10px"});
		    	$.each(keys, function(index, key) {
				    table.append($('<tr><td>'+key+'</td><td>'+usercard.get('cardid')[0][key]+'</td></tr>'));
				});
				table.append("<p style='color:black'>Owner of this Card is: "+usercard.get('cardowner')[0].first_name+"</p>");
				$('#dispMyCards').append(table);
		    });
		},
		onError: function(err) {
			console.log("Error: usercards can't be fetched");
		}
	});
	$("body").append(divMyCards);
}