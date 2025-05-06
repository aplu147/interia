document.addEventListener('DOMContentLoaded', function() {
  if(!document.querySelector('.admin-container')) return;
  
  // Load dashboard statistics
  loadDashboardStats();
  
  // Load recent activity
  loadRecentActivity();
});

async function loadDashboardStats() {
  try {
    // In a real app, these would be API calls
    const projects = await fetch('../assets/data/projects.json').then(res => res.json());
    const testimonials = await fetch('../assets/data/testimonials.json').then(res => res.json());
    const services = await fetch('../assets/data/services.json').then(res => res.json());
    
    document.getElementById('projects-count').textContent = projects.length;
    document.getElementById('testimonials-count').textContent = testimonials.length;
    document.getElementById('services-count').textContent = services.length;
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

async function loadRecentActivity() {
  try {
    // Simulate fetching activity log
    const activityLog = [
      { action: 'Updated homepage content', timestamp: Date.now() - 3600000, user: 'admin' },
      { action: 'Added new project', timestamp: Date.now() - 86400000, user: 'admin' },
      { action: 'Deleted testimonial', timestamp: Date.now() - 172800000, user: 'admin' },
      { action: 'Changed color scheme', timestamp: Date.now() - 259200000, user: 'admin' }
    ];
    
    const container = document.getElementById('activity-log');
    container.innerHTML = activityLog.map(item => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas fa-history"></i>
        </div>
        <div class="activity-details">
          <p class="activity-action">${item.action}</p>
          <small class="activity-time">${formatTime(item.timestamp)}</small>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading activity log:', error);
  }
}

function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  
  if(diff < 60000) return 'Just now';
  if(diff < 3600000) return `${Math.floor(diff/60000)} minutes ago`;
  if(diff < 86400000) return `${Math.floor(diff/3600000)} hours ago`;
  return `${Math.floor(diff/86400000)} days ago`;
}