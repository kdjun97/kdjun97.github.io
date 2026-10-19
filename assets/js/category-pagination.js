(function () {
  "use strict";

  var container = document.getElementById("category-posts");
  var navigation = document.getElementById("category-pagination");
  if (!container || !navigation) return;

  // Keep every post in the generated HTML; without JavaScript the full list works.
  var posts = Array.from(container.children);
  var pageSize = Number(container.dataset.pageSize);
  if (!Number.isInteger(pageSize) || pageSize < 1) return;
  var totalPages = Math.ceil(posts.length / pageSize);
  if (totalPages <= 1) return;

  var list = document.createElement("ul");
  var status = document.createElement("p");
  status.className = "sr-only";
  status.setAttribute("role", "status");
  var pageLinks = [];

  function addLink(label) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    link.textContent = label;
    link.setAttribute("aria-controls", container.id);
    // The theme's smooth-scroll handler must not handle pagination fragments.
    link.setAttribute("data-scroll-ignore", "");
    item.appendChild(link);
    list.appendChild(item);
    return link;
  }

  var previous = addLink(navigation.dataset.previous);
  for (var page = 1; page <= totalPages; page++) {
    pageLinks.push(addLink(String(page)));
  }
  var next = addLink(navigation.dataset.next);

  function updateLink(link, target, disabled) {
    link.classList.toggle("disabled", disabled);
    if (disabled) {
      link.removeAttribute("href");
      link.setAttribute("aria-disabled", "true");
    } else {
      link.setAttribute("href", "#page-" + target);
      link.removeAttribute("aria-disabled");
    }
  }

  function render() {
    // Fragments preserve the category URL/canonical and support browser history.
    var match = window.location.hash.match(/^#page-(\d+)$/);
    var current = match ? Math.max(1, Math.min(Number(match[1]), totalPages)) : 1;
    var start = (current - 1) * pageSize;

    posts.forEach(function (post, index) {
      post.hidden = index < start || index >= start + pageSize;
    });
    pageLinks.forEach(function (link, index) {
      var selected = index + 1 === current;
      updateLink(link, index + 1, selected);
      link.classList.toggle("current", selected);
      if (selected) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
    updateLink(previous, current - 1, current === 1);
    updateLink(next, current + 1, current === totalPages);
    status.textContent = current + " / " + totalPages;
  }

  navigation.appendChild(list);
  navigation.appendChild(status);
  render();
  navigation.hidden = false;

  window.addEventListener("hashchange", function () {
    // Preserve ordinary anchors (for example the skip link to #main).
    var isPage = /^#page-\d+$/.test(window.location.hash);
    if (window.location.hash && !isPage) return;
    render();
    if (!isPage) return;
    var title = document.getElementById("page-title");
    if (title) {
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
      title.scrollIntoView();
    }
  });
})();
