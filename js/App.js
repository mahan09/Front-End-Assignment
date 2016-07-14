 $(document).ready(function() {


// Page transition and Responsive navigation Bar

    $( "#your-page" ).fadeIn(1000);
    $('.nav-text').click(function() {
    $('.top-nav > ul').toggleClass('show-menu', 'slow');
    });

    // Using Ajax request to load the json file
   var makeRequest=function(url)
				{
					return new Promise(function(resolve,reject){
						  //I want to 'talk' to the web server
						  var ajaxRequest = new XMLHttpRequest(); 
						  //declare a function
						  var handleResponse=function()
						  {
							  //has all the data loaded?
							  if(ajaxRequest.readyState===4)
							  {
								  //successful response?
								  if(ajaxRequest.status===200)
								  {
									  //convert from a string into js objects
									  var clothes=JSON.parse(ajaxRequest.responseText);
									  resolve(clothes);
								  }else{
									  reject("Failed to get a successful response");
								  }
							  }
						  }
						  //when the server responds call the function handleResponse() 
						  ajaxRequest.addEventListener("readystatechange",handleResponse,false); 
						  //I want to request the file 'films.json', but don't send the request yet.
						  ajaxRequest.open('GET', url, true);
						  //Now send off the request to the server
						  ajaxRequest.send(null);
					})
				}
				  
				  
				  
                // Query function has been used to enbale users to perform a search by using regular expression which should match products name or category.
				  $('#search').keyup(function(clothes)
				  {
					var searchField = $('#search').val();
					var filter = $(this).val(), count = 0;
					var regex = new RegExp(searchField, "i");
					var clothesData = clothes.products;
					var view = '<div class="row">';
					var numberItems = count;
					$.getJSON('json/clothes.json', function(data) {
					$.each(data.products, function(key, product){
						if ((product.name.search(regex) != -1) || (product.category.search(regex) != -1))
							{
							view += '<div class="col-md-5"><img class="img-responsive"  src="'+product.ImgPath+'" alt="'+ product.name +'" /></div>';
							view += '<br>';
							view += '<div class="col-md-6">';
							view += '<b><li><h5>' +"Brand: " + product.name + '</h5></li></b>';
							view += '<b><li><h5>' +"Type: "+ product.category + '</h5></li></b>';
							view+='<b><h4><a href="'+product.link +'?id='+ product.id +'">View More</a></h4></b>';
							view += '<hr>';
							view += '</br>';
							view += '</br>';
							view += '</br>';
							view += '</br>';
							view += '</div>';
							count++;
							}
							});
							$('#results').html(view);
							  
							$("#filter-count").text(count + " " +"Items Found");
						});	  
				  });

				  
                  // This function displays json images within the index.html page which is  the first page which users will see once they visit the webpage.
				var displayImage=function(clothes)
				  {
				  var view = '<div class="row">';
				  var clothesData = clothes.products;
				  clothesData.forEach(function(product)				  
				  {
					view += '<div class="col-md-5"><img class="img-responsive"  src="'+product.url+'" alt="'+ product.indexname +'" /></div>';
					view += '<br>';
					view += '<br>';
					view += '<div class="col-md-6">';
					view += '<b><h4>' + product.indexname + '</h4></b>';
					view += '<br>';
					view += '<br>';
					view += '</div>';
				  })
				  
					   $('#responsive').html(view);
				  }
                
                    // This function will display the current products on the search page in order for users to see what are currently avaliable. 				  
				var displayResults=function(clothes)
				{
				var view = '<div class="row">';
				var clothesData = clothes.products;
				clothesData.forEach(function(product)				  
				{
					view += '<div class="col-md-5"><img class="img-responsive"  src="'+product.ImgPath+'" alt="'+ product.indexname +'" /></div>';
					view += '<br>';
					view += '<div class="col-md-6">';
					view += '<b><h5>' +"Brand: " + product.indexname + '</h5></b>';
					view += '<b><h5>' +"Type: "+ product.category + '</h5></b>';
					view+='<b><h4><a href="'+product.link +'?id='+ product.id +'">View More</a></h4></b>';
					view += '<hr>';
					view += '</br>';
					view += '</br>';
					view += '</br>';
					view += '</div>';
				})
				     $('#results').html(view);
				}
                    
                   // This function needs to be implemented in order to define the stated above functions and to display any ajax errors in the console log.
				var ajaxError=function(errMsg)
				{
				    console.log(errMsg);
				}
				var myPromise=makeRequest("json/clothes.json");
				myPromise.then(displayResults,ajaxError);
				myPromise.then(displayImage,ajaxError);
				
				
				
				
                    // This function is in charge of picking the ID for that particular product and it will redirect users view page in order to display more information about that product.               
				var bits = window.location.href.split("?");
				console.log(bits[1]);
				var queryBits = bits[1].split('=');
				console.log(queryBits[1]);
				cache:false;  
			      // Display data for each ID which is linked to the json file
				  $.getJSON("json/clothes.json", function(result) {
				    for ( var i=0; i<result.products.length; i++ ) {
				      if (result.products[i].id == queryBits[1]) {
					var prod = result.products[i];
					var view = '<div class="row">';
					view += '<div class="col-md-5"><img class="img-responsive"  src="'+prod.ImgPath+'" alt="'+ prod.name +'" /></div>';
					view += '<br>';
					view += '<div class="col-md-6">';
					view += '<b><li><h5>'+"Brand: " + prod.name + '</h5></li></b>';
					view += '<b><li><h5>' +"Colour: "+ prod.Colour + '</h5></li></b>';
					view += '<b><li><h5>' +"Size: "+ prod.Size + '</h5></li></b>';
					view += '<b><li><h5>' +"Category: "+ prod.category + '</h5></li></b>';
					view += '<b><li><h5>' +"Price: "+ prod.Price + '</h5></li></b>';
					view += '</div>';
				      }
					view += '</div>';
						$('#details').html(view);
				    }
				  });
				  
                  
				// variables declared for the Google Map settings
				var infowindow = new google.maps.InfoWindow();
				var map;
				var infoWindow;
				var pos;
				var marker;
				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;
				
				// Main function in order to get Google Map running on the HTML page
				function initMap()
				{
			
			
				// function to display the user current latitude and longitude in console log if the location works
				function itWorks(position)
				{
				console.log('Current latitude: '+position.coords.latitude);
				console.log('Current longitude: '+position.coords.longitude);
				}
			
				// function to display error if the user location cannot be obtained
				function itDoesntWork(error)
				{
				console.log('There is an error '+error);
					
				}
			
				// function to display the user current location on the map if its succesful by centre the map and view in satelite mode
				navigator.geolocation.getCurrentPosition(itWorks, itDoesntWork);
				map = new google.maps.Map(document.getElementById('map'),
				{
				  center: pos,
				  mapTypeId: google.maps.MapTypeId.SATELLITE,
				  zoom: 12,
				});
			
				// function to display the map on current users location if system has succesfully traced users longitude and latitude
				if (navigator.geolocation) {
				  navigator.geolocation.getCurrentPosition(function(position) {
				    var pos = {
				    lat: position.coords.latitude,
				    lng: position.coords.longitude
				    };
			
				    var trafficLayer = new google.maps.TrafficLayer();
					trafficLayer.setMap(map);
				    var marker = new google.maps.Marker({
				    position:pos,
				    animation: google.maps.Animation.DROP,
				    map: map,
			
				  });
		
				// function to make the markers bounce on the map when users view the map
				marker.addListener('click', toggleBounce);
				function toggleBounce()
				{
				    if (marker.getAnimation() !== null)
				    {
				      marker.setAnimation(null);
				    }
				    else
				    {
				      marker.setAnimation(google.maps.Animation.BOUNCE);
				    }
				}
					
				// Instantiate a directions service.
                
				directionsService = new google.maps.DirectionsService,
				directionsDisplay = new google.maps.DirectionsRenderer({
				  map: map
				})
				
				// function where it grabs the id from the link which users click on and then compare the ID to the product and then display directions from user lcoation to the destination.
				var bits = window.location.href.split("?");
				var queryBits = bits[1].split('=');
				$.getJSON('json/clothes.json', function(data) {
				  for ( var i=0; i<data.products.length; i++ ) {
						if (data.products[i].id == queryBits[1]) {
						var prod = data.products[i];
						var p1 = new google.maps.LatLng(pos);
						var latLng = new google.maps.LatLng(prod.lat, prod.lng);
						function calculateAndDisplayRoute(directionsService, directionsDisplay)
                        {
						  var selectedMode = document.getElementById('mode').value;
						  directionsService.route({
						    origin: p1,  
						    destination: latLng, 
						    travelMode: google.maps.TravelMode[selectedMode]
						  },
                          
                          function(response, status) {
						    if (status == google.maps.DirectionsStatus.OK) {
						      directionsDisplay.setDirections(response);
						    } else {
						      window.alert('Directions request failed due to ' + status);
						    }
						  });
						}
						
						  calculateAndDisplayRoute(directionsService, directionsDisplay);
						  document.getElementById('mode').addEventListener('change', function() {
						  calculateAndDisplayRoute(directionsService, directionsDisplay);
						});
						}
					}
				});
			
			// function where it displays the distance from user current location to the destination by displaying in miles.
				var bits = window.location.href.split("?");
				var queryBits = bits[1].split('=');
				$.getJSON('json/clothes.json', function(result) {
				for ( var i=0; i<result.products.length; i++ ) {
				if (result.products[i].id == queryBits[1]) {
				var prod = result.products[i];
							var output = '<div class="row">';
							var p1 = new google.maps.LatLng(pos);
							var p2 = new google.maps.LatLng(prod.lat, prod.lng);
							var latLng = new google.maps.LatLng(prod.lat, prod.lng);
							var Distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000 * 0.6214 *10).toFixed(2) + " " + "Miles";
							console.log("Store Distance:"  + Distance);
							output += '</div>';
							output += '<b><li><h5>' +"Distance From Your location: "+ Distance + '</p></li></h5>';
							output += '</div>';
						}
						 $('#distance').html(output);
					}
				});
				
			
			// the code below demonstrate a text when the marker is clicked for user curret location which will display a text in seperate style.
			var contentString = '<h2 id="firstHeading" class="firstHeading">Your Are Here</h2>';
			infoWindow = new google.maps.InfoWindow({
			content: contentString
				});
			marker.addListener('click', function() {
			infoWindow.open(map, marker);
				});
			infoWindow.setPosition(pos);
			map.setCenter(pos);
				}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
				});
				}
				else
				{
			handleLocationError(false, infoWindow, map.getCenter());
				}
		
	}
	// Launch the event listener for the travel mode dropdown box when the map is fully loaded onto the webpage.
	window.addEventListener("load",initMap,false);
        
});