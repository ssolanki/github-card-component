"use strict";

var profiles = [];
var sortMethods = [
	"name",
	"location",
	"followers"
];
var selectedSortMethod = sortMethods[0];
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
	console.log(obj)
		var i;
    // // can optimize as list is already sorted, right now O(n)
    	
    for (i = 0; i < list.length; i++) {
        if (list[i][[selectedSortMethod]] > obj[[selectedSortMethod]]) {
        	list.splice(i, 0, obj);
      		break;
        }
    }
    if(i==list.length){
  		list.push(obj)
    }
    console.log(list)
};
// sort profiles
function sortObject(list){
  list.sort(function(a,b){
  	if(a[selectedSortMethod] < b[selectedSortMethod]){
	  	return -1;
  	}
	  else 
	  	return 1;
	  return 0;
  })
  console.log(list);
}
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
				"avatar_url": resp.avatar_url 
			};
			// check resp is existed in profiles
			if(hasObject(obj,profiles)){
				alert("username already added");
				return false
			} else{
				addObject(obj,profiles);
				$("#githubId").val("");
			}
	})
	.fail(function() {
    alert( "github username not found" );
  });
  event.preventDefault();
});
 