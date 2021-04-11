const $saveBtn = document.querySelector("#saveBtn");


const postSearch = async () => {
    const {
      artistName,
      artistId,
      artistImg,
    } = require("../../controllers/homeRoutes");
  const response = await fetch("http://localhost:3001/api/search/", {
    method: "POST",
    body: JSON.stringify({
      artist: artistName,
      artist_id: artistId,
      img: artistImg,
      // user_id: currentUser,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    console.log("SEARCH HAS BEEN POSTED")
  } else {
    console.log("Failed to post band");
  }
};

$saveBtn.addEventListener("click", postSearch);
