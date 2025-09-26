export function setUpSearchBar() {
  const searchButton = document.querySelector(".js-search-button");
  const input = document.getElementById("js-search-bar");

  if(!searchButton || !input) return;


  searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = input.value.trim();

    if (searchButton) {
      const url = `amazon.html?search=${encodeURIComponent(searchInput)}`;
      window.location.href = url;
    } else {
      window.location.href = "amazon.html";
    }
  });

  input.addEventListener("keydown", e => {
    if(e.key === "Enter") {
        searchButton.click();
    }
  })
}
