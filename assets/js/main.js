$(function () {
  if (geoJson != undefined) {
    var map = L.map('map');

    var popups = {}

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

    function onEachFeature(feature, layer) {
      if (feature.properties) {
        var popup = null
        if (feature.geometry.type == "LineString") {
          var description = ""
          if (feature.properties.date) {
            description += "Data : " + feature.properties.date + "<br/>";
          }
          if (feature.properties.name) {
            description += feature.properties.name + "<br/>";
          }
          if (feature.properties.start) {
            description += "Początek : " + feature.properties.start + "<br/>";
          }
          if (feature.properties.end) {
            description += "Koniec : " + feature.properties.end + "<br/>";
          }
          if (feature.properties.distance) {
            description += "Dystans : " + parseInt(feature.properties.distance / 1000) + "km";
          }
          popup = layer.bindPopup(description);
        }
        if (feature.geometry.type == "Point") {
          popup = layer.bindPopup(feature.properties.name)
        }
        if (popup.feature.properties && popup.feature.properties.id) {
          popups[popup.feature.properties.id] = popup;
        }
      }
    }

    jsonLayer = L.geoJSON(geoJson, {
      onEachFeature: onEachFeature,
      style: function (feature) {
        if (feature.properties != undefined && feature.properties.stroke != undefined) {
          var style = {
            color: feature.properties["stroke"],
            weight: feature.properties["stroke-width"],
            opacity: feature.properties["stroke-opacity"]
          }
          return style;
        }
      }
    }).addTo(map);

    map.fitBounds(jsonLayer.getBounds());
  }

  function focusOnMarker(id, zoomLevel) {

    var c = geoJson.features.filter(el => el.properties.id == id)

    var coord = c[0].geometry.coordinates

    lalo = L.GeoJSON.coordsToLatLng(coord);
    popups[c[0].properties.id].openPopup();

    if (zoomLevel != undefined) {
      let currentZoom = map.getZoom()
      if (currentZoom > zoomLevel) {
        map.setView(lalo)
      }
      else {
        map.setView(lalo, zoomLevel)
      }
    }
    else {
      map.setView(lalo)
    }
  }

  function focusOnRoute(id) {

    var c = geoJson.features.filter(el => el.properties.id == id)

    var coords = c[0].geometry.coordinates;
    var geom = L.GeoJSON.coordsToLatLngs(coords);
    var line = L.polyline(geom);
    popups[id].openPopup();

    map.fitBounds(line.getBounds());
  }

  $(".hide-button").click(function () {
    $("#map-border").hide();
  })

  $(".size-button").click(function () {
    if ($("#map-border").width() != 600) {
      $("#map-border").width(600);
      $("#map-border").height(400);
    }
    else {
      $("#map-border").width(250);
      $("#map-border").height(400);
    }
    map.invalidateSize();
  })

  $(".focus-on-marker").click(function () {
    let id = $(this).data("marker-id");
    let markerZoomLevel = $(this).data("marker-zoom-level");
    $("#map-border").show();
    focusOnMarker(id, markerZoomLevel);
  })

  $(".focus-on-route").click(function () {
    let routeId = $(this).data("route-id");
    $("#map-border").show();
    focusOnRoute(routeId);
  })

  $('.flex-container').scroll(function () {
    alert('ok');
    var winTop = $(this).scrollTop();

    $(".focus-on-marker").each(function () {
      var section = $(this).offset().top;
      if (winTop >= section - 400) {
        $(this).click();
      }
    });
  });
})


$(function () {
  // Cache variables for increased performance on devices with slow CPUs.
  var flexContainer = $('div.flex-container')
  var searchBox = $('.search-box')
  var searchClose = $('.search-icon-close')
  var searchInput = $('#search-input')

  // Menu Settings
  $('.menu-icon, .menu-icon-close').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    flexContainer.toggleClass('active')
  })

  // Click outside of menu to close it
  flexContainer.click(function (e) {
    if (flexContainer.hasClass('active') && e.target.tagName !== 'A') {
      flexContainer.removeClass('active')
    }
  })

  // Press Escape key to close menu
  $(window).keydown(function (e) {
    if (e.key === 'Escape') {
      if (flexContainer.hasClass('active')) {
        flexContainer.removeClass('active')
      } else if (searchBox.hasClass('search-active')) {
        searchBox.removeClass('search-active')
      }
    }
  })

  // Search Settings
  $('.search-icon').click(function (e) {
    e.preventDefault()
    searchBox.toggleClass('search-active')
    searchInput.focus()

    if (searchBox.hasClass('search-active')) {
      searchClose.click(function (e) {
        e.preventDefault()
        searchBox.removeClass('search-active')
      })
    }
  })

  const regex = /\["(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_]*)"/g // the only difference is the [ at the beginning
  function extractPhotos(content) {
    const links = new Set()
    let match
    while (match = regex.exec(content)) {
      links.add(match[1])
    }
    return Array.from(links)
  }
})


var initPhotoSwipeFromDOM = function (gallerySelector) {

  // parse slide data (url, title, size ...) from DOM elements 
  // (children of gallerySelector)
  var parseThumbnailElements = function (el) {
    var thumbElements = el.childNodes,
      numNodes = thumbElements.length,
      items = [],
      figureEl,
      linkEl,
      size,
      item;

    for (var i = 0; i < numNodes; i++) {

      figureEl = thumbElements[i]; // <figure> element

      // include only element nodes 
      if (figureEl.nodeType !== 1) {
        continue;
      }

      linkEl = figureEl.children[0]; // <a> element

      size = linkEl.getAttribute('data-size').split('x');

      // create slide object
      item = {
        src: linkEl.getAttribute('href'),
        w: parseInt(size[0], 10),
        h: parseInt(size[1], 10)
      };



      if (figureEl.children.length > 1) {
        // <figcaption> content
        item.title = figureEl.children[1].innerHTML;
      }

      if (linkEl.children.length > 0) {
        // <img> thumbnail element, retrieving thumbnail url
        item.msrc = linkEl.children[0].getAttribute('src');
      }

      item.el = figureEl; // save link to element for getThumbBoundsFn
      items.push(item);
    }

    return items;
  };

  // find nearest parent element
  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function (e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : e.returnValue = false;

    var eTarget = e.target || e.srcElement;

    // find root element of slide
    var clickedListItem = closest(eTarget, function (el) {
      return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
    });

    if (!clickedListItem) {
      return;
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    var clickedGallery = clickedListItem.parentNode,
      childNodes = clickedListItem.parentNode.childNodes,
      numChildNodes = childNodes.length,
      nodeIndex = 0,
      index;

    for (var i = 0; i < numChildNodes; i++) {
      if (childNodes[i].nodeType !== 1) {
        continue;
      }

      if (childNodes[i] === clickedListItem) {
        index = nodeIndex;
        break;
      }
      nodeIndex++;
    }



    if (index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  var photoswipeParseHash = function () {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split('&');
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split('=');
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
      gallery,
      options,
      items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {

      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),

      getThumbBoundsFn: function (index) {
        // See Options -> getThumbBoundsFn section of documentation for more info
        var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }

    };

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used 
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };

  // loop through all gallery elements and bind events
  var galleryElements = document.querySelectorAll(gallerySelector);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};

$(function () {
  // execute above function
  initPhotoSwipeFromDOM('.my-gallery');
})
