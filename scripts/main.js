import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";

  array.forEach((taco) => {
    refStuff += card(taco);
    });
  renderToDom("#cards", refStuff);
}

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
    const [, id] = event.target.id.split('--');
    
    const index = referenceList.findIndex((item) => item.id === Number(id)) // Number is a JS method that turns a string into a number which I need b/c the id on the right side of condition is coming in as a string
    
    referenceList[index].inCart = !referenceList[index].inCart // Toggling whether or not the obj's inCart is true or false

    cartTotal();

    renderCards(referenceList);
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const userInput = event.target.value.toLowerCase();
  const searchResult = referenceList.filter((taco) =>
    taco.title.toLowerCase().includes(userInput) ||
    taco.author.toLowerCase().includes(userInput) || 
    taco.description.toLowerCase().includes(userInput)
  )
  renderCards(searchResult);
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    const free = referenceList.filter((taco) => taco.price <= 0);
    renderCards(free);
  }
  if(event.target.id.includes('cartFilter')) {
    const wishlist = referenceList.filter((taco) => !taco.inCart); // SAME AS: taco.inCart === true
    renderCards(wishlist);
  }
  if(event.target.id.includes('books')) {
    const books = referenceList.filter((item) => item.type.toLowerCase() === 'book');
    renderCards(books);
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList);
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().forEach(item => {
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(item => item.inCart); // Gives a list of all the items in the cart
  const total = cart.reduce((a, b) => a + b.price, 0); // int value needs to be set to 0
  const free = card.some(taco => taco.price <= 0);
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) {
    document.querySelector("#includes-free").innerHTML = 'INCLUDES FREE ITEMS'
  } else {
    document.querySelector("#includes-free").innerHTML = ''
  }
}

// RESHAPE DATA TO RENDER TO DOM
// .map()
const productList = () => {
  return referenceList.map(item => ({ 
    title: item.title,
    price: item.price,
    type: item.type
  })) // DON'T forget the () around the obj I want created. This .map is returning an array of objects b/c I told it to. It always returns an array
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
