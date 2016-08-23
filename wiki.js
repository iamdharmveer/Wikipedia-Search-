$(document).ready(function() {

  $("#random").on("click", function() {
    e.preventDefault();
    window.open("http://en.wikipedia.org/wiki/Special:Random");
  });

  $("#searchsubmit").on("click", function(e) {
    e.preventDefault();
    handleSearch();
  });

  $("#search").on("keydown", function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      handleSearch();
    }
  });
});

function handleSearch() {
  if ($("#search").val() !== "") {
    $("#items").empty();
    testSearch($("#search").val());
  }
  $("#search").val("");
  $("#search").attr("placeholder", "Search Again");
  $("#searchsubmit").val("Search Again");
}

function processItem(elem, item) {
  var container = document.createElement("div");
  container.classList.add("item-container");
  elem.append(container);

  var row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  var col = document.createElement("div");
  col.classList.add("col-lg-12", "col-md-12");
  row.appendChild(col);

  var title = document.createElement("h1");
  title.classList.add("text-center");
  col.appendChild(title);

  var titleAnchor = document.createElement("a");
  var itemLink = "https://en.wikipedia.org/wiki/" +
    item.title.replace(/\s/g, "_");
  titleAnchor.setAttribute("href", itemLink);
  titleAnchor.setAttribute("target", "_blank");
  titleAnchor.textContent = item.title;
  title.appendChild(titleAnchor);

  container.appendChild(document.createElement("hr"));

  row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  col = document.createElement("div");
  col.classList.add("col-lg-12", "col-md-12");
  row.appendChild(col);

  var itemContent = document.createElement("div");
  itemContent.classList.add("item-content");
  col.appendChild(itemContent);
  var snip = item.snippet;
  if (snip.match(/^article.*/)) {
    snip = "This " + snip;
  } else if (snip.match(/^[a-z].*/)) {
    snip = item.title + ', ' + snip;
  }
  itemContent.innerHTML = snip + " . . .";

  // container.appendChild(itemContent);
}

function searchEmpty(elem) {
  
  var container = document.createElement("div");
  container.classList.add("item-container");
  elem.append(container);

  var row = document.createElement("div");
  row.classList.add("row");
  container.appendChild(row);

  var col = document.createElement("div");
  col.classList.add("col-lg-12", "col-md-12");
  row.appendChild(col);

  var title = document.createElement("h1");
  title.innerText = "Search Returned Nothing";
  title.classList.add("text-center");
  col.appendChild(title);
}

function testSearch(search) {
  $.ajax('https://en.wikipedia.org/w/api.php?' +
    'action=query&list=search&srwhat=text&prop=links&format=json&callback=?&srsearch=' +
    search, {
      type: 'GET',
      contentType: 'application/json',
      dataType: 'json',
      success: function(response) {
        console.log("response: " + JSON.stringify(response));

        if (response.query.search.length > 0) {
        response.query.search.forEach(function(item) {
          processItem($("#items"), item);
        });
        } else {
          searchEmpty($("#items"));
        }
      },
      error: function(request, errorType, errorMessage) {
        // console.log(JSON.stringify(request));
        // alert("error: "+errorType+" Message: "+errorMessage);
      }
    });
}
