chrome.runtime.sendMessage({ todo: "showPageAction" });
let user = "Add UserName";
let userImg = "https://pratikdaigavane.github.io/img.png";
let fullName = "";
let rating = "";
let organization = "";

function Allocate(e) {
  // This method is called from Perform method
  e.preventDefault(); //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
  $("#loginButton").addClass("disabled"); // After logged in loginButton gets disabled
  let val = $("#userName").val(); // variable val will contain userName of the user
  console.log(val); // console will dispplay user's userName
  fetch(`https://codeforces.com/api/user.info?handles=${val}`) // The provided URL will lead its way to json data of that user
    .then(res => res.json())
    .then(data => {
      if (data.status === "OK") {
        // Checks status of data if true then if is executed
        console.log(data.result[0]);
        chrome.storage.sync.set(
          {
            userName: data.result[0].handle, // Here userName stores data.result[0].handle which is username of user
            userImg:
              `https:${data.result[0].titlePhoto}` ||
              "https://pratikdaigavane.github.io/img.png", //stores userImg if present else default
            userFullName:
              (data.result[0].firstName || " ") +
              " " +
              (data.result[0].lastName || " "), //Actual name of user is stored in userFullName
            userRating: data.result[0].rating || "", // Rating is stored from json data
            userOrg: data.result[0].organization || "" //Organization is stored in userOrg from json data
          },
          function() {
            //This function is called when above operations are successfully executed
            console.log("done"); // console displays done
            location.reload(); // Page is refreshed
          }
        );
      } else {
        // IF !if then else is executed
        alert("invalid username"); // POP-UP of invalid username
        $("#loginButton").removeClass("disabled"); // disables login button
      }
    })
    .catch(() => {
      // response doesnt contain json data
      alert("invalid username"); // It alerts for invalid username
      $("#loginButton").removeClass("disabled"); // Login access is available again
    });
}

//All the varaibles are initailized by the respective values by the chrome storage.
chrome.storage.sync.get(
  ["userName", "userImg", "userFullName", "userRating", "userOrg"],
  function(budget) {
    if (budget.userName !== undefined) {
      //When the username is not mentioned by the user, userName will be undefined and it is skipped for the first time
      user = budget.userName; // For the second time when user enters his/her username, variable user will store actual userName mentioned
      userImg = budget.userImg || "https://pratikdaigavane.github.io/img.png"; //variable userImg will store the profile picture of the user when username is not undefined, If userName is not mentioned userImg will store default Image given by URL
      fullName = budget.userFullName || ""; //variable fullName will store actual Name of user and empty string when userName is undefined
      rating = "Rating: " + budget.userRating || ""; //variable rating will store user rating of his account and empty string when userName is undefined
      organization = budget.userOrg || ""; //variable organization will store Organization name of the user and empty string when userName is undefined
    }
    Perform(); // If userName is undefined then this function is called
  }
);

