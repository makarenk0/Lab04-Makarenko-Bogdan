import './scss/main.scss';
import $ from "jquery";


var popupCart;
var cartList;
var categoryList;
var itemNodeBuffer;
var currentCategory;

function loadListOfAvailableCategories() {
    var allCategoriesLink = $('<a>', {
                class: 'categoryListElement',
                href: 'https://nit.tron.net.ua/api/product/list',
            }).appendTo(categoryList);
    allCategoriesLink.append("All categories");
  
// get categories from the api
	$.get({
	url : 'https://nit.tron.net.ua/api/category/list', 
	dataType: 'json', 
	success: function(json){
		json.forEach(function(element){
			var listElement = $('<a>', {
                class: 'categoryListElement',
                href: 'https://nit.tron.net.ua/api/product/list/category/'+element.id,
            }).appendTo(categoryList);
            listElement.append(element.name);
		});
		loadAllCategories();   //when you reload categories list the whole page displays all products
	}
});
}

function loadAllCategories(){
	$.get({
		url : 'https://nit.tron.net.ua/api/product/list',
		dataType: 'json',
		success: function(json){
			currentCategory = 'All categories';
			displayCategory(json);
		}
	});
}


function getCategory(link) {   // to get it from the api
	$.get({
		url : link,
		dataType: 'json',
		success: function(json){
			displayCategory(json);
		}
	});
}

function displayCategory(json) {   // to display it on the site
	
		json.forEach(function(element){
			var block = $('<div>', {
			    class: 'col item',
			});
			block.attr('data-id', element.id);

			$('<img>', {
			    src: element.image_url,
			    alt: 'pic',
			}).appendTo(block);
			var link = $('<a>', {
			    href: 'https://nit.tron.net.ua/api/product/'+element.id,  //store the url of product in api
			}).appendTo(block);
			link.append(element.name);

			$('<button>', {
				class: 'addToCart',
			}).appendTo(block);

			var price = $('<p>', {
				class: 'price',
			}).appendTo(block);

			if(element.special_price==null){
				price.append(element.price+' ₴');
			}
			else{
				price.append(element.special_price+' ₴'+'<br><del>'+element.price+' ₴</del>');
			}
			$('.catalog .row').append(block);

		});
//tracking clicks on the items except the cart button
		$('.item').on('click', function(event){
			if(event.target.nodeName!="BUTTON"){
				event.preventDefault();
				itemNodeBuffer = event.target.closest('.item');
	            var href = ($(event.target.closest('.item')).find('a')).attr("href");

	            displayBackToCategoryButton(currentCategory);
	            getAndDisplayProduct(href);
			}
	         
	     });
}

function getAndDisplayProduct(href) {
	$('.catalog').toggleClass('hide');

	$.get({
		url : href,
		dataType: 'json',
		success: function(element){   //function to form node
			var block = $('<div>', {
			    class: 'singleItem',
			});
	        var name = $('<p>', {
	        	class: 'title',
	        }).appendTo(block);
	        name.append(element.name);

	        $('<img>', {
	        	 src: element.image_url,
	        }).appendTo(block);

            var price = $('<p>', {
				class: 'price',
			}).appendTo(block);
			if(element.special_price==null){
				price.append(element.price+' ₴');
			}
			else{
				price.append(element.special_price+' ₴'+'&nbsp;&nbsp;<del>'+element.price+' ₴</del>');
			}

			var textContainer = $('<div>',{
				class: 'textContainer',
			}).appendTo(block);

			var description = $('<p>', {
	        	 class: 'description',
	        }).appendTo(textContainer);
	        description.append(element.description);

	        $('<button>', {
				class: 'addToCart fullProductButton',
			}).appendTo(block);

	        $('main').append(block);
		}
	});
	
}

function displayBackToCategoryButton(category){
	var button = $('.backToCategory');
	button.toggleClass('show');
	
	button.find('p').append(currentCategory);

	button.on('click', function(event){
		button.toggleClass('show');
		$('.singleItem').remove();
		$('.catalog').toggleClass('hide');
		button.find('p').empty();
		button.off('click');
	});
	
}


function sendUserData(){
	var userData = [];
	let data = {};
	
    $('#form').find('input').each(function() {
     	userData.push($(this).val());
	});
	data['token'] = 'nbGG7zqrNsWX2mKCEIeX';
	data['name'] = userData[0];
	data['phone'] = userData[1];
	data['email'] = userData[2];

	var cartContent = $('.cartList').find('.item');
	for(var i = 0; i<cartContent.length; i++){
		data['products['+cartContent[i].getAttribute('data-id')+']'] = cartContent[i].getElementsByClassName('counter')[0].textContent;
	}
	
	$.post({
     url: 'https://nit.tron.net.ua/api/order/add',
     data: data,
     success: function(element){
     	$('.errorText').empty();
     	for(var type in element.errors){   //output only first error(if you correct first one it will output the next error)
     		message(element.errors[type]);
     		return;
     	}
        message('Success');
        cleanCart();
        setTimeout(function(){
        	$('.userForm').toggle();
        }, 2500);

     },
    });

}
function message(msgString){
	$('.errorText').append(msgString);
     		$('.errorBox').css('opacity', '1');
     		setTimeout(function(){
                 $('.errorBox').css('opacity', '0');
            }, 3000);
}


