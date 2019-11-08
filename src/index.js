window.onload = function(){
	
	var wrapper = document.getElementsByTagName('main')[0];
    var popupCart = document.getElementsByClassName('popupCart')[0];
    var cartList = document.getElementsByClassName('cartList')[0];

document.getElementsByClassName('drop-menu')[0].addEventListener('click', function(){ 
	document.getElementsByClassName('menu')[0].classList.toggle('show');
}); 


wrapper.addEventListener('click', function(event){
	if(event.target.nodeName=='BUTTON'){
		 var element = event.target.parentNode.cloneNode(true);
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
         elementsNumberControl.innerHTML = '<div><p>+</p></div><p class = "counter">1</p><div><p>-</p></div>';
         elementsNumberControl.classList.toggle('elementsNumberControl');

		 element.replaceChild(elementsNumberControl,cartButton);

		 cartList.appendChild(element);
		 computeTotalSum();


	}
 
});

function updateOverallCounter(totalItemsNumber){
	if(totalItemsNumber==0){
		document.getElementById('elementsInCart').textContent = '';
	}
	else{
		document.getElementById('elementsInCart').textContent = totalItemsNumber;
	}
}

cartList.addEventListener('click', function(event){
	if(event.target.textContent=='+'){       //increase number of same elements
		var counter = event.target.parentNode.parentNode.getElementsByClassName('counter')[0];
		var number = parseInt(counter.textContent, 10);
		number++;
		counter.textContent = number;
	}
	else if(event.target.textContent=='-'){  //decrease number of same elements
		var counter = event.target.parentNode.parentNode;
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

function computeTotalSum(){
	var items = cartList.getElementsByClassName('item');
	var totalItemsNumber = 0;
	var totalSum = 0;
	for(var i = 0; i<items.length; i++){
		var priceStr = items[i].getElementsByClassName('price')[0].textContent;
		priceStr = priceStr.substr(0, priceStr.indexOf('$', 1));
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



document.getElementsByClassName('cart')[0].addEventListener('click', function(){  //listener to 'Cart' in menu
    popupCart.classList.toggle('show');
}); 

popupCart.getElementsByClassName('close')[0].addEventListener('click', function(){   //listener to cross icon in the cart
	 popupCart.classList.toggle('show');
});

}