(() => {
  const API_URL = 'http://localhost:5000/api';

  // Auth check
  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  if (!token) {
    window.location.href = './login.html';
    return;
  }

  // Elements
  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const pageTitle = document.getElementById('pageTitle');
  const projectForm = document.getElementById('projectForm');
  const saveBtn = document.getElementById('saveBtn');
  const btnText = saveBtn.querySelector('.btn-text');
  const btnLoading = saveBtn.querySelector('.btn-loading');

  // Form elements
  const titleInput = document.getElementById('title');
  const categorySelect = document.getElementById('category');
  const yearInput = document.getElementById('year');
  const isFeaturedCheckbox = document.getElementById('isFeatured');
  const isPublishedCheckbox = document.getElementById('isPublished');

  // Image upload elements
  const thumbnailPreview = document.getElementById('thumbnailPreview');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const thumbnailBtn = document.getElementById('thumbnailBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryAddBtn = document.getElementById('galleryAddBtn');
  const galleryInput = document.getElementById('galleryInput');

  // State
  let editingProjectId = null;
  let thumbnailData = null; // { url, publicId } or File
  let galleryImages = []; // Array of { url, publicId } or File
  let quillEditor = null;

  // Initialize Quill editor
  quillEditor = new Quill('#quillEditor', {
    theme: 'snow',
    placeholder: 'Write project description...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  // User info
  if (userEmail && userData.email) {
    userEmail.textContent = userData.email;
  }

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = './login.html';
    });
  }

  // Check if editing existing project
  const urlParams = new URLSearchParams(window.location.search);
  editingProjectId = urlParams.get('id');

  if (editingProjectId) {
    pageTitle.textContent = 'Edit Project';
    loadProject(editingProjectId);
  }

  // API helper
  async function apiRequest(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = './login.html';
      throw new Error('Unauthorized');
    }

    return response;
  }

  // Load existing project for editing
  async function loadProject(id) {
    try {
      const response = await apiRequest(`/projects/admin/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load project');
      }

      const project = data.data;

      // Fill form
      titleInput.value = project.title || '';
      categorySelect.value = project.category || '';
      yearInput.value = project.year || '';
      isFeaturedCheckbox.checked = project.isFeatured || false;
      isPublishedCheckbox.checked = project.isPublished !== false;

      // Set description
      if (project.description) {
        quillEditor.root.innerHTML = project.description;
      }

      // Set thumbnail
      if (project.thumbnail && project.thumbnail.url) {
        thumbnailData = project.thumbnail;
        showThumbnailPreview(project.thumbnail.url);
      }

      // Set gallery images
      if (project.images && project.images.length > 0) {
        galleryImages = project.images;
        renderGalleryGrid();
      }

    } catch (error) {
      console.error('Load project error:', error);
      alert('Failed to load project: ' + error.message);
    }
  }

  // Thumbnail upload
  thumbnailBtn.addEventListener('click', () => thumbnailInput.click());
  thumbnailPreview.addEventListener('click', () => thumbnailInput.click());

  thumbnailInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    thumbnailData = file;
    const reader = new FileReader();
    reader.onload = (e) => showThumbnailPreview(e.target.result);
    reader.readAsDataURL(file);
  });

  function showThumbnailPreview(src) {
    thumbnailPreview.innerHTML = `<img src="${src}" alt="Thumbnail preview">`;
    thumbnailPreview.classList.add('has-image');
  }

  // Gallery upload
  galleryAddBtn.addEventListener('click', () => galleryInput.click());

  galleryInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      galleryImages.push(file);
    });

    renderGalleryGrid();
    galleryInput.value = ''; // Reset input
  });

  function renderGalleryGrid() {
    // Clear existing items except add button
    const existingItems = galleryGrid.querySelectorAll('.gallery-item');
    existingItems.forEach(item => item.remove());

    // Add items before the add button
    galleryImages.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      let src = '';
      if (img instanceof File) {
        src = URL.createObjectURL(img);
      } else if (img.url) {
        src = img.url;
      }

      item.innerHTML = `
        <img src="${src}" alt="Gallery image ${index + 1}">
        <button type="button" class="gallery-remove" data-index="${index}">&times;</button>
      `;

      galleryGrid.insertBefore(item, galleryAddBtn);
    });

    // Add remove handlers
    galleryGrid.querySelectorAll('.gallery-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        galleryImages.splice(index, 1);
        renderGalleryGrid();
      });
    });
  }

  // Upload image to server
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiRequest('/upload/image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload image');
    }

    return data.data; // { url, publicId }
  }

  // Form submit
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    if (!titleInput.value.trim()) {
      alert('Please enter a project title');
      titleInput.focus();
      return;
    }

    if (!categorySelect.value) {
      alert('Please select a category');
      categorySelect.focus();
      return;
    }

    if (!yearInput.value.trim()) {
      alert('Please enter a year');
      yearInput.focus();
      return;
    }

    if (!thumbnailData) {
      alert('Please upload a thumbnail image');
      return;
    }

    setLoading(true);

    try {
      // Upload thumbnail if it's a File
      let thumbnailResult = thumbnailData;
      if (thumbnailData instanceof File) {
        thumbnailResult = await uploadImage(thumbnailData);
      }

      // Upload gallery images that are Files
      const uploadedGallery = [];
      for (const img of galleryImages) {
        if (img instanceof File) {
          const result = await uploadImage(img);
          uploadedGallery.push(result);
        } else {
          uploadedGallery.push(img);
        }
      }

      // Prepare project data
      const projectData = {
        title: titleInput.value.trim(),
        category: categorySelect.value,
        year: yearInput.value.trim(),
        thumbnail: thumbnailResult,
        images: uploadedGallery,
        description: quillEditor.root.innerHTML,
        isFeatured: isFeaturedCheckbox.checked,
        isPublished: isPublishedCheckbox.checked
      };

      // Save project
      let response;
      if (editingProjectId) {
        // Update existing
        response = await apiRequest(`/projects/${editingProjectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      } else {
        // Create new
        response = await apiRequest('/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save project');
      }

      alert(editingProjectId ? 'Project updated successfully!' : 'Project created successfully!');
      window.location.href = './dashboard.html';

    } catch (error) {
      console.error('Save project error:', error);
      alert('Failed to save project: ' + error.message);
      setLoading(false);
    }
  });

  function setLoading(loading) {
    saveBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'inline' : 'none';
  }

})();
