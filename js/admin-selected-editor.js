/**
 * Admin Selected Work Editor
 * Selected Work 편집 기능
 */
(() => {
  const API_URL = CONFIG.API_URL;

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
  const selectedWorkForm = document.getElementById('selectedWorkForm');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');
  const btnText = saveBtn.querySelector('.btn-text');
  const btnLoading = saveBtn.querySelector('.btn-loading');

  // Form elements
  const titleInput = document.getElementById('title');
  const displayTitleInput = document.getElementById('displayTitle');
  const slugInput = document.getElementById('slug');
  const categoryInput = document.getElementById('category');
  const yearInput = document.getElementById('year');
  const toolsInput = document.getElementById('tools');
  const prevSlugInput = document.getElementById('prevSlug');
  const prevTitleInput = document.getElementById('prevTitle');
  const nextSlugInput = document.getElementById('nextSlug');
  const nextTitleInput = document.getElementById('nextTitle');
  const orderInput = document.getElementById('order');
  const publishedCheckbox = document.getElementById('published');

  // Image upload elements
  const thumbnailPreview = document.getElementById('thumbnailPreview');
  const thumbnailInput = document.getElementById('thumbnailInput');
  const thumbnailBtn = document.getElementById('thumbnailBtn');
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryAddBtn = document.getElementById('galleryAddBtn');
  const galleryInput = document.getElementById('galleryInput');

  // State
  let editingWorkId = null;
  let thumbnailData = null;
  let galleryImages = []; // Array of { url, publicId, caption, order } or File
  let overviewEditor = null;
  let detailEditor = null;

  // Initialize Quill editors
  overviewEditor = new Quill('#overviewEditor', {
    theme: 'snow',
    placeholder: 'Write project overview...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link'],
        ['clean']
      ]
    }
  });

  detailEditor = new Quill('#detailEditor', {
    theme: 'snow',
    placeholder: 'Write project detail...',
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

  // Check if editing existing work
  const urlParams = new URLSearchParams(window.location.search);
  editingWorkId = urlParams.get('id');

  if (editingWorkId) {
    pageTitle.textContent = 'Edit Selected Work';
    deleteBtn.style.display = 'inline-block';
    loadSelectedWork(editingWorkId);
  }

  // Auto-generate slug from title
  titleInput.addEventListener('input', () => {
    if (!editingWorkId && !slugInput.value) {
      slugInput.value = titleInput.value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]+/g, '_')
        .replace(/^_+|_+$/g, '');
    }
  });

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

  // Load existing selected work for editing
  async function loadSelectedWork(id) {
    try {
      const response = await apiRequest(`/selected-works/admin/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load selected work');
      }

      const work = data.data;

      // Fill form
      titleInput.value = work.title || '';
      displayTitleInput.value = work.displayTitle || '';
      slugInput.value = work.slug || '';
      categoryInput.value = work.category || '';
      yearInput.value = work.year || '';
      toolsInput.value = work.tools || '';
      orderInput.value = work.order || 0;
      publishedCheckbox.checked = work.published !== false;

      // Navigation
      if (work.navigation) {
        prevSlugInput.value = work.navigation.prev?.slug || '';
        prevTitleInput.value = work.navigation.prev?.title || '';
        nextSlugInput.value = work.navigation.next?.slug || '';
        nextTitleInput.value = work.navigation.next?.title || '';
      }

      // Set editors
      if (work.overview) {
        overviewEditor.root.innerHTML = work.overview;
      }
      if (work.detail) {
        detailEditor.root.innerHTML = work.detail;
      }

      // Set thumbnail
      if (work.thumbnail && work.thumbnail.url) {
        thumbnailData = work.thumbnail;
        showThumbnailPreview(work.thumbnail.url);
      }

      // Set gallery images
      if (work.gallery && work.gallery.length > 0) {
        galleryImages = work.gallery;
        renderGalleryGrid();
      }

    } catch (error) {
      console.error('Load selected work error:', error);
      alert('Failed to load selected work: ' + error.message);
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
      galleryImages.push({
        file: file,
        caption: '',
        order: galleryImages.length
      });
    });

    renderGalleryGrid();
    galleryInput.value = '';
  });

  function renderGalleryGrid() {
    // Clear existing items except add button
    const existingItems = galleryGrid.querySelectorAll('.gallery-item');
    existingItems.forEach(item => item.remove());

    // Add items before the add button
    galleryImages.forEach((img, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.draggable = true;
      item.dataset.index = index;

      let src = '';
      if (img.file instanceof File) {
        src = URL.createObjectURL(img.file);
      } else if (img.url) {
        src = img.url;
      }

      item.innerHTML = `
        <img src="${src}" alt="Gallery image ${index + 1}">
        <button type="button" class="gallery-remove" data-index="${index}">&times;</button>
        <div class="gallery-caption">
          <input type="text" placeholder="Caption" value="${img.caption || ''}" data-index="${index}" class="caption-input">
        </div>
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

    // Add caption input handlers
    galleryGrid.querySelectorAll('.caption-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        galleryImages[index].caption = e.target.value;
      });
    });

    // Add drag and drop handlers
    setupDragAndDrop();
  }

  function setupDragAndDrop() {
    const items = galleryGrid.querySelectorAll('.gallery-item');

    items.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', item.dataset.index);
        item.classList.add('dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        item.classList.add('drag-over');
      });

      item.addEventListener('dragleave', () => {
        item.classList.remove('drag-over');
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        item.classList.remove('drag-over');

        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(item.dataset.index);

        if (fromIndex !== toIndex) {
          const [movedItem] = galleryImages.splice(fromIndex, 1);
          galleryImages.splice(toIndex, 0, movedItem);
          renderGalleryGrid();
        }
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

  // Delete selected work
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this selected work?')) {
        return;
      }

      try {
        const response = await apiRequest(`/selected-works/${editingWorkId}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete selected work');
        }

        alert('Selected work deleted successfully!');
        window.location.href = './selected-dashboard.html';

      } catch (error) {
        console.error('Delete selected work error:', error);
        alert('Failed to delete: ' + error.message);
      }
    });
  }

  // Form submit
  selectedWorkForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    if (!titleInput.value.trim()) {
      alert('Please enter a title');
      titleInput.focus();
      return;
    }

    if (!slugInput.value.trim()) {
      alert('Please enter a slug');
      slugInput.focus();
      return;
    }

    if (!categoryInput.value.trim()) {
      alert('Please enter a category');
      categoryInput.focus();
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
      for (let i = 0; i < galleryImages.length; i++) {
        const img = galleryImages[i];
        if (img.file instanceof File) {
          const result = await uploadImage(img.file);
          uploadedGallery.push({
            url: result.url,
            publicId: result.publicId,
            caption: img.caption || '',
            order: i
          });
        } else {
          uploadedGallery.push({
            url: img.url,
            publicId: img.publicId || '',
            caption: img.caption || '',
            order: i
          });
        }
      }

      // Prepare selected work data
      const workData = {
        title: titleInput.value.trim(),
        displayTitle: displayTitleInput.value.trim() || titleInput.value.trim().toUpperCase(),
        slug: slugInput.value.trim().toLowerCase(),
        category: categoryInput.value.trim(),
        year: yearInput.value.trim(),
        tools: toolsInput.value.trim(),
        overview: overviewEditor.root.innerHTML,
        detail: detailEditor.root.innerHTML,
        thumbnail: thumbnailResult,
        gallery: uploadedGallery,
        navigation: {
          prev: {
            slug: prevSlugInput.value.trim(),
            title: prevTitleInput.value.trim()
          },
          next: {
            slug: nextSlugInput.value.trim(),
            title: nextTitleInput.value.trim()
          }
        },
        order: parseInt(orderInput.value) || 0,
        published: publishedCheckbox.checked
      };

      // Save selected work
      let response;
      if (editingWorkId) {
        // Update existing
        response = await apiRequest(`/selected-works/${editingWorkId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workData)
        });
      } else {
        // Create new
        response = await apiRequest('/selected-works', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(workData)
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save selected work');
      }

      alert(editingWorkId ? 'Selected work updated successfully!' : 'Selected work created successfully!');
      window.location.href = './selected-dashboard.html';

    } catch (error) {
      console.error('Save selected work error:', error);
      alert('Failed to save: ' + error.message);
      setLoading(false);
    }
  });

  function setLoading(loading) {
    saveBtn.disabled = loading;
    btnText.style.display = loading ? 'none' : 'inline';
    btnLoading.style.display = loading ? 'inline' : 'none';
  }

})();
