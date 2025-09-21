const xhr = new XMLHttpRequest();

xhr.addEventListener("load", () => {
    console.log(xhr.response)
})

xhr.open("GET", "https://supersimplebackend.dev");
xhr.send();

//Using browser is the same as making a GET request