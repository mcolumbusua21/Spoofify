const $searchBtn = document.querySelector("#searchBtn");

$searchBtn.addEventListener("click", function (e){
e.preventDefault()
    console.log("CLICK SEARCH")
    document.location.replace("/artist");
})