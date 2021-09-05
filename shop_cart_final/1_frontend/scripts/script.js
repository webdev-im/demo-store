// Variables
// -- API
const PRODUCTS_URI = 'https://fakestoreapi.com/products';

// -- DOM elements
const productsOutputElement = document.querySelector('#products');
const cartOutputElement = document.querySelector('#cart');

// -- logic
const products = [];

// Functions

// -- showing products from API
const showProducts = (endpoint) => {
  return fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      productsOutputElement.innerHTML = data.reduce((total, item) => {
        total += `
        <div class="product">
            <img src="${item.image}"/>
            <div class="bottom-text">
            <h5>${item.title}</h5>
            <p>${item.category}</p>
            <p>$${item.price}</p>
            </div>
            <button class="product__add-to-cart-btn" data-id="${
              item.id
            }">Add to cart</button>
        </div>
        `;

        return total;
      }, '');

      const addToCartBtns = document.querySelectorAll(
        '.product__add-to-cart-btn'
      );

      addToCartBtns.forEach((btn) =>
        btn.addEventListener('click', (e) => addProductToCart(e))
      );

      // saving products to global products array
      products.push(...data);
    })
    .catch((err) => console.log(err));
};

// -- showing cart items from local storage
const showCartItems = () => {
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (cartItems.length === 0) {
    cartOutputElement.innerHTML = '';
    return;
  }

  cartOutputElement.innerHTML = `
  <table>
    <thead>
      <tr class="header-table">
        <th></th>
        <th>Title</th>
        <th>Quantity</th>
        <th>Total price</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${cartItems.reduce((total, item) => {
        total += `
          <tr>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.title}</td>
            <td>
            <button data-id="${
              item.id
            }" class="cart-item-qty-action">-</button> 
            ${item.qty} 
            <button data-id="${item.id}" class="cart-item-qty-action">+</button>
            </td>
            <td>$ ${item.price * item.qty}</td>
            <td><button class="remove-cart-item-btn" data-id="${
              item.id
            }">Remove</button></td>
          </tr>
          `;
        
        //! showing cart quantity
        
        // let basketQty = 0;

        // if (total.length === 2) {
        //   console.log(`It works`)
        // } else {
        //   console.log(`You are a muppet`);
        // }
        // basketQty = total.length
        // console.log(basketQty);

        // return total;

      }, '')}
    </tbody>
  </table>
  <p class="subtotal"><span style="color: black">Subtotal:</span> $${cartItems.reduce(
    (total, item) => (total += item.qty * item.price),
    0
  ).toFixed(2)}</p>
  `;

  // ---- remove item from cart
  const removeCartItemBtns = document.querySelectorAll('.remove-cart-item-btn');

  removeCartItemBtns.forEach((btn) =>
    btn.addEventListener('click', removeProductFromCart)
  );

  // ---- change cart item quantity
  const cartItemQtyActionBtns = document.querySelectorAll(
    '.cart-item-qty-action'
  );

  cartItemQtyActionBtns.forEach((btn) =>
    btn.addEventListener('click', changeCartItemQty)
  );
};

// -- adding product to cart
const addProductToCart = (e) => {
  const productId = +e.target.dataset.id;
  const product = products.find((item) => item.id === productId);

  // ---- if it's first item, thats been added
  if (!localStorage.getItem('cartItems')) {
    product.qty = 1;

    localStorage.setItem('cartItems', JSON.stringify([product]));
  } else {
    // ---- if its, not first item, thats been added

    let productsFromLocalStorage = JSON.parse(
      localStorage.getItem('cartItems')
    );

    // ------ if item already exists
    if (
      productsFromLocalStorage.findIndex((item) => item.id === productId) >= 0
    ) {
      productsFromLocalStorage.forEach((product) => {
        if (product.id === productId) {
          if (product.inStock > product.qty) {
            product.qty += 1;
          } else if (
            product.id === productId &&
            product.inStock <= product.qty
          ) {
            return alert(`Only ${product.inStock} in stock, cann't add more`);
          }
        }
      });
    } else {
      // ------ if item is not existing
      product.qty = 1;
      productsFromLocalStorage.push(product);
    }

    //  ----- sending to local storage updated productsFromLocalStorage
    localStorage.setItem('cartItems', JSON.stringify(productsFromLocalStorage));
  }

  // ---- updating Cart UI
  showCartItems();
};

// -- removing product from cart
const removeProductFromCart = (e) => {
  const productId = +e.target.dataset.id;
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  let updatedCartItems = cartItems.filter((item) => item.id !== productId);

  // ---- updating cartItems property in local storage
  localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

  // ---- updating Cart UI
  showCartItems();
};

// -- change cart item (product) quantity
const changeCartItemQty = (e) => {
  const productId = +e.target.dataset.id;
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  switch (e.target.innerText) {
    case '+':
      cartItems.forEach((item) => {
        if (item.id === productId && item.qty<10) {
          return (item.qty += 1);
        } else if (item.id === productId && item.inStock <= item.qty) {
          return alert(`Only ${item.inStock} in stock, cann't add more`);
        }
      });

      break;
    case '-':
      cartItems.forEach((item) => {
        if (item.id === productId && item.qty > 1) {
          item.qty -= 1;
        }

        return;
      });
      break;
    default:
      return;
  }

  localStorage.setItem('cartItems', JSON.stringify(cartItems));

  // ---- updating Cart UI
  showCartItems();
};

// Events
document.addEventListener('DOMContentLoaded', () => {
  showProducts(PRODUCTS_URI);
  showCartItems();
});
