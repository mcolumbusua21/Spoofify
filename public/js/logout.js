const $logoutBtn = document.querySelector("#logout");

const logout = async () => {
    console.log("LOGOUT")
    const response = await fetch('/logout', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (response.ok) {
      document.location.replace('/');
    } else {
      alert(response.statusText);
    }
  };

$logoutBtn.addEventListener("click", logout);