chrome.runtime.sendMessage({ todo: "showPageAction" });

// Variables to maintain the current session
let user = 'Add UserName';
let userImg = 'https://pratikdaigavane.github.io/img.png';
let fullName = '';
let rating = '';
let organization = '';

function loginIn(e) {
    // querying the codeforces endpoint to check whether username exits,
    // if yes then its details are stored in local storage
    e.preventDefault();
    $("#loginButton").addClass('disabled');
    let val = $('#userName').val();
    console.log(val);
    fetch(`https://codeforces.com/api/user.info?handles=${val}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'OK') {
                console.log(data.result[0]);
                chrome.storage.sync.set({
                    'userName': data.result[0].handle,
                    'userImg': `https:${data.result[0].titlePhoto}` || 'https://pratikdaigavane.github.io/img.png',
                    'userFullName': (data.result[0].firstName || ' ') + " " + (data.result[0].lastName || ' '),
                    'userRating': data.result[0].rating || '',
                    'userOrg': data.result[0].organization || ''
                }, function () {
                    console.log('done');
                    location.reload();
                });
            } else {
                alert('invalid username')
                $("#loginButton").removeClass('disabled');

            }
        })
        .catch(() => {
            alert('invalid username')
            $("#loginButton").removeClass('disabled');

        })
}




chrome.storage.sync.get(['userName', 'userImg', 'userFullName', 'userRating', 'userOrg'], function (budget) {
    // when user opens a2oj.com,  checking if the details is present in localsotrage
    // and if then assigning those values to current session variables
    if (budget.userName !== undefined) {
        user = budget.userName;
        userImg = budget.userImg || 'https://pratikdaigavane.github.io/img.png';
        fullName = budget.userFullName || '';
        rating = ("Rating: " + budget.userRating) || '';
        organization = budget.userOrg || '';
    }
    renderResults();
});

function renderResults() {

    //some injectible HTML to modify the curent a2oj table
    const table = $("table");
    $('u').addClass('display-4').css('text-decoration', 'none');
    table.wrap("<div class='container'></div>");
    table.addClass("table table-bordered table-hover table-curved");
    $('body').prepend("<nav class=\"navbar fixed-top navbar-expand-lg navbar-dark bg-dark\" >\n" +
        "  <a class=\"navbar-brand\" href=\"https://www.a2oj.com/\">A2 Online Judge</a>\n" +
        "  <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n" +
        "    <span class=\"navbar-toggler-icon\"></span>\n" +
        "  </button>\n" +
        "  <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n" +
        "    <ul class=\"navbar-nav mr-auto\">\n" +
        "      <li class=\"nav-item\">\n" +
        "        <a class=\"nav-link\" href=\"https://www.a2oj.com/Ladders.html\">Ladders</a>\n" +
        "      </li>\n" +
        "      <li class=\"nav-item\">\n" +
        "        <a class=\"nav-link\" href=\"https://www.a2oj.com/Categories.html\">Categories</a>\n" +
        "      </li>\n" +
        "    </ul>\n" +
        "  </div>\n" +
        "<div class=\"dropdown\">\n" +
        `    <img src="${userImg}" width="30" height="30" class="d-inline-block align-top rounded">` +
        `    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" style="font-weight:bold">${user}</a>\n` +
        "    <div class=\"dropdown-menu dropdown-menu-right\">\n" +
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
        "</nav><br/><br/><br/><br/>");

    //after the dom is loaded, add to event listener to login button
    setTimeout(() => {
        document.getElementById("formUsr").addEventListener("submit", loginIn);
    }, 1000)

    //Now, calling the codeforces API and rendering those changes in table
    $("table > tbody > tr >th").last().text('Difficulty / Submission')
    let userProb = new Set();
    let finalProb = []
    let submissions = {}
    if (user !== 'Add UserName') {
        fetch(`https://codeforces.com/api/user.status?handle=${user}&from=1&count=5000`)
            .then(res => res.json())
            .then(res => res.result)
            .then((a) => {
                a.map((x) => {
                    // console.log(`${x.problem.contestId} ${x.problem.index} => ${x.verdict}`);
                    if (x.verdict === 'OK') {
                        userProb.add(`${x.problem.contestId}/${x.problem.index}`)
                        //1295/submission/69833817
                        if (!(x.problem.contestId in submissions)) {
                            submissions[`problem/${x.problem.contestId}/${x.problem.index}`] = `${x.problem.contestId}/submission/${x.id}`;
                        }
                    }
                })
            })
            .then(() => {
                let x = $("table > tbody > tr >td >a")
                x.each((index, tr) => {
                    var temp = tr.href;
                    temp = temp.split('problem/')
                    if (userProb.has(temp[1])) {
                        finalProb.push("problem/" + temp[1])
                    }
                })
            })
            .then(() => {
                finalProb.map((url) => {
                    sub_url = `https://codeforces.com/contest/${submissions[url]}`
                    var hello = $("a[href$=" + "'" + url + "'" + "]")
                    hello.css('color', '#001eff')
                    hello.parent().parent().css({
                        "background-color": "#00e676",
                        "color": "black"
                    })
                    hello.parent().parent().hover(function () {
                        $(this).css("background-color", "#00c853");
                    }, function () {
                        $(this).css("background-color", "#00e676");
                    });
                    let difficulty = hello.parent().parent().children().last().text()
                    // console.log(difficulty);
                    hello.parent().parent().children().last().html(`<span>${difficulty}</span> &nbsp;&nbsp;&nbsp;<a href="${sub_url}" target="_blank"><span class="badge badge-dark">View Submission</span></a>`)

                })
                console.log(submissions)
            });
    }
}



