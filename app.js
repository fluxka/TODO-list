document.addEventListener ("DOMContentLoaded", 
	function(event) {

var itemTemplate = $('#templates .item'); // $() is an easy way to fetch an item from the page
var list = $('#list');



// Function: Add Item To Page
var addItemToPage = function(itemData) {

	// creates a copy of a selected element.
	var item = itemTemplate.clone(); 

	// .attr() allows you to get and alter attributes stored in your HTML.
	//In this case, we used it to store the id of an item in a data-id attribute, that is not used for styling, just for data storage.
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


// Add all the Items from Server to the List
// We need to update the page whenever the request succeeds
loadRequest.done(function(dataFromServer) {
  
  // items = Items´ array (with id, description, completed, created_at, updated_at, list_name)
  var itemsData = dataFromServer.items;

  itemsData.forEach(function(itemData) {
    addItemToPage(itemData);
  })

})



// Ask the server to save an item into the database
$('#add-form').on('submit', function(event) {
  event.preventDefault(); // Prevent the page for refreshing, which is the normarl behaviour for a form
  var itemDescription = event.target.itemDescription.value;

  // Make a request to the server using AJAX
  var creationRequest = $.ajax({ 
  type: 'POST',
  url: "http://listalous.herokuapp.com/lists/fluxka_2/items",
  data: { description: itemDescription, completed: false }

  })

// When the request succeeds, parse the data the server sends back.
// And add the new item to the list
creationRequest.done(function(itemDataFromServer) {
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
  		if (itemDataFromServer.completed) {
    		item.addClass('completed')
  		} else {
    		item.removeClass('completed')
  		}
	})	

})


$('#list').on('click', '.delete-button', function(event) {
	// Get all the information we need
	var item = $(event.target).parent();
	var isItemDeleted = item.hasClass('deleted');
	var itemId = item.attr('data-id');
	
	// DELETE request
	var deleteRequest = $.ajax({
  		type: 'DELETE',
  		url: "https://listalous.herokuapp.com/lists/fluxka_2/items/" + itemId
	})

	
	// First Option: jQuery delete element by data attribute
	$("ul li[data-id=" + itemId + "]").remove();

	// Second Option: add Class 'deleted' --> by css: display = none
	/* deleteRequest.done(item.addClass('deleted')); */

})

}
);


