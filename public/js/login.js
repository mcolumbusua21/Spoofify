const $loginBtn = document.querySelector("#login");

$loginBtn.addEventListener("click", (e) => {
    console.log("CLICK")
    document.location.replace("/auth/spotify");
  });

  