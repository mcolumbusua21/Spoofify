const $searchBtn = document.querySelector("#searchBtn");


const newFormHandler = async (e) => {
    e.preventDefault();

    const $artistSearch = document.querySelector("#artist-search").value

    const response = await fetch(`/artist/${$artistSearch}`, {
        method: 'GET',
    });

    if (response.ok) {
        console.log("SEARCH WENT THROUGH")
    } else {
        console.log("FAILED TO SEARCH ARTIST")
    }

}

document.querySelector('.artist-search-form').addEventListener('submit', newFormHandler)

// $searchBtn.addEventListener("click", function (e){
// e.preventDefault()
//     console.log("CLICK SEARCH")
//     document.location.replace("/artist");
// })