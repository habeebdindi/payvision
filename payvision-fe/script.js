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
  const expenseCategoryDebit = document.getElementById("expenseCategoryDebit");
  const expenseCategoryCredit = document.getElementById("expenseCategoryCredit");
  const expenseDate = document.getElementById("expenseDate");
  const addButton = document.querySelectorAll('button[type="submit"]');
  const logTransaction = document.getElementById("log-expense");
  const logIncome = document.getElementById("Add-Income")

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

  // signUp handling
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const signUpUsername = document.getElementById("signupUsername").value;
    const signUpEmail = document.getElementById("signupEmail").value;
    const signUpPassword = document.getElementById("signupPassword").value;

    const signUpData = {
      username: signUpUsername,
      email: signUpEmail,
      password: signUpPassword,
    };
    console.log(signUpData)
    const baseUrl = "https://payvision.vercel.app";

    fetch(`${baseUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Registration was successful!") {
          let loginData = {
            username: signUpUsername,
            password: signUpPassword,
          }
          fetch(`${baseUrl}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          })
            .then((response) => response.json())
            .then((data) => {
              hideLoadingIcon();
              console.log(data);
              // Check if login was successful
              if (data.message === "Signin successful!") {
                localStorage.removeItem("token")
                localStorage.setItem("token", data.token);
                fetchUserDetails().then((userDetails) => {
                  // fetchTags();
                  const c = userDetails.currency || "NGN";
                  document.getElementById("incomeDisplay").textContent = `${c} ${userDetails.totalCredit || 0}`;
                  document.getElementById("expensesDisplay").textContent = `${c} ${userDetails.totalDebit || 0}`;
                  document.getElementById("netDisplay").textContent = `${c} ${userDetails.balance || 0}`;

                  banner.style.display = "none";
                  featuresSection.style.display = "none";
                  dashboard.style.display = "block";
                  signUpButton.textContent = "Logout";
                  fetchTransactions().then((transactions) => {
                    const table = document.querySelector(".recent-transactions tbody");
                    while (table.firstChild) {
                      table.removeChild(table.firstChild);
                    }
                    transactions.forEach((transaction) => {
                      addTransaction(transaction.date, transaction.description, transaction.category["name"], transaction.amount);
                      console.log(transaction);
                    });
                  })
                  .catch((error) => {
                    console.error("Error fetching transactions:", error);
                  });
                  // Add logout event listener to signUpButton
                  signUpButton.addEventListener("click", function () {
                    window.location.href = "index.html";
                  });  
                });
              } else {
                // Handle login failure (e.g., show an error message)
                console.error("Login failed:", data.message);
                alert(data.message);
              }
            })
            .catch((error) => {
              hideLoadingIcon();
              console.error("Error:", error);
              alert("An error occurred during login, please try again");
            });
            
        } else {
          alert(data.error || "Signup failed");
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
        alert(error);
      });
  });

  // login handling
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.querySelector("#loginId").value;
    const password = document.querySelector("#password").value;
    showLoadingIcon();

    const loginData = {
      username: username,
      password: password,
    };

    const baseUrl = "https://payvision.vercel.app";

    // Sends a login request to the backend
    fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        hideLoadingIcon();
        console.log(data);
        // Check if login was successful
        if (data.message === "Signin successful!") {
          localStorage.setItem("token", data.token);
          fetchUserDetails().then((userDetails) => {
            // fetchTags();
            const c = userDetails.currency || "NGN";
            document.getElementById("incomeDisplay").textContent = `${c} ${userDetails.totalCredit || 0}`;
            document.getElementById("expensesDisplay").textContent = `${c} ${userDetails.totalDebit || 0}`;
            document.getElementById("netDisplay").textContent = `${c} ${userDetails.balance || 0}`;
            
            banner.style.display = "none";
            featuresSection.style.display = "none";
            dashboard.style.display = "block";
            signUpButton.textContent = "Logout";
            fetchTransactions().then((transactions) => {
              const table = document.querySelector(".recent-transactions tbody");
              while (table.firstChild) {
                table.removeChild(table.firstChild);
              }
              transactions.forEach((transaction) => {
                addTransaction(transaction.date, transaction.description, transaction.category["name"], transaction.amount);
                console.log(transaction);
              });
            })
            .catch((error) => {
              console.error("Error fetching transactions:", error);
            });
  
            // Add logout event listener to signUpButton
            signUpButton.addEventListener("click", function () {
              window.location.href = "index.html";
            });  
          });
        } else {
          // Handle login failure (e.g., show an error message)
          console.error("Login failed:", data.message);
          alert(data.message);
        }
      })
      .catch((error) => {
        hideLoadingIcon();
        console.error("Error:", error);
        alert("An error occurred during login, please try again");
      });

    // const loadingTime = Math.floor(Math.random() * (8000 - 4000 + 1)) + 4000;
    // showLoadingIcon();

    // setTimeout(() => {
    //   if (password && username) {
    //     hideLoadingIcon();
    //     banner.style.display = "none";
    //     featuresSection.style.display = "none";
    //     dashboard.style.display = "block";
    //     signUpButton.textContent = "Logout";
    //   }
    //   signUpButton.addEventListener("click", function () {
    //     window.location.href = "index.html";
    //   });
    // }, loadingTime);
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

  logIncome.addEventListener('click', function (event) {
    const amount = document.getElementById("incomeAmount").value;
    const frequency = document.getElementById("incomeFrequency").value;
    const categoryId = document.getElementById("expenseCategoryCredit").value;
    const description = document.querySelector(".income-details #expenseDescription").value;
    const date = document.getElementById("expenseDate").value;
    const paymentMethod = "cash"

    const transactionData = {
      amount,
      frequency,
      date,
      categoryId,
      description,
      paymentMethod
    };
    console.log(transactionData);
    sendTransactionToBackend(transactionData);
  })

  logTransaction.addEventListener('click', function (event) {
    const amount = document.getElementById("expenseAmount").value;
    const frequency = document.getElementById("incomeFrequency").value;
    const categoryId = document.getElementById("expenseCategoryDebit").value;
    const description = document.querySelector(".expenses-details #expenseDescription").value;
    const date = document.querySelector(".expenses-details #expenseDate").value;
    const paymentMethod = "cash"

    const transactionData = {
      amount,
      frequency,
      date,
      categoryId,
      description,
      paymentMethod
    };
    console.log(transactionData);
    sendTransactionToBackend(transactionData);
  })

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
  document.getElementById("credit").addEventListener("click", function () {
    document.querySelector(".income-details").style.display = "block";
    document.querySelector(".expenses-details").style.display = "none";
  });

  document.getElementById("debit").addEventListener("click", function () {
    document.querySelector(".income-details").style.display = "none";
    document.querySelector(".expenses-details").style.display = "block";
  });

  // Function to fetch user details from the backend
  function fetchUserDetails() {
    const baseUrl = "https://payvision.vercel.app";
    const token = localStorage.getItem("token");

    const result = fetch(`${baseUrl}/api/user/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((userData) => {
        console.log("User details fetched:", userData);
        // retrieve user details for display later
        // return {
        //   balance: userData.balance,
        //   currency: userData.currency,
        //   email: userData.email,
        //   totalCredit: userData.totalCredit,
        //   debit: userData.totalDebit
        // };
        return userData;
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
      });
    return result;
  }

  // Function to fetch all tags from the backend
  function fetchTags() {
    const baseUrl = "https://payvision.vercel.app";
    const token = localStorage.getItem("token");

    fetch(`${baseUrl}/api/tag/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((tags) => {
        console.log("Tags fetched:", tags);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  }

  // Function to fetch categories for a specific tag from the backend
  function fetchCategoriesForTag(tagId) {
    const baseUrl = "https://payvision.vercel.app";
    const token = localStorage.getItem("token");

    fetch(`${baseUrl}/api/tag/${tagId}/categories`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((categories) => {
        console.log("Categories for tag fetched:", categories);
        categories.forEach((category) => {
          console.log(category);
          const option = document.createElement("option");
          option.value = category.id;
          if (tagId === 1) {
            option.className = "debit";
            option.textContent = category.name;
            expenseCategoryDebit.appendChild(option);

          } else {
            option.className = "credit";
            option.textContent = category.name;
            expenseCategoryCredit.appendChild(option);
          }
        })
        .catch((error) => {
          console.error("Error fetching categories for tag:", error);
        });
    });
  }

  fetchCategoriesForTag(1);
  fetchCategoriesForTag(2);

  // Function to create a new transaction
  function createTransaction(
    amount,
    categoryId,
    recurred,
    frequency
  ) {
    const baseUrl = "https://payvision.vercel.app";
    const token = localStorage.getItem("token");

    const transactionData = {
      amount: amount,
      categoryId: categoryId,
      recurred: recurred,
      frequency: frequency,
    };
    // sendTransactionToBackend(transactionData);

    // fetch(`${baseUrl}/api/transaction/new`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify(transactionData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     if (data.message === "Transaction created successfully") {
    //       alert("Transaction created successfully");
    //       // could refresh the transactions list or update the UI accordingly
    //       fetchUserDetails().then((userDetails) => {
    //         // fetchTags();
    //         const c = userDetails.currency;
    //         document.getElementById("incomeDisplay").textContent = `${c} ${userDetails.totalCredit}`;
    //         document.getElementById("expensesDisplay").textContent = `${c} ${userDetails.totalDebit}`;
    //         document.getElementById("netDisplay").textContent = `${c} ${userDetails.balance}`;
    //         banner.style.display = "none";
    //         featuresSection.style.display = "none";
    //         dashboard.style.display = "block";
    //         signUpButton.textContent = "Logout";
  
    //         // Add logout event listener to signUpButton
    //         signUpButton.addEventListener("click", function () {
    //           window.location.href = "index.html";
    //         });  
    //       });
    //       fetchTransactions().then((transactions) => {
    //         transactions.forEach((transaction) => {
    //           addTransaction(transaction.date, transaction.description, transaction.category["name"], transaction.amount);
    //           console.log(transaction);
    //           fetchCategoriesForTag(1);
    //           fetchCategoriesForTag(2);
    //         });
    //       })
    //     } else {
    //       alert("Failed to create transaction: " + data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error creating transaction:", error);
    //     alert("An error occurred, please try again");
    //   });
  }

  // Function to fetch all transactions from the backend
  function fetchTransactions() {
    const baseUrl = "https://payvision.vercel.app";
    const token = localStorage.getItem("token");
  
    const result = fetch(`${baseUrl}/api/transaction/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.message) {
          console.log(data);
          // Here you can update the UI with the fetched transactions
        } else {
          const table = document.querySelector(".recent-transactions tbody");
          while (table.firstChild) {
            table.removeChild(table.firstChild);
          }
          console.error("Failed to fetch transactions: " + data.message);
        }
        return data;
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
      return result;
  }

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
    const fDate = date.split("T")[0];
    console.log(fDate);
    const table = document.querySelector(".recent-transactions tbody");
    const row = table.insertRow();
    row.innerHTML = `<td>${fDate}</td><td>${description}</td><td>${category}</td><td>${amount}</td>`;
  }

  // function categoryOptions() {
  //  const baseUrl = "https://payvision.vercel.app";
  //  const token = localStorage.getItem("token");

  //  fetch(`${baseUrl}/api/category/all`, {
  //    method: "GET",
  //    headers: {
  //      "Content-Type": "application/json",
  //      Authorization: `Bearer ${token}`,
  //    },
  //  })
  //    .then((response) => response.json())
  //    .then((categories) => {
  //      console.log("Categories fetched:", categories);
  //      categories.forEach((category) => {
  //        const option = document.createElement("option");
  //        option.value = category.id;
  //        if (category.tagId === 1) { 
  //          option.className = "debit";
  //          option.textContent = category.name;
  //          expenseCategoryDebit.appendChild(option);

  //        } else {
  //          option.className = "credit";
  //          option.textContent = category.name;
  //          expenseCategoryCredit.appendChild(option);

  //        }
  //      });
  //    })
  //    .catch((error) => {
  //      console.error("Error fetching categories:", error);
  //  });
  //}
  //categoryOptions();

  addButton.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const isIncome = this.closest("income-details");
      const amount = parseFloat(
        isIncome ? incomeInput.value : expenseInput.value
      );

      if (isIncome) {
        totalIncome += amount;
        incomeInput.value = "";
      } else {
        totalExpenses += amount;
        expenseInput.value = "";
        document.getElementById("expenseDescription").value = "";
      }
      updateDashboard();

      // check UI later and incoporate necessary arguement
      

      // Assuming modal should be closed after adding
      document.getElementById("myModal").style.display = "none";
    });
  });

  // Function to send transaction data to the backend
  function sendTransactionToBackend(transactionData) {
    const baseUrl = "https://payvision.vercel.app"; // Use your actual backend URL
    console.log(transactionData)
    fetch(`${baseUrl}/api/transaction/new`, {
      // Adjust the endpoint as needed
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(transactionData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Transaction added:", data);
        // Optionally: Add logic here to update the UI based on the response
        fetchUserDetails().then((userDetails) => {
          // fetchTags();
          const c = userDetails.currency || "NGN";
          document.getElementById("incomeDisplay").textContent = `${c} ${userDetails.totalCredit || 0}`;
          document.getElementById("expensesDisplay").textContent = `${c} ${userDetails.totalDebit || 0}`;
          document.getElementById("netDisplay").textContent = `${c} ${userDetails.balance || 0}`;
          
          banner.style.display = "none";
          featuresSection.style.display = "none";
          dashboard.style.display = "block";
          signUpButton.textContent = "Logout";

          // Add logout event listener to signUpButton
          signUpButton.addEventListener("click", function () {
            window.location.href = "index.html";
          });  
        });
        fetchTransactions().then((transactions) => {
          const table = document.querySelector(".recent-transactions tbody");
          while (table.firstChild) {
            table.removeChild(table.firstChild);
          }
          transactions.forEach((transaction) => {
            addTransaction(transaction.date, transaction.description, transaction.category["name"], transaction.amount);
            console.log(transaction);
          });
        
      })
    })
      .catch((error) => {
        console.error("Error adding transaction:", error);
        // Optionally: Handle errors, such as by displaying a message to the user
      });
  }
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
