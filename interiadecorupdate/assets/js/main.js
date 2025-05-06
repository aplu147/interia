// Main JavaScript for Frontend
document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
  
  // Initialize components based on current page
  const currentPage = window.location.pathname.split('/').pop();
  
  // Common initializations
  initCommonComponents();
  
  // Page-specific initializations
  switch(currentPage) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'about.html':
      initAboutPage();
      break;
    case 'services.html':
      initServicesPage();
      break;
    case 'projects.html':
      initProjectsPage();
      break;
    case 'contact.html':
      initContactPage();
      break;
  }
});

function initCommonComponents() {
  // Navigation scroll effect
  window.addEventListener('scroll', handleNavScroll);
  
  // Initialize Bootstrap tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Load dynamic content that appears on all pages
  loadTestimonials();
}

function handleNavScroll() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

/* Home Page Functions */
function initHomePage() {
  // Initialize parallax effects
  initParallax();
  
  // Load dynamic content
  loadHomeContent();
  loadServicesPreview();
  loadProjectsPreview();
  loadFacebookFeed();
  
  // Newsletter form submission
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);
  }
}

function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-section');
  parallaxElements.forEach(el => {
    new simpleParallax(el, {
      orientation: 'up',
      scale: 1.1,
      delay: 0.6,
      transition: 'cubic-bezier(0,0,0,1)'
    });
  });
}

async function loadHomeContent() {
  try {
    const response = await fetch('assets/data/home-content.json');
    const content = await response.json();
    
    // Update hero section
    if (content.hero) {
      document.getElementById('hero-title').textContent = content.hero.title;
      document.getElementById('hero-subtitle').textContent = content.hero.subtitle;
    }
    
    // Update about preview
    if (content.about) {
      document.getElementById('about-summary').textContent = content.about.summary;
    }
  } catch (error) {
    console.error('Error loading home content:', error);
  }
}

