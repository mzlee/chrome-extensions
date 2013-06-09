// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Search the bookmarks when entering the search keyword.
$(function() {
  $('#search').change(function() {
     $('#bookmarks').empty();
     dumpBookmarks($('#search').val());
  });
});
// Traverse the bookmark tree, and print the folder and nodes.
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    var node = dumpNode(bookmarkNodes[i], query);
    if (node)
        list.append(node);
  }
  return list;
}
function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && !bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
    var anchor = $('<a>');
    anchor.attr('href', bookmarkNode.url);
    var img = getLocalData(bookmarkNode.url);
    if (img != null) {
        var image = $('<img>');
        image.attr("src",  img);
        image.attr("width", "360");
        image.attr("height", "200");
        image.attr("style", "border: solid black 5; padding: 5px; margin: 5px; background: #999999;");
        anchor.attr("width", "360");
        anchor.attr("height", "200");
        anchor.append(image);
    } else {
        anchor.text(bookmarkNode.title);
    }
    /*
     * When clicking on a bookmark in the extension, a new tab is fired with
     * the bookmark url.
     */
    anchor.click(function(e) {
      chrome.tabs.create({url: bookmarkNode.url});
      e.preventDefault();
    });
    var span;
    if (img != null) {
        span = $('<div class="float">');
    } else {
        span = $('<span>');
    }
    var options;
    if (img != null) {
        var overlay = $('<span class="overlay">');
        overlay.html('<div class="spacer"></div>[' +
                     '<a id="editlink" href="#">Edit</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                     '<a id="deletelink" href="#">Delete</a>]');
        overlay.click(function() {
                chrome.tabs.create({url: bookmarkNode.url});
            });
        options = overlay;
    } else {
        options = bookmarkNode.children ?
            $('<span>[<a href="#" id="addlink">Add</a>]</span>') :
            $('<span>[<a id="editlink" href="#">Edit</a> <a id="deletelink" ' +
              'href="#">Delete</a>]</span>');
    }
    var edit = bookmarkNode.children ? $('<table><tr><td>Name</td><td>' +
                                         '<input id="title"></td></tr><tr><td>URL</td><td><input id="url">' +
                                         '</td></tr></table>') : $('<input>');
    // Show add and edit links when hover over.
    span.hover(function() {
        span.append(options);
        $('#deletelink').click(function(e) {
          $('#deletedialog').empty().dialog({
                 autoOpen: false,
                 title: 'Confirm Deletion',
                 resizable: false,
                 height: 140,
                 modal: true,
                 overlay: {
                   backgroundColor: '#000',
                   opacity: 0.5
                 },
                 buttons: {
                   'Yes, Delete It!': function() {
                      chrome.bookmarks.remove(String(bookmarkNode.id));
                      deleteLocalData(bookmarkNode.url);
                      span.parent().remove();
                      $(this).dialog('destroy');
                    },
                    Cancel: function() {
                      $(this).dialog('destroy');
                    }
                 }
               }).dialog('open');
          e.preventDefault();
         });
        $('#addlink').click(function() {
          $('#adddialog').empty().append(edit).dialog({autoOpen: false,
            closeOnEscape: true, title: 'Add New Bookmark', modal: true,
            buttons: {
            'Add' : function() {
               chrome.bookmarks.create({parentId: bookmarkNode.id,
                 title: $('#title').val(), url: $('#url').val()});
               $('#bookmarks').empty();
               $(this).dialog('destroy');
               window.dumpBookmarks();
             },
            'Cancel': function() {
               $(this).dialog('destroy');
            }
          }}).dialog('open');
        });
        $('#editlink').click(function(e) {
         edit.val(anchor.text());
         $('#editdialog').empty().append(edit).dialog({autoOpen: false,
           closeOnEscape: true, title: 'Edit Title', modal: true,
           show: 'slide', buttons: {
              'Save': function() {
                 chrome.bookmarks.update(String(bookmarkNode.id), {
                   title: edit.val()
                 });
                 anchor.text(edit.val());
                 options.show();
                 $(this).dialog('destroy');
              },
             'Cancel': function() {
                 $(this).dialog('destroy');
             }
         }}).dialog('open');
         e.preventDefault();
        });
        options.fadeIn();
      },
      // unhover
      function() {
        options.remove();
      }).append(anchor);
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  if (img != null) {
      $('#short').append(span);
      return false;
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});
