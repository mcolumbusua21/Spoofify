const $searchBtn = document.querySelector("#searchBtn");

const newFormHandler = async (e) => {
    e.preventDefault();

    const $artistSearch = document.querySelector("#artist-search").value

    const response = await fetch(`/artist/${$artistSearch}`, {
        method: 'GET',
    });

    if (response.ok) {
        console.log("SEARCH WENT THROUGH")
        document.location.replace(`/artist`)
        // document.location.reload()
    } else {
        console.log("FAILED TO SEARCH ARTIST")
    }

}

document.querySelector('.artist-search-form').addEventListener('submit', newFormHandler)

document.ready(function() {

    $('.carousel.carousel-slider').carousel({
      fullWidth: true,
      indicators: true
    });
    autoplay()   
  function autoplay() {
      $('.carousel').carousel('next');
      setTimeout(autoplay, 4500);
  }})

// $searchBtn.addEventListener("click", function (e){
// e.preventDefault()
//     console.log("CLICK SEARCH")
//     document.location.replace("/artist");
// })