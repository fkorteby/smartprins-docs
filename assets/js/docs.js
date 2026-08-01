"use strict";


/* ====== Define JS Constants ====== */
const sidebarToggler = document.getElementById('docs-sidebar-toggler');
const sidebar = document.getElementById('docs-sidebar');
const sidebarLinks = document.querySelectorAll('#docs-sidebar .scrollto');



/* ===== Responsive Sidebar ====== */

window.onload=function()
{
    responsiveSidebar();
};

window.onresize=function()
{
    responsiveSidebar();
};


function responsiveSidebar() {
    if (!sidebar) return;

    let w = window.innerWidth;
	if(w >= 1200) {
	    // if larger
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');

	} else {
	    // if smaller
	    sidebar.classList.remove('sidebar-visible');
		sidebar.classList.add('sidebar-hidden');
	}
};

if (sidebarToggler && sidebar) {
	sidebarToggler.addEventListener('click', () => {
		if (sidebar.classList.contains('sidebar-visible')) {
			sidebar.classList.remove('sidebar-visible');
			sidebar.classList.add('sidebar-hidden');

		} else {
			sidebar.classList.remove('sidebar-hidden');
			sidebar.classList.add('sidebar-visible');
		}
	});
}


/* ===== Smooth scrolling ====== */
/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
/* Ref: https://github.com/iamdustan/smoothscroll */

sidebarLinks.forEach((sidebarLink) => {

	sidebarLink.addEventListener('click', (e) => {

		e.preventDefault();

		var target = sidebarLink.getAttribute("href").replace('#', '');

        const targetEl = document.getElementById(target);
        if (targetEl) {
			targetEl.scrollIntoView({ behavior: 'smooth' });
		}


        //Collapse sidebar after clicking
		if (sidebar && sidebar.classList.contains('sidebar-visible') && window.innerWidth < 1200){

			sidebar.classList.remove('sidebar-visible');
		    sidebar.classList.add('sidebar-hidden');
		}

    });

});


/* ===== Gumshoe SrollSpy ===== */
/* Ref: https://github.com/cferdinandi/gumshoe  */
// Initialize Gumshoe
if (typeof Gumshoe !== 'undefined' && document.querySelector('#docs-nav a')) {
	var spy = new Gumshoe('#docs-nav a', {
		offset: 69, //sticky header height
	});
}


/* ====== SimpleLightbox Plugin ======= */
/*  Ref: https://github.com/andreknieriem/simplelightbox */
if (typeof SimpleLightbox !== 'undefined' && document.querySelector('.simplelightbox-gallery a')) {
	var lightbox = new SimpleLightbox('.simplelightbox-gallery a', {/* options */});
}

if (typeof go !== 'undefined' && document.getElementById('chatbotDiagramDiv')) {
	const chatbotDiagram = new go.Diagram("chatbotDiagramDiv");
}


/* ====== Image zoom modal (Bootstrap) ======= */
/* Prevents stuck dark overlays caused by opening the modal twice
   (data-bs-toggle + new bootstrap.Modal().show() on every click). */
(function initImageZoomModal() {
	function cleanupModalArtifacts() {
		document.querySelectorAll('.modal-backdrop').forEach(function (el) {
			el.remove();
		});
		document.body.classList.remove('modal-open');
		document.body.style.removeProperty('overflow');
		document.body.style.removeProperty('padding-right');
	}

	function bindImageZoomModal() {
		if (typeof bootstrap === 'undefined' || !bootstrap.Modal) return;

		// Always clean leftover backdrops when any modal finishes closing
		document.querySelectorAll('.modal').forEach(function (modalEl) {
			if (modalEl.dataset.zoomCleanupBound) return;
			modalEl.dataset.zoomCleanupBound = '1';
			modalEl.addEventListener('hidden.bs.modal', cleanupModalArtifacts);
		});

		var modalEl = document.getElementById('imageModal');
		if (!modalEl) return;

		var modalImage = document.getElementById('modalImage');
		var modal = bootstrap.Modal.getOrCreateInstance(modalEl);

		document.querySelectorAll('.zoom-effect, #workflowImage, img[data-bs-toggle="modal"]').forEach(function (img) {
			if (img.dataset.zoomBound) return;
			img.dataset.zoomBound = '1';

			// Prefer the shared #imageModal (many pages point data-bs-target at missing IDs)
			var targetSelector = img.getAttribute('data-bs-target');
			var targetEl = targetSelector ? document.querySelector(targetSelector) : null;
			var useSharedModal = !targetEl || targetEl.id === 'imageModal';

			// Stop Bootstrap's data-api from opening in parallel with our handler
			img.removeAttribute('data-bs-toggle');
			img.removeAttribute('data-bs-target');
			if (!img.style.cursor) {
				img.style.cursor = 'zoom-in';
			}

			if (!useSharedModal) {
				// Rare case: a real alternate modal exists — let Bootstrap handle it via a fresh toggle
				img.setAttribute('data-bs-toggle', 'modal');
				img.setAttribute('data-bs-target', '#' + targetEl.id);
				return;
			}

			img.addEventListener('click', function () {
				if (modalImage) {
					modalImage.src = this.src;
					if (this.alt) {
						modalImage.alt = this.alt;
					}
				}
				modal.show();
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bindImageZoomModal);
	} else {
		bindImageZoomModal();
	}
})();
