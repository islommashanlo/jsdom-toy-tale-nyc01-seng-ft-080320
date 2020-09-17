let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    };
  });
  getToys();
  submitHandler();
  clickHandler();

});


function getToys(){
  fetch("http://localhost:3000/toys")
  .then(response => {return response.json()})
  .then(data => {
    const toyBody = document.querySelector("#toy-collection")
    
    for (toy of data){
      toyBody.append(renderToy(toy))
    };
  });
};

function renderToy(toy){
  const toyCard = document.createElement("div");
  toyCard.classList.add("card");
  
  const toyName = document.createElement("h2");
  toyName.textContent = toy.name;
  toyCard.append(toyName);

  const toyImage = document.createElement("img");
  toyImage.src = toy.image;
  toyImage.classList.add("toy-avatar");
  toyCard.append(toyImage);

  const toyLikes = document.createElement("p");
  toyLikes.innerHTML = `Likes: <strong>${toy.likes}</strong>`;
  toyCard.append(toyLikes);

  const toyButton = document.createElement("button");
  toyButton.classList.add("like-btn");
  toyButton.textContent = "Like <3";
  toyCard.append(toyButton);

  toyCard.dataset.id = toy.id
  return toyCard
};


submitHandler = () => {
  document.addEventListener('submit', e => {
    e.preventDefault();
    
    if (e.target.submit.name === "submit"){
      const newToy = {};
      newToy.name = e.target.name.value;
      newToy.image = e.target.image.value;
      newToy.likes = 0;
      addToyDb(newToy)
      
      
      
    }

  })
};

function addToyDb(toy){
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
  }
  fetch("http://localhost:3000/toys", configObj)
  .then(response => {return response.json()})
  .then(obj => {
    const toyBody = document.querySelector("#toy-collection");
    toyBody.append(renderToy(obj))})
};


function likeToyDb(toy, likes) {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({likes: likes})
  }
  console.log(toy)
  fetch(`http://localhost:3000/toys/${toy}`, configObj)
    .then(response => { return response.json() })
    .then(obj => { console.log(obj) });
}

function clickHandler() {
  document.addEventListener('click', e =>{
    if (e.target.matches(".like-btn")){
      const toy = e.target.parentNode
      let likeNum = toy.querySelector("p strong")
      likeNum.textContent = parseInt(likeNum.textContent) + 1
      likeToyDb(toy.dataset.id, likeNum.textContent)

    }
  })
}