document.addEventListener ("DOMContentLoaded", 
	function(event) {

var itemTemplate = $('#templates .item'); // $() is an easy way to fetch an item from the page
var list = $('#list');



// Function: Add Item To Page
var addItemToPage = function(itemData) {

	// creates a copy of a selected element.
	var item = itemTemplate.clone(); 

	// .attr() allows you to get and alter attributes stored in your HTML.
	// In this case, we used it to store the id of an item in a data-id attribute, that is not used for styling, just for data storage.
	item.attr('data-id', itemData.id); 
	//.find() helps you find elements nested inside other elements.
	//.text() allows you to get and alter the text of an element.
	item.find('.description').text(itemData.description); 

	
	if (itemData.completed) {
		// .addClass() allows you to add a class to an element.
		item.addClass('completed'); 
	}

	// .append() takes an element and attaches it to the end of another element!
	list.append(item); 
}




// Loading Items from server and adding them to the page
var loadRequest = $.ajax({
  type: 'GET',
  url: "https://listalous.herokuapp.com/lists/fluxka_2/"
});

console.log("GET request:");
console.log(loadRequest);


// Add all the Items from Server to the List
// We need to update the page whenever the request succeeds
loadRequest.done(function(dataFromServer) {
  
console.log("dataFromServer in a loadRequest:");
console.log(dataFromServer);

  // items = Items´ array (with id, description, completed, created_at, updated_at, list_name)
  var itemsData = dataFromServer.items;  // dataFromServer = responseText: "{"name": "fluxka_2", "items": [{"id":12889, "description":....}]

console.log("itemsData in a loadRequest");
console.log(itemsData);

  itemsData.forEach(function(itemData) {
    addItemToPage(itemData);
  })

})





// Ask the server to save an item into the database
$('#add-form').on('submit', function(event) {
  
  event.preventDefault(); // Prevent the page for refreshing, which is the normal behaviour for a form
  
  var itemDescription = event.target.itemDescription.value;  // Get the name="itemDescription"

  var creationRequest = $.ajax({ // Make a request to the server using AJAX
  type: 'POST',
  url: "http://listalous.herokuapp.com/lists/fluxka_2/items",
  data: { description: itemDescription, completed: false }

  })

// When the request succeeds, parse the data the server sends back.
// And add the new item to the list
creationRequest.done(function(itemDataFromServer) {
  console.log("itemDataFromServer in creationRequest:")
  console.log(itemDataFromServer)
  addItemToPage(itemDataFromServer);
})

})


$('#list').on('click', '.complete-button', function(event) {
	// Get all the information we need
	var item = $(event.target).parent();
	var isItemCompleted = item.hasClass('completed');
	var itemId = item.attr('data-id');
	
	
	// PUT request, UPDATE request
	var updateRequest = $.ajax({
  		type: 'PUT',
  		url: "https://listalous.herokuapp.com/lists/fluxka_2/items/" + itemId,
  		data: { completed: !isItemCompleted }  // Parameters you want to update
	})

// Finally, we'll update the item that has been marked as incomplete or complete.
// Instead of creating a new item, we'll simple add or remove the class 'completed' from the specified item.
// Add or remove the class 'completed' from the specified item.
// This will cause the browser to render the item differently, based on the rules written in styles.css
	updateRequest.done(function(itemDataFromServer) {

console.log("itemDataFromServer in an update request (PUT):");
console.log(itemDataFromServer);

  		if (itemDataFromServer.completed) {
    		item.addClass('completed')
  		} else {
    		item.removeClass('completed')
  		}
	})	

})


$('#list').on('click', '.delete-button', function (event) {
	// Get all the information we need
	var item = $(event.target).parent();
	var isItemDeleted = item.hasClass('deleted');
	var itemId = item.attr('data-id');
	
	// DELETE request
	var deleteRequest = $.ajax({
  		type: 'DELETE',
  		url: "https://listalous.herokuapp.com/lists/fluxka_2/items/" + itemId
	})
	
	

	console.log("deleteRequest:");
	console.log(deleteRequest);

	


	// First Option: jQuery delete element by itemId
	deleteRequest.done($('[data-id=' + itemId + ']').remove());
	
	

	// Second Option: add Class 'deleted' --> by css: display = none
	 //deleteRequest.done(item.addClass('deleted')); 

})


/* $("#button").click(function sortlist() {

alert("Handler for .click() called.")
});*/

/* Click to order the list by date created instead by date updated */

$("#button").click(function sortlist() {
  
  var itemsData;

  loadRequest.done(function(dataFromServer) {

  // items = Items´ array (with id, description, completed, created_at, updated_at, list_name)
  itemsData = dataFromServer.items;  // dataFromServer = responseText: "{"name": "fluxka_2", "items": [{"id":12889, "description":....}]
})

  var switching = true;
  var shouldSwitch;

  /* Make a loop that will continue until no switching has been done */
  while (switching) {
  	// start by saying: not switching is done:
  	switching = false;
  	
  	for (i=0; i<(itemsData.length - 1); i++) {
  		//start by saying there should be no switchin
  		shouldSwitch = false;
  		console.log("Let´s compare:")
  		console.log(Date.parse(itemsData[i]["created_at"]));
      console.log(Date.parse(itemsData[i+1]["created_at"]));
  		/* check if the next item should switch place with the current item */
  		if (Date.parse(itemsData[i]["created_at"]) > Date.parse(itemsData[i+1]["created_at"])) {
        console.log("Esta fecha de creación: " +  Date.parse(itemsData[i]["created_at"]) + " es posterior a: " + Date.parse(itemsData[i+1]["created_at"]));
  			
  			/* if next item date is lower than current item date, mark as switch and break the loop: */
  			shouldSwitch = true;
  			break; 
  		} 
  	}

  	if (shouldSwitch) {
  // Get all the information we need
  var tmp = itemsData[i];
  itemsData[i] = itemsData[i+1];
  console.log("itemsData[i]");
  console.log(itemsData[i]);
  itemsData[i+1] = tmp;
  console.log("itemsData[i+1]=tmp");
  console.log(tmp);

  var id_i = itemsData[i]["id"];
  var id_ii = itemsData[i+1]["id"];
  console.log("id1=" + id_i);

$("li[data-id=" + id_i + "]").insertBefore( $("li[data-id=" + id_ii + "]") );


  		/* if a switch has been marked, make the switch and mark the switch as done: */
  		
  		switching = true;
  	}
 } 

    /* Add each element of the ordered list to the page 
    itemsData.forEach(function(itemData) {
    addItemToPage(itemData);
  })*/

}) /* End of "sortlist" code */ 

}); /* End of "DOMContentLoaded" */







