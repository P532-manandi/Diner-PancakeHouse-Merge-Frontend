document.addEventListener("DOMContentLoaded", () => {
  const signupLink = document.getElementById("signupLink");
  const signupForm = document.getElementById("signupForm");
  const signupMsg = document.getElementById("signupMessage");
  const menuList = document.getElementById("menuList");
  const menuNavBtns = document.querySelectorAll(".menu-nav button");

  // Toggle showing the signup form
  signupLink.addEventListener("click", (e) => {
    e.preventDefault();
    signupForm.classList.toggle("hidden");
    signupMsg.textContent = "";
  });

  // Handle signup form submission
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payload = {
      email: document.getElementById("suEmail").value.trim(),
      username: document.getElementById("suUsername").value.trim(),
      password: document.getElementById("suPassword").value,
    };

    fetch("https://menu-house.onrender.com/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Signup failed");
        return res;
      })
      .then((data) => {
        signupMsg.style.color = "green";
        signupMsg.textContent = `User ${payload.username} signed up successfully!`;
        signupForm.reset();
      })
      .catch((err) => {
        signupMsg.style.color = "red";
        signupMsg.textContent = err.message;
      });
  });

  // Wire up menu buttons
  menuNavBtns.forEach((btn) => {
    btn.addEventListener("click", () =>
      fetchMenu(`/menu${btn.dataset.endpoint}`)
    );
  });

  // Load "All" on startup
  fetchMenu("/menu");

  function fetchMenu(path) {
    menuList.innerHTML = `<p>Loading…</p>`;
    fetch(`https://menu-house.onrender.com${path}`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) data = [data];
        menuList.innerHTML = data
          .map(
            (item) => `
            <div class="item">
              <h3>${item.name}</h3>
              <p>${item.description}</p>
              <div class="price">
                $${item.price.toFixed(2)} ${item.vegetarian ? "🌱" : ""}
              </div>
            </div>
          `
          )
          .join("");
      })
      .catch((_) => {
        menuList.innerHTML = `<p style="color:red">Error loading menu.</p>`;
      });
  }
});
