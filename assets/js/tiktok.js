document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const loader = document.getElementById("loader");
  const userFound = document.getElementById("userFound");
  const rechargeBtn = document.getElementById("rechargeBtn");
  const paymentModal = document.getElementById("paymentModal");
  const processingModal = document.getElementById("processingModal");
  const successModal = document.getElementById("successModal");
  const buyBtn = document.getElementById("buyBtn");
  const cardInfos = document.querySelectorAll(".card-info");
  const coinButtons = document.querySelectorAll(".coin-button");
  const desktopCustomInput = document.getElementById("customCoins");
  const acceptSuccess = document.getElementById("acceptSuccess");
  const countdownElement = document.getElementById("countdown");
  const tiktokProfile = document.getElementById("tiktokProfile");

  const customModal = document.getElementById("customModal");
  const mobileCustomInput = document.getElementById("customInputValue");
  const customTotal = document.getElementById("customTotal");
  const customRechargeBtn = document.getElementById("customRechargeBtn");
  const keys = document.querySelectorAll(".key");

  let timer = null;
  let selectedCoins = 0;
  let selectedPrice = 0;
  let searchDebounce = null;

  if (loader) loader.style.display = "none";
  if (userFound) {
    userFound.style.display = "none";
    userFound.style.opacity = "0";
  }
  if (tiktokProfile) tiktokProfile.innerHTML = "";

  function updateTotal() {
    const totalCoinsElement = document.getElementById("totalCoins");
    const totalPriceElement = document.getElementById("totalPrice");
    if (totalCoinsElement)
      totalCoinsElement.textContent = selectedCoins.toLocaleString();
    if (totalPriceElement)
      totalPriceElement.textContent = `$${selectedPrice.toFixed(2)}`;
  }

  if (coinButtons && coinButtons.length) {
    coinButtons.forEach((button) => {
      button.addEventListener("click", () => {
        coinButtons.forEach((btn) => btn.classList.remove("selected"));
        const customContainer = document.querySelector(
          ".custom-input-container"
        );
        if (customContainer) customContainer.classList.remove("selected");

        button.classList.add("selected");
        selectedCoins = parseInt(button.getAttribute("data-coins")) || 0;
        selectedPrice = parseFloat(button.getAttribute("data-price")) || 0;
        updateTotal();
      });
    });
  }

  if (rechargeBtn) {
    rechargeBtn.addEventListener("click", () => {
      if (!paymentModal) return;
      if (selectedPrice > 0) {
        const username = (searchInput && searchInput.value.trim()) || "";
        const summaryAccount = document.getElementById("summaryAccount");
        if (summaryAccount)
          summaryAccount.textContent = username ? "@" + username : "";
        const summaryCoins = document.getElementById("summaryCoins");
        if (summaryCoins)
          summaryCoins.textContent = selectedCoins.toLocaleString();
        const summaryPrice = document.getElementById("summaryPrice");
        if (summaryPrice)
          summaryPrice.textContent = `$${selectedPrice.toFixed(2)}`;

        paymentModal.classList.add("active");
        document.body.classList.add("modal-open");
      }
    });
  }

  const closePaymentBtn = document.getElementById("closePaymentModal");
  if (closePaymentBtn && paymentModal) {
    closePaymentBtn.addEventListener("click", () => {
      paymentModal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });
  }

  if (cardInfos && cardInfos.length) {
    cardInfos.forEach((card) => {
      card.addEventListener("click", () => {
        cardInfos.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
      });
    });
  }

  if (buyBtn && processingModal && successModal && countdownElement) {
    buyBtn.addEventListener("click", () => {
      if (paymentModal) paymentModal.classList.remove("active");
      processingModal.classList.add("active");
      countdownElement.textContent = "05:00";
      clearInterval(timer);
      let timeLeft = 3;
      timer = setInterval(() => {
        timeLeft--;
        const minutes = 4;
        const seconds = 57 + timeLeft;
        if (countdownElement)
          countdownElement.textContent = `${minutes}:${String(seconds).padStart(
            2,
            "0"
          )}`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          processingModal.classList.remove("active");
          successModal.classList.add("active");
          const paidAmountEl = document.getElementById("paidAmount");
          if (paidAmountEl)
            paidAmountEl.textContent = `$${selectedPrice.toFixed(2)}`;
        }
      }, 1000);
    });
  }

  if (acceptSuccess) {
    acceptSuccess.addEventListener("click", () => {
      if (successModal) successModal.classList.remove("active");
      if (processingModal) processingModal.classList.remove("active");
      document.body.classList.remove("modal-open");
      if (countdownElement) countdownElement.textContent = "05:00";

      selectedCoins = 0;
      selectedPrice = 0;
      updateTotal();
      if (coinButtons && coinButtons.length)
        coinButtons.forEach((btn) => btn.classList.remove("selected"));
      const customContainer = document.querySelector(".custom-input-container");
      if (customContainer) customContainer.classList.remove("selected");

      if (desktopCustomInput) desktopCustomInput.value = "";
      if (mobileCustomInput) mobileCustomInput.value = "";
      if (customTotal) customTotal.textContent = "0";
      if (tiktokProfile) tiktokProfile.style.display = "none";
      if (userFound) userFound.style.display = "none";

    });
  }

  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    window.innerWidth < 768;

  if (!isMobile && desktopCustomInput) {
    desktopCustomInput.setAttribute("inputmode", "numeric");
    desktopCustomInput.setAttribute("pattern", "\\d*");

    desktopCustomInput.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Enter") {
        e.preventDefault();
      }
    });

    desktopCustomInput.addEventListener("input", (e) => {
      const raw = (e.target.value || "").toString().replace(/,/g, "").trim();
      const val = raw === "" ? 0 : parseFloat(raw) || 0;
      selectedCoins = val;
      selectedPrice = val * 0.013;
      if (coinButtons && coinButtons.length)
        coinButtons.forEach((btn) => btn.classList.remove("selected"));
      const customContainer = document.querySelector(".custom-input-container");
      if (customContainer) customContainer.classList.add("selected");
      updateTotal();
    });
  }

  if (isMobile && customModal && mobileCustomInput) {
    const modalBox = customModal.querySelector(".custom-modal-content");
    const desktopInputEl = document.getElementById("customCoins");

    if (desktopInputEl) {
      desktopInputEl.addEventListener("focus", (e) => {
        e.preventDefault();
        desktopInputEl.blur();
        customModal.style.display = "flex";
        modalBox.style.transition = "transform 0.25s ease, opacity 0.25s ease";
        modalBox.style.opacity = "0";
        modalBox.style.transform = "translateY(100%)";
        setTimeout(() => {
          modalBox.style.opacity = "1";
          modalBox.style.transform = "translateY(0)";
        }, 10);
        document.body.style.overflow = "hidden";
      });

      const customContainer = document.getElementById("customContainer");
      if (customContainer) {
        customContainer.addEventListener("click", () => {
          customModal.style.display = "flex";
          modalBox.style.transition =
            "transform 0.25s ease, opacity 0.25s ease";
          modalBox.style.opacity = "1";
          modalBox.style.transform = "translateY(0)";
          document.body.style.overflow = "hidden";
        });
      }
    }

    customModal.addEventListener("click", (e) => {
      if (!modalBox.contains(e.target)) {
        modalBox.style.transform = "translateY(100%)";
        modalBox.style.opacity = "0";
        setTimeout(() => {
          customModal.style.display = "none";
          document.body.style.overflow = "";
        }, 220);
      }
    });

    if (keys && keys.length) {
      keys.forEach((key) => {
        key.addEventListener("click", () => {
          key.classList.add("pressed");
          setTimeout(() => key.classList.remove("pressed"), 120);

          if (key.classList.contains("delete")) {
            mobileCustomInput.value = mobileCustomInput.value.slice(0, -1);
          } else {
            mobileCustomInput.value += key.textContent;
          }
          if (customTotal)
            customTotal.textContent = mobileCustomInput.value || "0";
        });
      });
    }

    if (customRechargeBtn) {
      customRechargeBtn.addEventListener("click", () => {
        const raw = (mobileCustomInput.value || "0")
          .toString()
          .replace(/,/g, "")
          .trim();
        const value = raw === "" ? 0 : parseFloat(raw) || 0;
        if (value > 0) {
          selectedCoins = value;
          selectedPrice = value * 0.013;
          updateTotal();
          if (coinButtons && coinButtons.length)
            coinButtons.forEach((btn) => btn.classList.remove("selected"));
          const customContainer = document.querySelector(
            ".custom-input-container"
          );
          if (customContainer) customContainer.classList.add("selected");

          const username = (searchInput && searchInput.value.trim()) || "";
          const summaryAccount = document.getElementById("summaryAccount");
          if (summaryAccount)
            summaryAccount.textContent = username ? "@" + username : "";
          const summaryCoins = document.getElementById("summaryCoins");
          if (summaryCoins)
            summaryCoins.textContent = selectedCoins.toLocaleString();
          const summaryPrice = document.getElementById("summaryPrice");
          if (summaryPrice)
            summaryPrice.textContent = `$${selectedPrice.toFixed(2)}`;

          modalBox.style.transform = "translateY(100%)";
          modalBox.style.opacity = "0";
          customModal.style.display = "none";
          document.body.style.overflow = "";
          if (paymentModal) {
            paymentModal.classList.add("active");
            document.body.classList.add("modal-open");
          }
        } else {
          mobileCustomInput.style.animation = "shake 0.2s";
          setTimeout(() => (mobileCustomInput.style.animation = ""), 200);
        }
      });
    }
  }

 
  if (searchInput && userFound && loader && tiktokProfile) {
    searchInput.addEventListener("input", () => {
      const value = searchInput.value.trim();

      if (searchDebounce) clearTimeout(searchDebounce);

      if (value === "") {
        loader.style.display = "none";
        userFound.style.display = "none";
        userFound.style.opacity = "0";
        tiktokProfile.innerHTML = "";
        tiktokProfile.style.display = "none";
        return;
      }

      loader.style.display = "block";
      userFound.style.display = "none";
      userFound.style.opacity = "0";
      tiktokProfile.innerHTML = "";
      tiktokProfile.style.display = "none";

  
      searchDebounce = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://tiktok.guxfiz.com/tiktok.php?username=${encodeURIComponent(
              value
            )}`,
            {
             
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },

              signal: AbortSignal.timeout(8000) 
            }
          );
          const data = await response.json();

          loader.style.display = "none";

          if (data.success) {

            userFound.style.display = "none"; 
            tiktokProfile.style.display = "flex";
            tiktokProfile.style.alignItems = "center";
            tiktokProfile.style.gap = "12px";
            tiktokProfile.style.position = "absolute";
            tiktokProfile.style.top = "100%";
            tiktokProfile.style.left = "0";
            tiktokProfile.style.right = "0";
            tiktokProfile.style.marginTop = "5px";
            tiktokProfile.style.padding = "12px";
            tiktokProfile.style.border = "1px solid #e5e7eb";
            tiktokProfile.style.borderRadius = "12px";
            tiktokProfile.style.backgroundColor = "#ffffff";
            tiktokProfile.style.boxShadow =
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
            tiktokProfile.style.zIndex = "1000";
            tiktokProfile.style.cursor = "pointer";

            const followerCount = data.follower_count
              ? data.follower_count >= 1000000
                ? (data.follower_count / 1000000).toFixed(1) + "M"
                : data.follower_count >= 1000
                ? (data.follower_count / 1000).toFixed(1) + "K"
                : data.follower_count.toString()
              : "0";

            tiktokProfile.innerHTML = `
            <img src="${data.avatar_url}" alt="Profile" style="
              width: 50px; 
              height: 50px; 
              border-radius: 50%; 
              object-fit: cover;
              border: 2px solid #e5e7eb;
            ">
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 16px; color: #000;">@${data.username}</div>
              <div style="font-size: 14px; color: #666; margin-top: 2px;">${data.display_name}</div>
              <div style="font-size: 13px; color: #888; margin-top: 2px;">${followerCount} Followers</div>
            </div>
          `;

            tiktokProfile.addEventListener("click", () => {
              searchInput.value = data.username;
              tiktokProfile.style.display = "none";
              userFound.style.display = "none";
            });
          } else {

            userFound.style.display = "flex";
            userFound.style.alignItems = "center";
            userFound.style.gap = "8px";
            userFound.style.opacity = "1";
            userFound.style.background = "none";
            userFound.style.border = "none";
            userFound.style.padding = "0";
            userFound.style.marginTop = "10px";
            userFound.style.fontWeight = "600";
            userFound.style.color = "#000000";
            userFound.style.fontSize = "0.95rem";
            userFound.style.textShadow = "none";

            userFound.innerHTML = `
            <span style="color:#4ade80;font-size:1.3rem;">✔</span>
            <span style="color:#000000;">User found</span>
          `;
          }
        } catch (error) {
          console.error("Error fetching TikTok profile:", error);
          loader.style.display = "none";

          userFound.style.display = "flex";
          userFound.style.alignItems = "center";
          userFound.style.gap = "8px";
          userFound.style.opacity = "1";
          userFound.style.background = "none";
          userFound.style.border = "none";
          userFound.style.padding = "0";
          userFound.style.marginTop = "10px";
          userFound.style.fontWeight = "600";
          userFound.style.color = "#000000";
          userFound.style.fontSize = "0.95rem";

          userFound.innerHTML = `
          <span style="color:#4ade80;font-size:1.3rem;">✔</span>
          <span style="color:#000000;">User found</span>
        `;
        }
      }, 400);
    });
  }

 



  if (searchInput) {
    const searchContainer = searchInput.closest(".search-container");
    if (searchContainer) {
      searchContainer.style.position = "relative";
    }
  }
});
