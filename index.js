$("document").ready(function () {
  $("#table_id").find("tr:gt(0)").remove();
  $.get("https://gorest.co.in/public/v1/users", function (data, status) {
    const users = data.data;
    for (const user of users) {
      const values = Object.values(user);
      let row = "<tr>";
      for (const ele of values) {
        row += `<td>${ele}</td>`;
      }
      row += `<td><button onclick="deleUser(${values[0]})">Delete</button></td>`;
      row += "</tr>";
      tableBody = $("#table_id tbody");
      tableBody.append(row);
    }
    $("#table_id").DataTable({
      paging: false,
      ordering: false,
      info: false,
      searching: false,
      createdRow: function (row, data, index) {
        row.addEventListener("click", () => {
          $.get(
            `https://gorest.co.in/public/v1/users/${data[0]}`,
            function (user, status) {
              const user_ = user.data;
              console.log(user_[5]);
              document.getElementById("id").innerText = user_.id;
              document.getElementById("name").innerText = user_.name;
              document.getElementById("email").innerText = user_.email;
              document.getElementById("gender").innerText = user_.gender;
              document.getElementById("status").innerText = user_.status;
            }
          );
        });
      },
    });
  });
});

const token =
  "fa8889efe1fa17d0de0100bd81f35d3e7d5995dcd8e8c620f6dfbbb6dcc2fa04";

const deleUser = (id) => {
  $.ajax({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    type: "DELETE",
    url: `https://gorest.co.in/public/v2/users/${id}`,
    success: function (result) {
      alert("Deleted");
    },
    error: function (req, status, error) {},
  });
  window.location.reload();
};
const form = document.getElementById("userForm");
form.onsubmit = function (event) {
  event.preventDefault();
  const ele = form.elements;
  const user = {
    name: ele["name"].value,
    email: ele["email"].value,
    gender: ele["gender"].value,
    status: ele["status"].value,
  };
  $.ajax({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    type: "POST",
    url: `https://gorest.co.in/public/v2/users`,
    data: user,
    dataType: "json",
    success: function (result) {
      const prettyData = JSON.stringify(result, undefined, 2);
      document.querySelector(".new-user").innerHTML = prettyData;
    },
    error: function (req, status, error) {
      const response = `${req.responseJSON[0].field} ${req.responseJSON[0].message}`;
      alert(response);
    },
  });
};
