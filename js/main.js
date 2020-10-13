function ProductBlock(name, photo, cost, type, desc, pres, brand) {
  this.name = name;
  this.photo = photo;
  this.cost = cost;
  this.productType = type;
  this.description = desc;
  this.presence = pres;
  this.brand = brand;
}

function addProductBlock(block) {
  productBox.innerHTML += `<div class="main__products-item">
        <div><img src="./images/${block.photo}" alt="" srcset=""></div>
        <span>${block.name}</span>
        <span>Description: ${block.description}</span>
        <span>The brand: '${block.brand}'</span>
        <span>Cost: ${block.cost}$</span>
        <span>In stock: ${block.presence}</span>
        <form action=""><button type="button" class="main__products-item-btn" onclick="buyProduct('${block.name}', '${block.cost}', '${block.presence}')">ADD TO CART</button></form>
    </div>
    `;
}

function addProductsNav(valueOfProducts, boxes) {
  valueOfProducts = Math.round(valueOfProducts.length / valueOfBoxes + 0.4);
  productBox.innerHTML += `
        <div class="main__products__nav">
            <div class="products__nav-prev"><span><</span></div>
            ${'<div class="products__nav-item"><span>0</span></div>'.repeat(
              valueOfProducts
            )}
            <div class="products__nav-next"><span>></span></div>
        </div>
    `;
  let allNavItems = document.body.querySelectorAll(".products__nav-item");
  let i = 0;

  allNavItems.forEach((elem) => {
    i++;
    elem.style = "color: white";
    elem.firstChild.id = `${i}`;
    elem.onclick = function () {
      currentPage = elem.firstChild.id;
      selectNavItem(elem.firstChild.id, boxes);
    };
    elem.firstChild.innerHTML = `${i}`;
  });

  if (valueOfProducts == 1) currentPage = "1";
  let prevBtn = document.body.querySelector(".products__nav-prev");
  prevBtn.onclick = function () {
    if (Number(currentPage) > 1) {
      selectNavItem(Number(currentPage) - 1, boxes);
      currentPage = String(Number(currentPage) - 1);
      document.getElementById(String(Number(currentPage) + 1)).style =
        "color: white";
      document.getElementById(currentPage).style =
        "color: yellow; text-shadow: 0px 0px 10px white;";
    } else {
      selectNavItem(Number(currentPage), boxes);
    }
  };

  let nextBtn = document.body.querySelector(".products__nav-next");
  nextBtn.onclick = function () {
    if (Number(currentPage) < valueOfProducts) {
      selectNavItem(Number(currentPage) + 1, boxes);
      currentPage = String(Number(currentPage) + 1);
      document.getElementById(String(Number(currentPage) - 1)).style =
        "color: white";
      document.getElementById(currentPage).style =
        "color: yellow; text-shadow: 0px 0px 10px white;";
    } else {
      selectNavItem(Number(currentPage), boxes);
    }
  };

  document.getElementById(currentPage).style =
    "color: yellow; text-shadow: 0px 0px 10px white;";
  return false;
}

function selectNavItem(page, boxes) {
  let range = page * valueOfBoxes;
  let itemsOnPage = boxes.slice(range - valueOfBoxes, range);
  productBox.innerHTML = "";

  itemsOnPage.forEach((elem) => addProductBlock(elem));
  addProductsNav(boxes, boxes);
  document.getElementById(currentPage).style =
    "color: yellow; text-shadow: 0px 0px 10px white;";
}
/////

function buyProduct(blockName, blockPrice, blockAvailable) {
  if (blockAvailable == "YES") {
    document.querySelector('.is-empty').style = "display: none;";
    shoppingBusketPrices.push(Number(blockPrice));
    shoppingBusket.push(blockName);
    let newIdName = blockName
      .split("")
      .filter((elem) => elem != " ")
      .join("");
    if (document.getElementById(newIdName) == null) {
      document.querySelector(
        ".cart__buy"
      ).innerHTML += `<div id="${newIdName}" class="cart__buy-item">
      ${shoppingBusket.filter((elem) => elem == blockName).length}
      x
      ${blockName}</div>`;
    } else {
      document.getElementById(newIdName).textContent = `${
        shoppingBusket.filter((elem) => elem == blockName).length
      }
  x
 ${blockName}`;
    }
  }
  document.querySelector('.total-price').textContent = shoppingBusketPrices.reduce((elem1,elem2)=> elem1 + elem2);
  return false;
}