async function loadServicesPreview() {
  try {
    const response = await fetch('assets/data/services.json');
    const services = await response.json();
    
    const container = document.getElementById('services-container');
    if (container) {
      container.innerHTML = services.slice(0, 3).map(service => `
        <div class="col-md-4">
          <div class="service-card">
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

async function loadProjectsPreview() {
  try {
    const response = await fetch('assets/data/projects.json');
    const projects = await response.json();
    
    const container = document.getElementById('projects-container');
    if (container) {
      container.innerHTML = projects.slice(0, 3).map(project => `
        <div class="col-md-4">
          <div class="project-card">
            <img src="assets/images/projects/${project.image}" alt="${project.title}">
            <div class="project-overlay">
              <h3>${project.title}</h3>
              <p>${project.type}</p>
              <small>${project.location || ''}</small>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

async function loadTestimonials() {
  try {
    const response = await fetch('assets/data/testimonials.json');
    const testimonials = await response.json();
    
    const container = document.getElementById('testimonials-container');
    if (container) {
      container.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
          <div class="testimonial-text">"${testimonial.text}"</div>
          <div class="testimonial-author">— ${testimonial.author}</div>
          <div class="testimonial-role">${testimonial.role || ''}</div>
        </div>
      `).join('');
      
      // Initialize testimonial slider if on homepage
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initTestimonialSlider();
      }
    }
  } catch (error) {
    console.error('Error loading testimonials:', error);
  }
}

function initTestimonialSlider() {
  // This would be implemented with a slider library like Slick or Glide
  console.log('Testimonial slider would initialize here');
}

function loadFacebookFeed() {
  const container = document.getElementById('facebook-feed');
  if (container) {
    container.innerHTML = `
      <div class="fb-placeholder">
        <p>Follow us on <a href="https://facebook.com/interiadecorbd" target="_blank">Facebook</a> for the latest updates!</p>
        <div class="fb-page" 
             data-href="https://www.facebook.com/interiadecorbd"
             data-tabs="timeline"
             data-width="500"
             data-height="500"
             data-small-header="false"
             data-adapt-container-width="true"
             data-hide-cover="false"
             data-show-facepile="true">
        </div>
      </div>
    `;
    
    // Load Facebook SDK
    loadFacebookSDK();
  }
}

function loadFacebookSDK() {
  // Check if SDK is already loaded
  if (window.FB) return;
  
  // Create script element
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0';
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  document.body.appendChild(script);
}

function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  
  // In a real implementation, this would send to a server
  console.log('Newsletter signup:', email);
  
  // Show success message
  alert('Thank you for subscribing to our newsletter!');
  e.target.reset();
}

// Initialize testimonial slider
document.addEventListener('DOMContentLoaded', function() {
  // Project filtering
  const filterButtons = document.querySelectorAll('.btn-filter');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  
  // Project filtering functionality
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.btn-filter');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Initialize Facebook SDK
  if (document.querySelector('.fb-page')) {
    window.fbAsyncInit = function() {
      FB.init({
        xfbml: true,
        version: 'v12.0'
      });
    };

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }
});
  
  // Initialize testimonial slider with auto-scroll
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    let scrollAmount = 0;
    const scrollStep = 330; // Width of card + gap
    
    function autoScroll() {
      scrollAmount += scrollStep;
      
      // Reset if reached end
      if (scrollAmount > testimonialSlider.scrollWidth - testimonialSlider.clientWidth) {
        scrollAmount = 0;
      }
      
      testimonialSlider.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    
    // Auto-scroll every 5 seconds
    setInterval(autoScroll, 5000);
  }
});

// Load Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
    appId            : 'your-app-id',
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v12.0'
  });
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* About Page Functions */
function initAboutPage() {
  loadAboutContent();
  loadTeamMembers();
}

async function loadAboutContent() {
  try {
    const response = await fetch('assets/data/about-content.json');
    const content = await response.json();
    
    if (content.story) {
      document.getElementById('about-story').textContent = content.story;
    }
    
    if (content.mission) {
      document.getElementById('about-mission').textContent = content.mission;
    }
  } catch (error) {
    console.error('Error loading about content:', error);
  }
}

async function loadTeamMembers() {
  try {
    const response = await fetch('assets/data/team.json');
    const team = await response.json();
    
    const container = document.getElementById('team-container');
    if (container) {
      container.innerHTML = team.map(member => `
        <div class="col-md-4">
          <div class="team-card">
            <img src="assets/images/team/${member.image || 'default.jpg'}" alt="${member.name}" class="img-fluid">
            <h3>${member.name}</h3>
            <p class="position">${member.position}</p>
            <div class="social-links">
              ${member.facebook ? `<a href="${member.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
              ${member.linkedin ? `<a href="${member.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
              ${member.twitter ? `<a href="${member.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error('Error loading team members:', error);
  }
}

/* Services Page Functions */
function initServicesPage() {
  loadAllServices();
}

async function loadAllServices() {
  try {
    const response = await fetch('assets/data/services.json');
    const services = await response.json();
    
    const container = document.getElementById('services-container');
    if (container) {
      container.innerHTML = services.map(service => `
        <div class="col-md-4">
          <div class="service-card">
            <i class="${service.icon}"></i>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            ${service.details ? `<a href="#" class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#serviceModal" data-service='${JSON.stringify(service)}'>Details</a>` : ''}
          </div>
        </div>
      `).join('');
      
      // Add event listeners to detail buttons
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener('click', function() {
          const service = JSON.parse(this.getAttribute('data-service'));
          showServiceDetails(service);
        });
      });
    }
  } catch (error) {
    console.error('Error loading services:', error);
  }
}

function showServiceDetails(service) {
  const modal = document.getElementById('serviceModal');
  if (modal) {
    modal.querySelector('.modal-title').textContent = service.title;
    modal.querySelector('.modal-body').innerHTML = `
      <p>${service.details || 'No additional details available.'}</p>
      ${service.image ? `<img src="assets/images/services/${service.image}" alt="${service.title}" class="img-fluid mb-3">` : ''}
    `;
  }
}

/* Projects Page Functions */
function initProjectsPage() {
  loadAllProjects();
}

async function loadAllProjects() {
  try {
    const response = await fetch('assets/data/projects.json');
    const projects = await response.json();
    
    const container = document.getElementById('projects-container');
    if (container) {
      // Create filter buttons
      const types = [...new Set(projects.map(p => p.type))];
      const filterHtml = `
        <div class="project-filters mb-4">
          <button class="btn btn-outline-primary active" data-filter="all">All</button>
          ${types.map(type => `
            <button class="btn btn-outline-primary" data-filter="${type.toLowerCase()}">${type}</button>
          `).join('')}
        </div>
      `;
      
      // Create project cards
      const projectsHtml = projects.map(project => `
        <div class="col-md-4 project-item" data-type="${project.type.toLowerCase()}">
          <div class="project-card">
            <img src="assets/images/projects/${project.image}" alt="${project.title}">
            <div class="project-overlay">
              <h3>${project.title}</h3>
              <p>${project.type}</p>
              <small>${project.location || ''}</small>
              <button class="btn btn-sm btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#projectModal" data-project='${JSON.stringify(project)}'>
                View Details
              </button>
            </div>
          </div>
        </div>
      `).join('');
      
      container.innerHTML = filterHtml + '<div class="row" id="project-items">' + projectsHtml + '</div>';
      
      // Add filter event listeners
      document.querySelectorAll('.project-filters button').forEach(btn => {
        btn.addEventListener('click', function() {
          const filter = this.getAttribute('data-filter');
          filterProjects(filter);
          
          // Update active button
          document.querySelectorAll('.project-filters button').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
      
      // Add modal event listeners
      document.querySelectorAll('[data-bs-toggle="modal"]').forEach(btn => {
        btn.addEventListener('click', function() {
          const project = JSON.parse(this.getAttribute('data-project'));
          showProjectDetails(project);
        });
      });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

function filterProjects(filter) {
  const items = document.querySelectorAll('.project-item');
  
  items.forEach(item => {
    if (filter === 'all' || item.getAttribute('data-type') === filter) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}

function showProjectDetails(project) {
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-body').innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="assets/images/projects/${project.image}" alt="${project.title}" class="img-fluid mb-3">
        </div>
        <div class="col-md-6">
          <p><strong>Type:</strong> ${project.type}</p>
          ${project.location ? `<p><strong>Location:</strong> ${project.location}</p>` : ''}
          ${project.area ? `<p><strong>Area:</strong> ${project.area}</p>` : ''}
          ${project.completed ? `<p><strong>Completed:</strong> ${project.completed}</p>` : ''}
          <p>${project.description || ''}</p>
        </div>
      </div>
    `;
  }
}

/* Contact Page Functions */
function initContactPage() {
  // Initialize Google Map
  initMap();
  
  // Handle contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}

function initMap() {
  // This would initialize the Google Map
  const mapContainer = document.getElementById('map-container');
  if (mapContainer) {
    mapContainer.innerHTML = `
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.5211248708033!2d91.88320227595273!3d24.88020004446617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751ab46e5e322af%3A0xcb5f2c064904df03!2sInteria%20Decor!5e0!3m2!1sen!2sbd!4v1746336933032!5m2!1sen!2sbd" 
              width="100%" 
              height="450" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"></iframe>
    `;
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: e.target.querySelector('[name="name"]').value,
    email: e.target.querySelector('[name="email"]').value,
    phone: e.target.querySelector('[name="phone"]').value,
    message: e.target.querySelector('[name="message"]').value
  };
  
  // In a real implementation, this would send to a server
  console.log('Contact form submitted:', formData);
  
  // Show success message
  alert('Thank you for your message! We will contact you soon.');
  e.target.reset();
}

// In your main.js or projects page script
document.addEventListener('DOMContentLoaded', function() {
  // Project data (would normally come from an API)
  const projects = [
    {
      id: 1,
      title: "Modern Villa",
      category: "Residential",
      images: ["modern-villa.jpg", "modern-villa-2.jpg"],
      description: "This contemporary villa features open spaces and modern furnishings...",
      details: {
        "Location": "Sylhet",
        "Area": "2500 sq ft",
        "Completed": "March 2023"
      }
    }
    // Add other projects
  ];

  // Initialize modal
  const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
  
  // Handle project card clicks
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function() {
      const projectId = this.getAttribute('data-id');
      const project = projects.find(p => p.id == projectId);
      
      if (project) {
        document.getElementById('projectModalTitle').textContent = project.title;
        
        const modalBody = document.getElementById('projectModalBody');
        modalBody.innerHTML = `
          <div class="row">
            <div class="col-md-6">
              <div class="project-gallery">
                ${project.images.map(img => `
                  <img src="assets/images/projects/${img}" alt="${project.title}" class="img-fluid mb-3">
                `).join('')}
              </div>
            </div>
            <div class="col-md-6">
              <h4>Project Details</h4>
              <ul class="project-details">
                ${Object.entries(project.details).map(([key, value]) => `
                  <li><strong>${key}:</strong> ${value}</li>
                `).join('')}
              </ul>
              <p>${project.description}</p>
              <a href="contact.html" class="btn btn-primary">Start Your Project</a>
            </div>
          </div>
        `;
        
        projectModal.show();
      }
    });
  });
});

// Load and display projects
async function loadProjects() {
  try {
    const response = await fetch('assets/data/projects.json');
    const projects = await response.json();
    
    const container = document.querySelector('.projects-grid');
    if (container) {
      container.innerHTML = projects.map(project => `
        <div class="project-card ${project.type.toLowerCase()}" data-id="${project.id}">
          <img src="assets/images/projects/${project.image}" alt="${project.title}">
          <div class="project-overlay">
            <div class="project-info">
              <h3>${project.title}</h3>
              <p>${project.type} | ${project.area}</p>
              <button class="btn btn-outline-light btn-sm view-details" 
                      data-id="${project.id}">View Details</button>
            </div>
          </div>
        </div>
      `).join('');
      
      // Add click handlers
      document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const projectId = this.getAttribute('data-id');
          window.location.href = `project-details.html?id=${projectId}`;
        });
      });
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.projects-grid')) {
    loadProjects();
  }
});