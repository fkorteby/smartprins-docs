"use strict";


/* ====== Define JS Constants ====== */
const sidebarToggler = document.getElementById('docs-sidebar-toggler');
const sidebar = document.getElementById('docs-sidebar');
const sidebarLinks = document.querySelectorAll('#docs-sidebar .scrollto');

function getSidebarBackdrop() {
	var backdrop = document.getElementById('docs-sidebar-backdrop');
	if (!backdrop) {
		backdrop = document.createElement('div');
		backdrop.id = 'docs-sidebar-backdrop';
		backdrop.className = 'docs-sidebar-backdrop';
		backdrop.setAttribute('aria-hidden', 'true');
		document.body.appendChild(backdrop);
		backdrop.addEventListener('click', closeMobileSidebar);
	}
	return backdrop;
}

function isMobileSidebar() {
	return window.innerWidth < 1200;
}

function openMobileSidebar() {
	if (!sidebar) return;
	sidebar.classList.remove('sidebar-hidden');
	sidebar.classList.add('sidebar-visible');
	if (isMobileSidebar()) {
		getSidebarBackdrop().classList.add('show');
		document.body.classList.add('docs-sidebar-open');
	}
	if (sidebarToggler) {
		sidebarToggler.setAttribute('aria-expanded', 'true');
	}
}

function closeMobileSidebar() {
	if (!sidebar) return;
	sidebar.classList.remove('sidebar-visible');
	sidebar.classList.add('sidebar-hidden');
	var backdrop = document.getElementById('docs-sidebar-backdrop');
	if (backdrop) {
		backdrop.classList.remove('show');
	}
	document.body.classList.remove('docs-sidebar-open');
	if (sidebarToggler) {
		sidebarToggler.setAttribute('aria-expanded', 'false');
	}
}

function toggleMobileSidebar() {
	if (!sidebar) return;
	if (sidebar.classList.contains('sidebar-visible')) {
		closeMobileSidebar();
	} else {
		openMobileSidebar();
	}
}


/* ===== Responsive Sidebar ====== */

let lastWasDesktop = window.innerWidth >= 1200;

window.onload=function()
{
    lastWasDesktop = window.innerWidth >= 1200;
    responsiveSidebar(true);
};

window.onresize=function()
{
    responsiveSidebar(false);
};


function responsiveSidebar(force) {
    if (!sidebar) return;

    let w = window.innerWidth;
	const isDesktop = w >= 1200;

	if(isDesktop) {
	    // Desktop: always show sidebar, never keep mobile overlay
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');
		var backdrop = document.getElementById('docs-sidebar-backdrop');
		if (backdrop) {
			backdrop.classList.remove('show');
		}
		document.body.classList.remove('docs-sidebar-open');
		if (sidebarToggler) {
			sidebarToggler.setAttribute('aria-expanded', 'false');
		}

	} else if (force || lastWasDesktop) {
	    // Mobile: start closed (or just crossed down from desktop)
	    closeMobileSidebar();
	}

	lastWasDesktop = isDesktop;
};

if (sidebarToggler && sidebar) {
	if (document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl') {
		sidebarToggler.setAttribute('aria-label', 'فتح وإغلاق قائمة التنقل');
	}
	sidebarToggler.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		toggleMobileSidebar();
	});
}

// Apply initial sidebar state as soon as possible (avoid waiting only for full window load)
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function () {
		lastWasDesktop = window.innerWidth >= 1200;
		responsiveSidebar(true);
	});
} else {
	lastWasDesktop = window.innerWidth >= 1200;
	responsiveSidebar(true);
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


        //Collapse sidebar after clicking a link on mobile
		if (sidebar && isMobileSidebar()){
			closeMobileSidebar();
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