///////
function searchFunc() {
  let filterCostMin = Number(
    document.getElementById("mn_cost-val").textContent
  );
  let filterCostMax = Number(
    document.getElementById("mx_cost-val").textContent
  );
  let searchBar = document.forms.search.search_bar;
  let searchedProducts = [];
  let searchedProductsClone = allProducts.filter((elem) => {
    return elem.name
      .toUpperCase()
      .includes(searchBar.value.trim().toUpperCase());
  });
  if (document.getElementById("Tobaco").checked) {
    searchedProducts = searchedProducts.concat(
      searchedProductsClone.filter((elem) => {
        return elem.productType.includes("TOBACO");
      })
    );
  }
  if (document.getElementById("Filters").checked) {
    searchedProducts = searchedProducts.concat(
      searchedProductsClone.filter((elem) => {
        return elem.productType.includes("FILTERS");
      })
    );
  }
  if (document.getElementById("Papper").checked) {
    searchedProducts = searchedProducts.concat(
      searchedProductsClone.filter((elem) => {
        return elem.productType.includes("PAPPER");
      })
    );
  }
  //available
  if (document.getElementById("Cigares").checked) {
    searchedProducts = searchedProducts.concat(
      searchedProductsClone.filter((elem) => {
        return elem.productType.includes("CIGARES");
      })
    );
  }
  if (searchedProducts.length === 0) {
    searchedProducts = searchedProducts.concat(searchedProductsClone);
  }
  if (document.getElementsByName("availableProd")[0].checked) {
    searchedProducts = searchedProducts.filter((elem) => {
      return elem.presence == "YES";
    });
  } else if (document.getElementsByName("availableProd")[1].checked) {
    searchedProducts = searchedProducts.filter((elem) => {
      return elem.presence == "NO";
    });
  } else if (document.getElementsByName("availableProd")[2].checked) {
  }
  if (filterCostMin > 0 || filterCostMax > 0) {
    searchedProducts = searchedProducts.filter((elem) => {
      return elem.cost >= filterCostMin;
    });
    searchedProducts = searchedProducts.filter((elem) => {
      return elem.cost <= filterCostMax;
    });
  }
  productBox.innerHTML = "";
  console.log(searchedProducts);
  if (searchedProducts.length == 0) {
    productBox.innerHTML = "";
    return false;
  }
  selectNavItem(1, searchedProducts);
  searchBar.value = "";
  return true;
}

function mx_cost_change() {
  document.getElementById("mx_cost-val").textContent = document.getElementById(
    "mx_cost"
  ).value;
}

function mn_cost_change() {
  document.getElementById("mn_cost-val").textContent = document.getElementById(
    "mn_cost"
  ).value;
}

///--------------------------------
let currentPage = 1;
let shoppingBusketPrices = [];
let shoppingBusket = [];
let productBox = document.body.querySelector(".main__products");
let valueOfBoxes = 6;
let form = document.forms.search;
function handleForm(event) {
  event.preventDefault();
}
form.addEventListener("submit", handleForm);

///--------------------------------

let DPS9 = new ProductBlock(
  "Davidoff premium selection 9",
  "Davidoff-Premium-Selection-9.jpg",
  140,
  "CIGARES",
  "Premium cigares for respected man.",
  "YES",
  "Davidoff"
);

let DB30g = new ProductBlock(
  "Dockers Blond 30g",
  "Dockers Blond30g.jpg",
  30,
  "TOBACO",
  "Nice tobaco.",
  "YES",
  "Dockers"
);

let DC30g = new ProductBlock(
  "Dockers Cherry 30g",
  "Dockers Cherry30g.jpg",
  30,
  "TOBACO",
  "Nice tobaco.",
  "YES",
  "Dockers"
);

let DC140g = new ProductBlock(
  "Dockers Cherry 140g",
  "Dockers Cherry140g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "NO",
  "Dockers"
);

let DHS30g = new ProductBlock(
  "Dockers Halfzware Shag 30g",
  "Dockers Halfzware Shag30g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "YES",
  "Dockers"
);

let DHS140g = new ProductBlock(
  "Dockers Halfzware Shag 140g",
  "Dockers Halfzware Shag140g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "NO",
  "Dockers"
);

let DV30g = new ProductBlock(
  "Dockers Vanilla 30g",
  "Dockers Vanilla30g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "YES",
  "Dockers"
);

