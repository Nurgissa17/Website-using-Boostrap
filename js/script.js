function feedback(id, valid, error) {
    const color = valid ? "text-success" : "text-danger";
    $("#" + id + "Feedback").text(valid ? "✓" : error).attr("class", "d-block " + color);
}
function checkForm() {
    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const message = $("#message").val().trim();
    const password = $("#password").val();
    const confirmation = $("#confirmPassword").val();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const match = password !== "" && password === confirmation;
    feedback("name", name !== "", "Name is required.");
    feedback("email", validEmail, "Enter a valid email.");
    feedback("message", message !== "", "Message is required.");
    feedback("password", password !== "", "Password is required.");
    feedback("confirmPassword", match, "Passwords must match.");
    let strength = "Weak";
    if (password.length >= 8) strength = "Medium";
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength = "Strong";
    let color = "text-danger";
    if (strength === "Medium") color = "text-warning";
    if (strength === "Strong") color = "text-success";
    $("#strength").text(password ? "Strength: " + strength : "").attr("class", "d-block " + color);
    return name !== "" && validEmail && message !== "" && password !== "" && match;
}
$("#registerForm input, #registerForm textarea").on("input", function () {
    checkForm();
    $("#formStatus").text("");
});
$("#registerForm").on("submit", function (event) {
    event.preventDefault();
    const valid = checkForm();
    $("#formStatus").text(valid ? "Validation passed (demo only; no account created)." : "Please correct the fields above.")
        .attr("class", valid ? "mt-2 text-success" : "mt-2 text-danger");
});

let category = "all";
function filterNews() {
    const search = $("#search").val().toLowerCase();
    $(".news-item").each(function () {
        const matchingText = $(this).text().toLowerCase().includes(search);
        const matchingCategory = category === "all" || $(this).attr("data-category") === category;
        if (matchingText && matchingCategory) $(this).show();
        else $(this).hide();
    });
}
$("#search").on("input", filterNews);
$(".category-btn").click(function () {
    category = $(this).attr("data-category");
    $(".category-btn").removeClass("btn-primary").addClass("btn-outline-primary");
    $(this).removeClass("btn-outline-primary").addClass("btn-primary");
    filterNews();
});

let games = [
    ["Counter-Strike 2", "FPS", "9/10"],
    ["Sekiro", "Action", "9/10"],
    ["VALORANT", "FPS", "8/10"],
    ["Fortnite", "Battle Royale", "8/10"],
    ["PUBG", "Battle Royale", "8/10"]
];
function showGames() {
    $("#gameRows").empty();
    games.forEach(function (game, i) {
        const row = $("<tr>");
        row.append($("<td>").text(game[0]), $("<td>").text(game[1]), $("<td>").text(game[2]));
        row.append($("<td>").append(
            $("<button class='btn btn-sm btn-primary me-2 edit'>Edit</button>").attr("data-index", i),
            $("<button class='btn btn-sm btn-danger delete'>Delete</button>").attr("data-index", i)
        ));
        $("#gameRows").append(row);
    });
}
if ($("#gameRows").length) showGames();
$("#gameForm").on("submit", function (event) {
    event.preventDefault();
    const game = [$("#gameName").val().trim(), $("#gameGenre").val().trim(), $("#gameScore").val().trim()];
    if (!game[0] || !game[1] || !game[2]) {
        alert("Fill in all fields.");
        return;
    }
    games.push(game);
    this.reset();
    showGames();
});
$("#gameRows").on("click", ".edit", function () {
    const index = Number($(this).attr("data-index"));
    const row = $(this).closest("tr");
    if ($(this).text() === "Edit") {
        row.find("td").each(function (i) {
            if (i < 3) $(this).empty().append($("<input class='form-control'>").val(games[index][i]));
        });
        $(this).text("Save");
    } else {
        const values = [];
        row.find("input").each(function () { values.push($(this).val().trim()); });
        if (!values[0] || !values[1] || !values[2]) {
            alert("Fill in all fields.");
            return;
        }
        games[index] = values;
        showGames();
    }
});
$("#gameRows").on("click", ".delete", function () {
    if (confirm("Delete this game?")) {
        games.splice(Number($(this).attr("data-index")), 1);
        showGames();
    }
});

let imageIndex = 0;
function showImage() {
    const image = $("#gallery img").eq(imageIndex);
    $("#largeImage").attr("src", image.attr("src")).attr("alt", image.attr("alt"));
}
$("#gallery img").click(function () {
    imageIndex = $("#gallery img").index(this);
    showImage();
    $("#lightbox").fadeIn(200);
});
function changeImage(step) {
    $("#largeImage").fadeOut(150, function () {
        imageIndex = (imageIndex + step + $("#gallery img").length) % $("#gallery img").length;
        showImage();
        $("#largeImage").fadeIn(150);
    });
}
$("#prevImage").click(function () { changeImage(-1); });
$("#nextImage").click(function () { changeImage(1); });
$("#closeImage").click(function () { $("#lightbox").fadeOut(200); });
