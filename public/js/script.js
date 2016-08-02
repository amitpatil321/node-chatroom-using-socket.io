
  $().ready(function(){
    // Check if user already have nickname in localstorage
    var localNickname = getName();
    if(!localNickname){
      // Hide logout button  
      $(".logout").hide();
      asknickname();  
    }else{
      setName(getName());
      // Send user joined message to server
      socket.emit('newUser', localNickname);
    }

  });


  $('form').submit(function(e){
    var nickname = $("#nickname").val();
    // Check if user is logged in ? if not then login   
    if(getName() == null){
        if(nickname.length){
            setName(nickname);
            showsendmessage();
            // Send user joined message to server
            socket.emit('newUser', nickname);
        }    
    }
    // Handle send message button action
    e.preventDefault();
    var message = $('#txtmessage').val();
    if(message.length){
      // Send messgae to server 
      socket.emit('newMessage', {"msg" : message, "user" : getName()});
      // clear textbox
      $('#txtmessage').val('');
    }
  });

  var socket = io();
  // New message received
  socket.on('newMessage', function(obj){
    // append messge to existing messages
    console.log(obj);
    $('.room').append(
      $('<div style="display:none;">').html('<div class="ui comments"><div class="comment"><a class="avatar"><img src="https://randomuser.me/api/portraits/men/'+obj.user.length+'.jpg"></a><div class="content"><a class="author">'+obj.user+'</a><div class="metadata"><span class="date">'+moment(obj.time).format("h:mm:ss A")+'</span></div><div class="text">'+obj.msg+'</div></div></div></div>').fadeIn()
    );
    scroll();
  });

  //New user joined
  socket.on('newUser', function(data){
    // append messge to existing messages
    $('.room').append('<div class="ui small message info"><i class="icon info"></i>'+data+' Just joined us</div>');
    scroll();
  });  

  //user logout
  socket.on('userLogout', function(data){
    // append messge to existing messages
    $('.room').append('<div class="ui small message error"><i class="icon info"></i>'+data+' Just left room</div>');
    scroll();
  });

  function getName(){
    return window.localStorage.getItem("nickname");
  }  

  function setName(name){
    window.localStorage.setItem("nickname",name);
    // Add name to window title
    $(".wintitle").append(" - "+name);
  }

  function logout(){
    var username = getName(); 
    // Logout user 
    window.localStorage.removeItem("nickname");
    // Ask nickname
    asknickname();
    // Change window title
    $(".wintitle").html("Chatroom");
    // Broadcast logout message
    socket.emit('userLogout', username);
  }

  function login(nickname){
    // Store data in locastorage
    window.localStorage.setItem("nickname",nickname);

    showsendmessage();
  }

  function asknickname(){
      $(".logout").hide();  
      $(".dimmer").addClass("active");
      $(".nickname").show();
      $(".txtmessage").hide();
  }

  function showsendmessage(){
    // Hide nickname window and show msg input window
    $(".nickname").hide();
    $(".txtmessage").show();
    $(".dimmer").removeClass('active');
    // Show logout button
    $(".logout").show();
  }

  function scroll(){
    // scroll to bottom
    //$(".room").scrollTop = $(".room").scrollHeight;    
    $(".room").scrollTop(1000);
  }