window.onload = function(){
	popupCart = $('.popupCart')[0];
	cartList = $('.cartList')[0];
	categoryList = $('.categoryList')[0];



$('.drop-menu').on('click', function(){ 
	$('.menu').toggleClass('show');
}); 


$('main').on('click', function(event){
	if(event.target.classList.contains("addToCart")){
		var element;
        if(event.target.classList.contains("fullProductButton")){
            element = itemNodeBuffer.cloneNode(true);
            
       }
        else{
        	element = event.target.parentNode.cloneNode(true);
        }

		 var elementsInCartList = cartList.getElementsByClassName('item');

		 for(var i = 0; i<elementsInCartList.length; i++){   //if item is already in the cart, only increase it`s number
		 	if(elementsInCartList[i].getElementsByTagName('a')[0].getAttribute('href')==element.getElementsByTagName('a')[0].getAttribute('href')){
		 		var counter = elementsInCartList[i].getElementsByClassName('counter')[0];
		 		var number = parseInt(counter.textContent, 10);
		 		number++;
		        counter.textContent = number;
		        computeTotalSum();
		        return;
		 	}
		 	
		 }

		 var cartButton = element.getElementsByClassName('addToCart')[0];
         var elementsNumberControl = document.createElement('div');   //create a block with buttons to change number of products
         elementsNumberControl.innerHTML = '<div class = "minus">-</div>&nbsp;<span class = "counter">1</span>&nbsp;<div class="plus">+</div>';
         elementsNumberControl.classList.toggle('elementsNumberControl');

		 element.replaceChild(elementsNumberControl,cartButton);
		 

		 cartList.appendChild(element);
		 computeTotalSum();


	}
 
});
//click on the category in the list
$('.categoryList').on('click', function(event){
	event.preventDefault();
	$('main .row').empty();
	var href = $(event.target).attr("href");
	currentCategory = $(event.target).text();
	getCategory(href);

	if($('main .catalog').hasClass('hide')){
		$('.backToCategory').click();
	}
});


cartList.addEventListener('click', function(event){
	if(event.target.className=='plus'){       //increase number of same elements
		var counter = event.target.parentNode.getElementsByClassName('counter')[0];
		var number = parseInt(counter.textContent, 10);
		number++;
		counter.textContent = number;
	}
	else if(event.target.className=='minus'){  //decrease number of same elements
		var counter = event.target.parentNode;
		var number = parseInt(counter.getElementsByClassName('counter')[0].textContent, 10);
		number--;
		if(number==0){        //delete element from cart if there are 0 of them
			counter.parentNode.remove();   
		}
		else{
			counter.getElementsByClassName('counter')[0].textContent = number;
		}
		
	}
	computeTotalSum();
});


$('.cart').on('click', function(){  //listener to 'Cart' in menu
    popupCart.classList.toggle('show');
}); 

$('.cartWrapper .close').on('click', function(){   //listener to cross icon in the cart
	 popupCart.classList.toggle('show');
});

$('.userForm .close').on('click', function(){   //listener to cross icon in the cart
	 $('.userForm').toggle();
});

$('.categoryListButton').on('click', function(){   //listener to cross icon in the cart
	 categoryList.classList.toggle('show');
});

$('.cartWrapper .buyButton').on('click', function(){   //listener to cross icon in the cart
	 $('.userForm').toggle();
});

$('.sendButton').on('click', function(){
	sendUserData();
});

loadListOfAvailableCategories();

}

function computeTotalSum(){
	var items = cartList.getElementsByClassName('item');
	var totalItemsNumber = 0;
	var totalSum = 0;
	for(var i = 0; i<items.length; i++){
		var priceStr = items[i].getElementsByClassName('price')[0].textContent;
		priceStr = priceStr.substr(0, priceStr.indexOf(' ', 1));
		var price =  parseFloat(priceStr, 10);   //price of item
		var itemsNum = parseInt(items[i].getElementsByClassName('counter')[0].textContent, 10); //number of the same items
		totalItemsNumber += itemsNum; //computing total items number
		totalSum += price*itemsNum;  //computing total sum
	}
	totalSum = totalSum.toFixed(2);
	updateTotalSum(totalItemsNumber, totalSum);
	updateOverallCounter(totalItemsNumber);

}

function updateTotalSum(totalItemsNumber, totalSum){
	popupCart.getElementsByClassName('itemsNumber')[0].textContent = totalItemsNumber;
	popupCart.getElementsByClassName('totalSum')[0].textContent = totalSum;
}

function updateOverallCounter(totalItemsNumber){
	if(totalItemsNumber==0){
		document.getElementById('elementsInCart').textContent = '';
	}
	else{
		document.getElementById('elementsInCart').textContent = totalItemsNumber;
	}
}

function cleanCart(){
	$('.cartList').empty();
	computeTotalSum();
}