let DV140g = new ProductBlock(
  "Dockers Vanilla 140g",
  "Dockers Vanilla140g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "NO",
  "Dockers"
);

let DZS30g = new ProductBlock(
  "Dockers Zware Shag 30g",
  "Dockers Zware Shag30g.jpg",
  50,
  "TOBACO",
  "Nice tobaco.",
  "YES",
  "Dockers"
);

let FDCGB = new ProductBlock(
  "Flor De Copan gift box",
  "Flor-De-Copan-Gift-Box.jpg",
  50,
  "CIGARES",
  "Premium cigares for respected man.",
  "NO",
  "Flor De Copan"
);

let FFOXO = new ProductBlock(
  "Fuente Opus X Oscuro Oro 15",
  "Fuente-Fuente-Opus-X-Oscuro-Oro-15.jpg",
  50,
  "CIGARES",
  "Premium cigares for respected man.",
  "NO",
  "Fuente Opus"
);

let AEXLS = new ProductBlock(
  "Atomic Extralong XL Slim",
  "Atomic-Extralong-XL-Slim.jpg",
  50,
  "FILTERS",
  "Effective filters for handmade cigarettes.",
  "NO",
  "Atomic"
);

let DHL = new ProductBlock(
  "Dark horse Long",
  "Dark-horse-Long.jpg",
  50,
  "FILTERS",
  "Effective filters for handmade cigarettes.",
  "YES",
  "Dark horse"
);

let GSXELF = new ProductBlock(
  "GIZEH SLIM XL extra long filter",
  "GIZEH-SLIM-XL-extra-long-filter.jpg",
  50,
  "FILTERS",
  "Effective filters for handmade cigarettes.",
  "NO",
  "GIZEH"
);

let OCBRF = new ProductBlock(
  "OCB Regular Filtrs (100)",
  "OCB-Regular-Filtrs-(100).jpeg",
  50,
  "FILTERS",
  "Effective filters for handmade cigarettes.",
  "YES",
  "OCB"
);

let SMRL = new ProductBlock(
  "Smoking Menthol Regular Long",
  "Smoking-Menthol-Regular-Long.jpg",
  50,
  "FILTERS",
  "Effective filters for handmade cigarettes.",
  "NO",
  "Smoking"
);

let SMORG = new ProductBlock(
  "SMOKING ORGANIC",
  "SMOKING-ORGANIC.jpg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "Smoking"
);

let SMODEL = new ProductBlock(
  "Smoking Deluxe",
  "Smoking-Deluxe.jpg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "NO",
  "Smoking"
);

let SBTF = new ProductBlock(
  "Smoking Blue Tree Free",
  "Smoking-Blue-Tree-Free.jpg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "NO",
  "Smoking"
);

let OCBDR = new ProductBlock(
  "OCB Double Rigid",
  "OCB-Double-Rigid.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

let OCBN1S = new ProductBlock(
  "OCB №1 Single",
  "OCB-№1-Single.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

let OCBN8S = new ProductBlock(
  "OCB №8 Single",
  "OCB-№8-Single.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

let OCBP7 = new ProductBlock(
  "OCB Premium 70",
  "OCB-Premium-70.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "NO",
  "OCB"
);

let OCBPRM = new ProductBlock(
  "OCB Premium Rolls Mini",
  "OCB-Premium-Rolls-Mini.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

let OCBPRP = new ProductBlock(
  "OCB Premium Rolls Pack",
  "OCB-Premium-Rolls-Pack.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

let OCBRVS = new ProductBlock(
  "OCB Rolls Virgin Single",
  "OCB-Rolls-Virgin-Single.jpeg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "NO",
  "OCB"
);

let OCBOH = new ProductBlock(
  "OCB Organic Hemp",
  "OCB-Organic-Hemp.jpg",
  50,
  "PAPPER",
  "Good papper for good cigarettes.",
  "YES",
  "OCB"
);

const allProducts = [
  DB30g,
  DC30g,
  DC140g,
  DHS30g,
  DHS140g,
  DV30g,
  DV140g,
  DZS30g,
  FDCGB,
  FFOXO,
  DPS9,
  AEXLS,
  DHL,
  GSXELF,
  OCBRF,
  SMRL,
  SMORG,
  SMODEL,
  SBTF,
  OCBDR,
  OCBN1S,
  OCBN8S,
  OCBOH,
  OCBP7,
  OCBPRM,
  OCBPRP,
  OCBRVS,
];

selectNavItem(1, allProducts);
