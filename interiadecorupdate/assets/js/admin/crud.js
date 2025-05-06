// CRUD Operations for Admin Panel
class CRUD {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.data = [];
    this.load(); // Load data immediately
  }

  async load() {
    try {
      // Check localStorage first
      const localData = localStorage.getItem(`crud_${this.endpoint}`);
      if (localData) {
        this.data = JSON.parse(localData);
        return this.data;
      }

      // Fallback to JSON file
      const response = await authFetch(`../assets/data/${this.endpoint}.json`);
      if (!response) return [];
      
      this.data = await response.json();
      // Initialize IDs if they don't exist
      this.data = this.data.map((item, index) => {
        if (!item.id) return { ...item, id: index + 1 };
        return item;
      });
      await this.save(); // Save initialized data
      return this.data;
    } catch (error) {
      console.error(`Error loading ${this.endpoint}:`, error);
      return [];
    }
  }

  async getAll() {
    if (this.data.length === 0) {
      await this.load();
    }
    return this.data;
  }

  async getById(id) {
    await this.getAll();
    return this.data.find(item => item.id == id);
  }

  async create(newItem) {
    try {
      await this.getAll();
      // Generate new ID
      const newId = this.data.length > 0 ? Math.max(...this.data.map(i => i.id)) + 1 : 1;
      newItem.id = newId;
      this.data.push(newItem);
      await this.save();
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  }

  async update(id, updatedItem) {
    try {
      await this.getAll();
      const index = this.data.findIndex(item => item.id == id);
      if (index === -1) return null;
      
      // Preserve the ID
      updatedItem.id = id;
      this.data[index] = { ...this.data[index], ...updatedItem };
      await this.save();
      return this.data[index];
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.getAll();
      const index = this.data.findIndex(item => item.id == id);
      if (index === -1) return false;
      
      this.data.splice(index, 1);
      await this.save();
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }

  async save() {
    try {
      localStorage.setItem(`crud_${this.endpoint}`, JSON.stringify(this.data));
      console.log('Data saved:', this.endpoint, this.data);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }
}

// Initialize CRUD instances for different data types
const postsCRUD = new CRUD('posts');
const projectsCRUD = new CRUD('projects');
const testimonialsCRUD = new CRUD('testimonials');
const servicesCRUD = new CRUD('services');
const teamCRUD = new CRUD('team');

// Form handling utilities
function getFormData(formId) {
  const form = document.getElementById(formId);
  if (!form) return null;
  
  const formData = {};
  const inputs = form.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    if (input.type === 'file') {
      // Skip files for now (would need special handling)
      return;
    } else if (input.type === 'checkbox' || input.type === 'radio') {
      if (input.checked) {
        formData[input.name] = input.value || true;
      }
    } else {
      formData[input.name] = input.value;
    }
  });
  
  return formData;
}

function populateForm(formId, data) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  Object.entries(data).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (!input) return;
    
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = value;
    } else {
      input.value = value;
    }
  });
}

// Initialize CRUD operations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (!document.querySelector('.admin-container')) return;
  
  // Initialize any CRUD-related functionality
  initCRUDTables();
});

function initCRUDTables() {
  document.querySelectorAll('.crud-table').forEach(table => {
    const endpoint = table.getAttribute('data-endpoint');
    if (!endpoint) return;
    
    console.log(`Initialized CRUD table for ${endpoint}`);
  });
}

// Alert system
function showAlert(message, type) {
  // Remove any existing alerts first
  document.querySelectorAll('.fixed-alert').forEach(el => el.remove());
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} fixed-alert`;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '20px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '9999';
  alertDiv.style.minWidth = '300px';
  alertDiv.textContent = message;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.classList.add('fade-out');
    setTimeout(() => alertDiv.remove(), 500);
  }, 3000);
}