function Perform() {
  // This method gets called when userName is undefined (Probably for the first time of usage)
  // Below code enhances interface of A2OJ Ladder
  const table = $("table");
  $("u")
    .addClass("display-4")
    .css("text-decoration", "none");
  table.wrap("<div class='container'></div>");
  table.addClass("table table-bordered table-hover table-curved");
  $("body").prepend(
    '<nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark" >\n' +
      '  <a class="navbar-brand" href="https://www.a2oj.com/">A2 Online Judge</a>\n' +
      '  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">\n' +
      '    <span class="navbar-toggler-icon"></span>\n' +
      "  </button>\n" +
      '  <div class="collapse navbar-collapse" id="navbarSupportedContent">\n' +
      '    <ul class="navbar-nav mr-auto">\n' +
      '      <li class="nav-item">\n' +
      '        <a class="nav-link" href="https://www.a2oj.com/Ladders.html">Ladders</a>\n' +
      "      </li>\n" +
      '      <li class="nav-item">\n' +
      '        <a class="nav-link" href="https://www.a2oj.com/Categories.html">Categories</a>\n' +
      "      </li>\n" +
      "    </ul>\n" +
      "  </div>\n" +
      '<div class="dropdown">\n' +
      `    <img src="${userImg}" width="30" height="30" class="d-inline-block align-top rounded">` +
      `    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" style="font-weight:bold">${user}</a>\n` +
      '    <div class="dropdown-menu dropdown-menu-right">\n' +
      "<div class='container-fluid'>" +
      "<div class='row'><div class='col'>" +
      `<img src='${userImg}' class='img-fluid'/>` +
      "</div></div><br/>" +
      `<div class='row'><div class='col text-center'><p class='lead'>${fullName}</p></div></div>` +
      `<div class='row'><div class='col text-center'><p><strong>${rating}</strong></p></div></div>` +
      `<div class='row'><div class='col text-center'><p>${organization}</p></div></div>` +
      "<hr/><form id='formUsr'><div class='row'><div class='col'>" +
      `        <input placeholder='Codeforces Username' type='text' id='userName'></div></div><br/>` +
      "   <div class='row'> <div class='col text-center'><button type='submit' id='loginButton' class=\" btn btn-primary\">Login</button>\n </div>" +
      "  </div>\n" +
      `</form><div class='row'><div class='col text-center'><strong>A2OJ Enhancer</strong><p>by Pratik Daigavane</p></div></div>` +
      `<div class='row'>` +
      `<div class='col text-center'><a href='https://github.com/pratikdaigavane' target='_blank'><img width="30" height="30" src='https://pratikdaigavane.github.io/github.svg' alt=''></a></div>` +
      `<div class='col text-center'><a href='mailto:daigavanep@gmail.com' target='_blank'><img width="30" height="30" src='https://pratikdaigavane.github.io/email.svg' alt=''></a></div>` +
      `<div class='col text-center'><a href='https://linkedin.com/in/pratikdaigavane' target='_blank'><img width="30" height="30" src='https://pratikdaigavane.github.io/linkedin.svg' alt=''></a></div>` +
      `</div>` +
      "</div>" +
      "</nav><br/><br/><br/><br/>"
  );
  setTimeout(() => {
    // After putting userName and button submit is clicked Allocate method is called after 1sec
    document.getElementById("formUsr").addEventListener("submit", Allocate);
  }, 1000);
  $("table > tbody > tr >th")
    .last()
    .text("Difficulty / Submission");
  let userProb = new Set(); // userProb will contain a array which has Problem sets
  let finalProb = []; // finalProb stores an empty array
  let submissions = {}; // submissions stores empty array
  if (user !== "Add UserName") {
    // If user == userName then if is executed
    fetch(
      `https://codeforces.com/api/user.status?handle=${user}&from=1&count=5000`
    ) // URL leads its way to json data of input userName
      .then(res => res.json())
      .then(res => res.result)
      .then(a => {
        // variable a will have full json access of particular user
        a.map(x => {
          // Act as a loop and each problem is accessed
          if (x.verdict === "OK") {
            // For each problem its verdict is checked if it is OK
            userProb.add(`${x.problem.contestId}/${x.problem.index}`); // If yes then Array userProb will store all the problems solved by particular user
            if (!(x.problem.contestId in submissions)) {
              //
              submissions[
                `problem/${x.problem.contestId}/${x.problem.index}`
              ] = `${x.problem.contestId}/submission/${x.id}`;
            }
          }
        });
      })
      .then(() => {
        let x = $("table > tbody > tr >td >a"); // variable x stores some styling tags
        x.each((index, tr) => {
          // for each x function is called
          var temp = tr.href; // temp will have link of that particular problem
          temp = temp.split("problem/"); // variable temp is split into two parts hence temp will have two parts temp[0] and temp[1]
          //userProb have all the problems that are solved correctly by a particular user
          if (userProb.has(temp[1])) {
            // if userProb contains the problem number
            finalProb.push("problem/" + temp[1]); // Then that problem is pushed in another array finalProb
          }
        });
      })
      .then(() => {
        finalProb.map(url => {
          // Further finalProb will be mapped by the url of each problem
          sub_url = `https://codeforces.com/contest/${submissions[url]}`; // sub_url stores submission url of that problem
          var a_tag = $("a[href$=" + "'" + url + "'" + "]");
          a_tag.css("color", "#001eff"); // CSS stylings (color: green) are applied on the problems that are solved
          a_tag.parent()
            .parent()
            .css({
              "background-color": "#00e676", // background-color is set
              color: "black" // text color is set
            });
            a_tag.parent()
            .parent()
            .hover(
              function() {
                $(this).css("background-color", "#00c853"); // After Hovering a color effect is set
              },
              function() {
                // Then function is called
                $(this).css("background-color", "#00e676"); // Its background color is set when the problem is hovered
              }
            );
          // Difficulty / Submission Section
          let difficulty = a_tag.parent()
            .parent()
            .children()
            .last()
            .text(); 
            a_tag.parent()
            .parent()
            .children()
            .last()
            .html(
              `<span>${difficulty}</span> &nbsp;&nbsp;&nbsp;<a href="${sub_url}" target="_blank"><span class="badge badge-dark">View Submission</span></a>`
            ); //This section will have a view submission link when clicked it will lead to the successful submission of that problem with improved UI/UX
        });
        console.log(submissions); //console displays submissions
      });
  }
}
