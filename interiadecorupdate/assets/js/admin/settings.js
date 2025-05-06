// Settings Management for Admin Panel
class SettingsManager {
  constructor() {
    this.settings = {};
    this.colorSettings = {
      primary: '#0C4B62',
      secondary: '#529A44',
      accent: '#E77624',
      background: '#D5EEEF',
      text: '#333333'
    };
  }

  async load() {
    try {
      const response = await authFetch('../assets/data/settings.json');
      if (!response) return;
      
      const data = await response.json();
      this.settings = data.settings || {};
      this.colorSettings = data.colors || this.colorSettings;
      return { settings: this.settings, colors: this.colorSettings };
    } catch (error) {
      console.error('Error loading settings:', error);
      return { settings: {}, colors: this.colorSettings };
    }
  }

  async saveSettings(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await this.saveToFile();
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  async saveColors(newColors) {
    try {
      this.colorSettings = { ...this.colorSettings, ...newColors };
      await this.saveToFile();
      this.applyColorScheme();
      return true;
    } catch (error) {
      console.error('Error saving colors:', error);
      return false;
    }
  }

  applyColorScheme() {
    // Apply colors to the admin panel
    const root = document.documentElement;
    Object.entries(this.colorSettings).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
    });
  }

  async saveToFile() {
    try {
      // In a real app, this would be an API call
      const data = {
        settings: this.settings,
        colors: this.colorSettings
      };
      console.log('Simulating save of settings:', data);
      return true;
    } catch (error) {
      console.error('Error saving to file:', error);
      return false;
    }
  }
}

// Initialize Settings Manager
const settingsManager = new SettingsManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
  if (!document.querySelector('.settings-page')) return;
  
  // Load settings
  await settingsManager.load();
  
  // Initialize color pickers
  initColorPickers();
  
  // Initialize form submission
  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', handleSettingsSubmit);
  }
  
  const colorForm = document.getElementById('color-form');
  if (colorForm) {
    colorForm.addEventListener('submit', handleColorSubmit);
  }
});

function initColorPickers() {
  // Initialize color picker controls
  const colorInputs = document.querySelectorAll('.color-picker');
  colorInputs.forEach(input => {
    const colorName = input.getAttribute('data-color');
    const currentColor = settingsManager.colorSettings[colorName];
    
    if (currentColor) {
      input.value = currentColor;
      input.previousElementSibling.style.backgroundColor = currentColor;
    }
    
    input.addEventListener('input', function() {
      this.previousElementSibling.style.backgroundColor = this.value;
    });
  });
}

async function handleSettingsSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const settings = Object.fromEntries(formData.entries());
  
  const success = await settingsManager.saveSettings(settings);
  if (success) {
    showAlert('Settings saved successfully!', 'success');
  } else {
    showAlert('Failed to save settings', 'error');
  }
}

async function handleColorSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const colors = Object.fromEntries(formData.entries());
  
  const success = await settingsManager.saveColors(colors);
  if (success) {
    showAlert('Color scheme updated successfully!', 'success');
  } else {
    showAlert('Failed to update color scheme', 'error');
  }
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} fixed-alert`;
  alertDiv.textContent = message;
  
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.classList.add('fade-out');
    setTimeout(() => alertDiv.remove(), 500);
  }, 3000);
}