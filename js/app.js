$(document).ready(function(){
	//Device event listener
	document.addEventListener("deviceready", onDeviceReady, false);
});

//Check device is ready
function onDeviceReady(){
	console.log("Device Ready...");

	$('#show_more_location').click(function(e){
		e.preventDefault();
		getMoreLocation();
	});

	$('#clear_info').click(function(e){
		e.preventDefault();
		clearInfo();
	});

	$('#other_location').click(function(e){
		e.preventDefault();
		getOtherLocation();
	});

	getDate();

	getLocation();
}

//Get, format, and display current date
function getDate(){
	var currentDate = new Date();
	var datetime = currentDate.getDate() + "/"
			+ (currentDate.getMonth()+1) + "/"
			+ currentDate.getFullYear() + "@"
			+ currentDate.getHours() + ":"
			+ currentDate.getMinutes() + ":"
			+ currentDate.getSeconds();

	$('#datetime_display').html(datetime);
}

// Get current user location
function getLocation(){
	console.log('Getting users location....');

	navigator.geolocation.getCurrentPosition(function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var city ='';
		var state ='';
		var html = '';

		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lon,
			datatype: 'jsonp',
			success: function(response){
				console.log(response);
				//city = response.results[0].address_components[2].long_name;
				//state = response.results[0].address_components[4].short_name;

				city = response.results[1].address_components[2].long_name;
				state = response.results[1].address_components[3].short_name;

				html = '<h1>' + city + ', ' + state + '</h1>';
				$('#myLocation').html(html);

				// Get weather info
				getWeather(city, state);

				$('#show_more_weather').click(function(e){
					e.preventDefault();
					// Close dropdown menu
					$('.navbar-toggle').click();
					getMoreWeather(city, state);
				});
			}
		});
	});
}

// Get some extra location info
function getMoreLocation(){
	console.log('Getting more location info...');

	// Close dropdown menu
	$('.navbar-toggle').click();

	var html = '';

	navigator.geolocation.getCurrentPosition(function(position){
		html = '<ul id = "more_location_list" class="list-group">' + 
			'<li class="list-group-item"><strong>Latitude: </strong>' + position.coords.latitude + '</li>' +
			'<li class="list-group-item"><strong>Longitude: </strong>' + position.coords.longitude + '</li>' +
			'<li class="list-group-item"><strong>Altitude: </strong>' + position.coords.altitude + '</li>' +
			'<li class="list-group-item"><strong>Accuracy: </strong>' + position.coords.accuracy + '</li>' +
			'</ul>';
		$('#more_location_display').html(html);
	});
}


// Get the weather info for the location
function getWeather(city, state){
	console.log('Getting weather for ' + city + '...');

	var html = '';

	$.ajax({
		url: 'http://api.wunderground.com/api/b44f9c530179594c/conditions/q/'+state+'/'+city+'.json',
		datatype: 'jsonp',
		success: function(parsed_json){
			console.log('http://api.wunderground.com/api/b44f9c530179594c/conditions/q/'+state+'/'+city+'.json');
			console.log(parsed_json);

			weather = parsed_json['current_observation']['weather'];
			temperature_string = parsed_json['current_observation']['temperature_string'];
			icon_url = parsed_json['current_observation']['icon_url'];

			html = '<h1 class="text-center"><img src="'+ icon_url + '"> ' + weather + '</h1>' +
				'<h2 class = "text-center">' + temperature_string + '</h2>';

			$('#weather').html(html);
		}
	});
}

// Display more weather info
function getMoreWeather(city, state) {
	console.log('Get more weather info...');

	$.ajax({
		url:'http://api.wunderground.com/api/b44f9c530179594c/conditions/q/'+state+'/'+city+'.json',
		datatype:'jsonp',
		success: function(parsed_json){
			console.log(parsed_json.current_observation);

			temp_f = parsed_json['current_observation']['temp_f'];
			temp_c = parsed_json['current_observation']['temp_c'];
			dewpoint_string = parsed_json['current_observation']['dewpoint_string'];
			dewpoint_f = parsed_json['current_observation']['dewpoint_f'];
			dewpoint_c = parsed_json['current_observation']['dewpoint_c'];
			wind_string = parsed_json['current_observation']['wind_string'];
			wind_dir = parsed_json['current_observation']['wind_dir'];
			wind_mph = parsed_json['current_observation']['wind_mph'];
			visibility = parsed_json['current_observation']['visibility'];
			solarradiation = parsed_json['current_observation']['solarradiation'];
			relative_humidity = parsed_json['current_observation']['relative_humidity'];
			local_time = parsed_json['current_observation']['local_time_rfc822'];
			precip_today_in = parsed_json['current_observation']['precip_today_in'];
			feelslike_string = parsed_json['current_observation']['feelslike_string'];
			feelslike_f = parsed_json['current_observation']['feelslike_f'];
			feelslike_c = parsed_json['current_observation']['feelslike_c'];

			html='<ul id="more_weather_list" class="list-group">' +
				'<li class="list-group-item"><strong>Feels Like: </strong>'+feelslike_string+'</li>' +
				'<li class="list-group-item"><strong>Dewpoint: </strong>'+dewpoint_string+'</li>' +
				'<li class="list-group-item"><strong>Wind: </strong>'+wind_string+'</li>' +
				'<li class="list-group-item"><strong>Wind Speed: </strong>'+wind_mph+'</li>' +
				'<li class="list-group-item"><strong>Humidity: </strong>'+relative_humidity+'</li>' +
				'<li class="list-group-item"><strong>Solar Radiation: </strong>'+solarradiation+'</li>' +
				'<li class="list-group-item"><strong>Precipitation: </strong>'+precip_today_in+'</li>' +
				'</ul>';

			$('#more_weather_display').html(html);
		}
	});
}

// Clear all extra info
function clearInfo(){
	getLocation();

	$('#navbar-toggle').click();
	$('#more_weather_display').html('');
	$('#more_location_display').html('');

}

// Get info for other location
function getOtherLocation(){
	var html = '';

	var city = $('#city').val();
	var state = $('#state').val();

	html = '<h1>' + city + ', ' + state + '</h1>';

	$('#myLocation').html(html);
	getWeather(city, state);

//	$('#city').val('');
//	$('#state').val('');

}