"use strict";

var profiles = [];
var sortMethods = [
	"name",
	"location",
	"followers"
];
// setSortedMethod(0);
var selectedSortMethod = sortMethods[0],selectedSortIndex = 0;
addEmptyDiv() // add no reuslt div
function setSortedMethod(sortTypeIndex){
	if(sortMethods[sortTypeIndex]!==selectedSortMethod){
		$("#sortMethod"+selectedSortIndex).removeClass("active");
		$("#sortMethod"+sortTypeIndex).addClass("active");
		selectedSortIndex = sortTypeIndex;
		selectedSortMethod = sortMethods[selectedSortIndex]
		sortObject(profiles);	
		createUI(profiles);
	}
}
function hasObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return true;
        }
    }
    return false;
}
function addObject(obj, list) {
		var i;
    // // can optimize as list is already sorted, right now O(n)    	
    for (i = 0; i < list.length; i++) {
        if (list[i][selectedSortMethod] > obj[selectedSortMethod]) {
        	list.splice(i, 0, obj);
      		break;
        }
    }
    if(i==list.length){
  		list.push(obj)
    }
    createUI(list);
};
function removeObject(val, list) {
		var i;
    // // can optimize as list is already sorted, right now O(n)    	
    for (i = 0; i < list.length; i++) {
        if (list[i]["login"] === val) {
        	list.splice(i, 1);
      		break;
        }
    }
};
function createUI(list){
	$("#profiles").empty();
	for(var i=0;i<list.length;i++){
		// console.log(getCard(list[i]));
		$("#profiles").append(getCard(list[i]));
	}	 
}
function addEmptyDiv(){
	var div = '<div class="empty-result" id="emptyResult"> No Profiles found.</div>';
	$("#profiles").append(div);
}
function getCard(obj){
	var column = document.createElement("div");
	column.className = "col-3";
	column.id = obj.login ;
	var card = '<div class="card">';
	card +=  ' <i class="fa fa-close"></i> <img src="';
	card += obj.avatar_url+'"> <div class="info"> <p class="name">';
	card += obj.name+'</p> <p class="location"><span class="title">Location:</span> <span> ';
	if(obj.location){
		card += obj.location;
	}else{
		card += "Not Available";
	}
	card += '</span> </p> <p class="followers"><span class="title">Followers:</span> <span> ';
	card +=  obj.followers+'</span> </p> </div></div>';
	column.innerHTML = card;
	return column;
}
// sort profiles
function sortObject(list){
  list.sort(function(a,b){
  	if(!a[selectedSortMethod]){
  		return 1;
  	}
  	if(!b[selectedSortMethod]){
  		return -1;
  	}
  	if(a[selectedSortMethod] < b[selectedSortMethod]){
	  	return -1;
  	}
  	else if(a[selectedSortMethod] > b[selectedSortMethod]){
	  	return 1;
	  }
	  return 0;
  })
}

// On form submit function
$( "#githubLink" ).submit(function( event ) {
	var username = $("#githubId").val();
	$.ajax({
	  url: "https://api.github.com/users/"+username,
	}).done(function(resp) {
			 var obj = {
				"id": resp.id,
				"name": resp.name,
				"followers": resp.followers,
				"location": resp.location,
				"url": resp.url, 
				"login": resp.login,
				"avatar_url": resp.avatar_url 
			};
			// check resp is existed in profiles
			if(hasObject(obj,profiles)){
				alert("username already added");
				return false
			} else{
				addObject(obj,profiles);
    		$("#emptyResult").addClass("hidden");
    		$(".sort-order").removeClass("hidden");

				$("#githubId").val("");
			}
	})
	.fail(function() {
    alert( "github username not found" );
  });
  event.preventDefault();
});
 
 $("#profiles").click(function(e) {
  //do something
    var senderElement = e.target;
    var githubId = findTargetParentDiv($(e.target));
    console.log(githubId)
    if(senderElement.className=="fa fa-close"){
    	$(this).find("#"+githubId).remove();
    	removeObject(githubId,profiles);	// remove from profiles list also
    	if(profiles.length==0){
    		addEmptyDiv();
    		$(".sort-order").addClass("hidden");
    	}
    }else{
    	window.open(
			  'https://github.com/'+githubId,
			  '_blank'  
			);
    }
    return true;
});

function findTargetParentDiv(node){
	while(!node.hasClass("col-3")){
		node = node.parent()
	}
		return node.attr('id');
}
// $("body").on('click', '#profile', function(e) {
//   //do something
//     var senderElement = e.target;
//     console.log(senderElement)
//    //  if(senderElement.className=="fa fa-close"){
//    //  	console.log("delete profile")
//    //  	$(this).remove();
//    //  }else{
//    //  	window.open(
// 			//   'https://github.com/'+$(this).attr("id"),
// 			//   '_blank'  
// 			// );
//    //  }
//     return true;
// });
