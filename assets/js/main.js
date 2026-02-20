(function () {
  'use strict';

  var ITEMS_PER_PAGE = 18;
  var STORAGE_KEY = 'rebelart_lang';

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || 'de';
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.body.classList.toggle('lang-en', lang === 'en');
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang-switch') === lang);
    });
  }

  function initLang() {
    setLang(getLang());
    document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(this.getAttribute('data-lang-switch'));
      });
    });
  }

  // Gallery rendering from JSON data embedded in page
  function renderGallery(containerId, data, perPage) {
    var container = document.getElementById(containerId);
    if (!container || !data || !data.length) return;

    perPage = perPage || ITEMS_PER_PAGE;
    var totalPages = Math.ceil(data.length / perPage);
    var currentPage = 1;

    var params = new URLSearchParams(window.location.search);
    var p = parseInt(params.get('p'), 10);
    if (p > 0 && p <= totalPages) currentPage = p;

    function render() {
      var start = (currentPage - 1) * perPage;
      var end = Math.min(start + perPage, data.length);
      var items = data.slice(start, end);

      var html = buildPagination(currentPage, totalPages);
      html += '<div class="gallery-grid">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<div class="gallery-item">';
        html += '<a href="' + esc(item.img) + '" class="lightbox-trigger">';
        html += '<img src="' + esc(item.thumb || item.img) + '" alt="' + esc(item.title_de || item.title_en || '') + '" loading="lazy">';
        html += '</a>';
        if (item.title_de || item.title_en) {
          html += '<div class="title">';
          if (item.title_de) html += '<span data-lang="de">' + esc(item.title_de) + '</span>';
          if (item.title_en) html += '<span data-lang="en">' + esc(item.title_en) + '</span>';
          if (!item.title_de && item.title_en) html += '<span data-lang="de">' + esc(item.title_en) + '</span>';
          if (!item.title_en && item.title_de) html += '<span data-lang="en">' + esc(item.title_de) + '</span>';
          html += '</div>';
        }
        if (item.desc_de || item.desc_en) {
          html += '<div class="desc">';
          if (item.desc_de) html += '<span data-lang="de">' + esc(item.desc_de) + '</span>';
          if (item.desc_en) html += '<span data-lang="en">' + esc(item.desc_en) + '</span>';
          if (!item.desc_de && item.desc_en) html += '<span data-lang="de">' + esc(item.desc_en) + '</span>';
          if (!item.desc_en && item.desc_de) html += '<span data-lang="en">' + esc(item.desc_de) + '</span>';
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
      html += buildPagination(currentPage, totalPages);

      container.innerHTML = html;

      // Re-apply language
      setLang(getLang());

      // Bind pagination clicks
      container.querySelectorAll('[data-page]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          currentPage = parseInt(this.getAttribute('data-page'), 10);
          render();
          container.scrollIntoView({ behavior: 'smooth' });
          // Update URL without reload
          var url = new URL(window.location);
          url.searchParams.set('p', currentPage);
          history.replaceState(null, '', url);
        });
      });

      // Bind lightbox
      container.querySelectorAll('.lightbox-trigger').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(this.getAttribute('href'));
        });
      });
    }

    render();
  }

  function buildPagination(current, total) {
    if (total <= 1) return '';
    var html = '<div class="pagination">';

    // First & prev
    if (current > 1) {
      html += '<a href="#" data-page="1">&laquo;&laquo;</a> ';
      html += '<a href="#" data-page="' + (current - 1) + '">&laquo;</a> ';
    }

    for (var i = 1; i <= total; i++) {
      if (i === current) {
        html += '<span class="current">' + i + '</span> ';
      } else {
        html += '<a href="#" data-page="' + i + '">' + i + '</a> ';
      }
    }

    // Next & last
    if (current < total) {
      html += '<a href="#" data-page="' + (current + 1) + '">&raquo;</a> ';
      html += '<a href="#" data-page="' + total + '">&raquo;&raquo;</a>';
    }

    html += '</div>';
    return html;
  }

  function esc(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // Simple lightbox
  function openLightbox(src) {
    var overlay = document.getElementById('lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'lightbox';
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML = '<img src="" alt="">';
      overlay.addEventListener('click', function () {
        this.classList.remove('active');
      });
      document.body.appendChild(overlay);
    }
    overlay.querySelector('img').src = src;
    overlay.classList.add('active');
  }

  // Expose for page scripts
  window.RebelArt = {
    renderGallery: renderGallery,
    initLang: initLang
  };

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();
