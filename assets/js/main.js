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

  $('.gallery').html(
    `<div data-nanogallery2='{
      "userID": "184392815@N04",
      "kind": "flickr",
      "photoset": "72157710794650718",
      "thumbnailOpenOriginal": true,
      "thumbnailWidth": "200",
      "thumbnailAlignment": "center",
      "thumbnailLabel": {
        "display": false
      }
    }'></div>`);
})
