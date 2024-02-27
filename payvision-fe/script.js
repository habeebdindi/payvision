"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let signUpButton = document.querySelector(".nav-link.sign-up-button");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.querySelector(".signup-form");
  const featuresSection = document.querySelector(".features-overview");
  const banner = document.querySelector(".banner");
  const dashboard = document.querySelector(".dashboard");
  const modal = document.getElementById("myModal");
  const addTransactionButton = document.getElementById("myBtn");
  const cancelAddTransactionModal = document.getElementsByClassName("close")[0];
  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeInput = document.getElementById("incomeAmount");
  const expenseInput = document.getElementById("expenseAmount");
  const expenseCategory = document.getElementById("expenseCategory");
  const expenseDate = document.getElementById("expenseDate");
  const addButton = document.querySelectorAll('button[type="submit"]');

  // Show Loading Icon function
  function showLoadingIcon() {
    const loadingIcon = document.getElementById("loadingIcon");
    if (loadingIcon) loadingIcon.style.display = "block";
  }

  // Hide Loading Icon function
  function hideLoadingIcon() {
    const loadingIcon = document.getElementById("loadingIcon");
    if (loadingIcon) loadingIcon.style.display = "none";
  }

  signUpButton.addEventListener("click", function (e) {
    e.preventDefault();
    if (loginForm.style.display === "none") {
      loginForm.style.display = "block";
      signupForm.style.display = "none";
      signUpButton.textContent = "Sign Up";
    } else {
      loginForm.style.display = "none";
      signupForm.style.display = "block";
      signUpButton.textContent = "Log In";
    }
  });

  // Optional: Toggle password visibility for sign-up form
  document
    .getElementById("toggleSignupPassword")
    .addEventListener("click", function () {
      const passwordInput = document.getElementById("signupPassword");
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.classList.toggle("fa-eye");
      this.classList.toggle("fa-eye-slash");
    });

  loginForm.addEventListener("submit", function (e) {
    const username = document.querySelector("#loginId").value;
    const password = document.querySelector("#password").value;
    e.preventDefault();
    const loadingTime = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
    showLoadingIcon();

    setTimeout(() => {
      if (password && username) {
        hideLoadingIcon();
        banner.style.display = "none";
        featuresSection.style.display = "none";
        dashboard.style.display = "block";
        signUpButton.textContent = "Logout";
      }
      signUpButton.addEventListener("click", function () {
        window.location.href = "index.html";
      });
    }, loadingTime);
  });

  // Open add transaction modal
  addTransactionButton.addEventListener("click", function (e) {
    modal.style.display = "block";
    incomeInput.value = "";
    expenseInput.value = "";
    expenseDate.value = "";
    const description = (document.getElementById("expenseDescription").value =
      "");
  });

  // Close add transaction modal
  cancelAddTransactionModal.addEventListener("click", function (e) {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // credit or debit button
  document.getElementById('credit').addEventListener('click', function() {
    document.querySelector('.income-details').style.display = 'block';
    document.querySelector('.expenses-details').style.display = 'none';
  });

  document.getElementById('debit').addEventListener('click', function() {
    document.querySelector('.income-details').style.display = 'none';
    document.querySelector('.expenses-details').style.display = 'block';
  });
  
  // Function to update the dashboard
  function updateDashboard() {
    document.getElementById("incomeDisplay").textContent = `$${totalIncome}`;
    document.getElementById(
      "expensesDisplay"
    ).textContent = `$${totalExpenses}`;
    document.getElementById("netDisplay").textContent = `$${
      totalIncome - totalExpenses
    }`;
  }

  // Function to add a transaction to the Recent Transactions table
  function addTransaction(date, description, category, amount) {
    const table = document.querySelector(".recent-transactions tbody");
    const row = table.insertRow();
    row.innerHTML = `<td>${date}</td><td>${description}</td><td>${category}</td><td>$${amount}</td>`;
  }

  addButton.forEach((button) => {
    button.addEventListener("click", function (e) {
      if (this.closest(".income-details")) {
        e.preventDefault();
        // Handle income submission
        totalIncome += parseFloat(incomeInput.value);
        incomeInput.value = "";
      } else if (this.closest(".expenses-details")) {
        e.preventDefault();
        const description = document.getElementById("expenseDescription").value;
        // Handle expense submission
        totalExpenses += parseFloat(expenseInput.value);
        addTransaction(
          expenseDate.value,
          description,
          expenseCategory.options[expenseCategory.selectedIndex].text,
          expenseInput.value
        );
      }
      updateDashboard();

      // Assuming modal should be closed after adding
      document.getElementById("myModal").style.display = "none";
    });
  });
});

// Toggle password visibility
togglePassword.addEventListener("click", () => {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  // Toggle the icon class
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});
