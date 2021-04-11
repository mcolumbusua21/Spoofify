const $searchBtn = document.querySelector("#searchBtn");

const newFormHandler = async (e) => {
  e.preventDefault();

  const $artistSearch = document.querySelector("#artist-search").value;

  const response = await fetch(`/artist/${$artistSearch}`, {
    method: "GET",
  });
  console.log("RESPONSE", response)
  if (response.ok) {
    console.log("SEARCH WENT THROUGH");
    document.location.replace(`/artist`);
    // document.location.reload()
  } else {
    console.log("FAILED TO SEARCH ARTIST");
  }
};

document
  .querySelector(".artist-search-form")
  .addEventListener("submit", newFormHandler);
