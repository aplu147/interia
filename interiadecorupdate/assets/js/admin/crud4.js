// CRUD Operations for Admin Panel
class CRUD {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.data = [];
  }

  async load() {
    try {
      const response = await authFetch(`../assets/data/${this.endpoint}.json`);
      if (!response) return;
      
      this.data = await response.json();
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
      // In a real app, this would be an API call
      newItem.id = this.data.length > 0 ? Math.max(...this.data.map(i => i.id)) + 1 : 1;
      this.data.push(newItem);
      await this.save();
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  }

  async update(id, updatedItem) {
    try {
      const index = this.data.findIndex(item => item.id == id);
      if (index === -1) return null;
      
      this.data[index] = { ...this.data[index], ...updatedItem };
      await this.save();
      return this.data[index];
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async delete(id) {
    try {
      const index = this.data.findIndex(item => item.id == id);
      if (index === -1) return false;
      
      this.data.splice(index, 1);
      await this.save();
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }

  async save() {
    try {
      // In a real app, this would be an API call
      console.log('Simulating save to:', this.endpoint);
      console.log('Data:', this.data);
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }
}

// Initialize CRUD instances for different data types
const postsCRUD = new CRUD('home-content');
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
      formData[input.name] = input.files[0];
    } else if (input.type === 'checkbox' || input.type === 'radio') {
      if (input.checked) {
        formData[input.name] = input.value;
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
    
    // Initialize DataTable (you would include DataTables library)
    console.log(`Initializing CRUD table for ${endpoint}`);
  });
}