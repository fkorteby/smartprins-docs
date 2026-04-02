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
    let w = window.innerWidth;
	if(w >= 1200) {
	    // if larger 
	    console.log('larger');
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');
		
	} else {
	    // if smaller
	    console.log('smaller');
	    sidebar.classList.remove('sidebar-visible');
		sidebar.classList.add('sidebar-hidden');
	}
};

sidebarToggler.addEventListener('click', () => {
	if (sidebar.classList.contains('sidebar-visible')) {
		console.log('visible');
		sidebar.classList.remove('sidebar-visible');
		sidebar.classList.add('sidebar-hidden');
		
	} else {
		console.log('hidden');
		sidebar.classList.remove('sidebar-hidden');
		sidebar.classList.add('sidebar-visible');
	}
});


/* ===== Smooth scrolling ====== */
/*  Note: You need to include smoothscroll.min.js (smooth scroll behavior polyfill) on the page to cover some browsers */
/* Ref: https://github.com/iamdustan/smoothscroll */

sidebarLinks.forEach((sidebarLink) => {
	
	sidebarLink.addEventListener('click', (e) => {
		
		e.preventDefault();
		
		var target = sidebarLink.getAttribute("href").replace('#', '');
		
		//console.log(target);
		
        document.getElementById(target).scrollIntoView({ behavior: 'smooth' });
        
        
        //Collapse sidebar after clicking
		if (sidebar.classList.contains('sidebar-visible') && window.innerWidth < 1200){
			
			sidebar.classList.remove('sidebar-visible');
		    sidebar.classList.add('sidebar-hidden');
		} 
		
    });
	
});


/* ===== Gumshoe SrollSpy ===== */
/* Ref: https://github.com/cferdinandi/gumshoe  */
// Initialize Gumshoe
var spy = new Gumshoe('#docs-nav a', {
	offset: 69, //sticky header height
});


/* ====== SimpleLightbox Plugin ======= */
/*  Ref: https://github.com/andreknieriem/simplelightbox */

var lightbox = new SimpleLightbox('.simplelightbox-gallery a', {/* options */});

const chatbotDiagram = new go.Diagram("chatbotDiagramDiv");


/*imgModal
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.createElement("div");
  modal.id = "imgModal";
  modal.style.cssText = `
    display:none;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;
    background:rgba(0,0,0,0.8);justify-content:center;align-items:center
  `;
  modal.innerHTML = `<img id="modalImage" style="max-width:90%; max-height:90%; border-radius:8px;"><span style="position:absolute;top:20px;right:30px;font-size:30px;color:white;cursor:pointer" id="modalClose">&times;</span>`;
  document.body.appendChild(modal);

  document.querySelectorAll(".clickable-img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      document.getElementById("modalImage").src = img.src;
      modal.style.display = "flex";
    });
  });

  document.getElementById("modalClose").addEventListener("click", () => {
    modal.style.display = "none";
  });
}); 
*/







