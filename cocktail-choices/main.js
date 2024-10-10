
const getDrinks = async () => {
  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9teXVjb2p5YWxwZGRwZ21ua2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NDc3ODEsImV4cCI6MjA0NDEyMzc4MX0.HEywW3UJjYSrSTyqMsRCk7HcXKFweSertdVGidkm91U"
  const header = new Headers({
    'Content-Type': 'application/json',
    'apikey': apiKey
  });
  const response = await fetch(`https://omyucojyalpddpgmnklt.supabase.co/rest/v1/drinks`, {
    method: 'GET',
    headers: header
  });

  const data = await response.json();
  console.log(data);
  return data;
};

const initSlider = () => {
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
}



getDrinks().then((drinks) => {
  const drinksContainer = document.querySelector('.swiper-wrapper');
  drinks.forEach((drink) => {
    const drinkElement = document.createElement('div');
    drinkElement.classList.add('swiper-slide');
    drinkElement.innerHTML = `
    <div class="drink">
      <img class="cocktail-img" src="${drink.image}" alt="${drink.name}" />
      <h2>${drink.name}</h2>
      <p>${drink.description}</p>
    </div>
    `;
    drinksContainer.appendChild(drinkElement);
  });

  initSlider();
});