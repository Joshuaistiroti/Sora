// script.js — interactive behaviour for SØRA Friends site

// Wait until DOM has fully loaded before attaching handlers
document.addEventListener('DOMContentLoaded', () => {
  const viewButtons = document.querySelectorAll('.view-3d-btn');
  const modal = document.getElementById('viewer-modal');
  const closeBtn = modal.querySelector('.close-btn');
  const canvas = document.getElementById('viewer-canvas');
    const fallbackImg = document.getElementById('fallback-image');

  // Three.js related variables
  let scene, camera, renderer, controls, cube;
  let animationId;

  // Story text for each character. These bios are lighthearted and
  // highlight each friend's personality without revealing personal details.
  const STORY_MAP = {
    Izo: `Izo is the quiet genius of the crew. He loves coding, midnight snacks
    and believes in turning a quiet grind into loud results. Don't let his calm
    exterior fool you—there's a whirlwind of ideas behind those glasses.`,
    Niv: `The bundle of energy with wild curls. Niv lives by a simple command:
    CTRL + ALT + WTF. He keeps the group laughing with his quick wit and
    seemingly endless battery life.`,
    Deyvi: `Small in size but unstoppable in spirit. Deyvi constantly proves
    that height is just a number—he finds the biggest adventures wherever he goes
    and leaves a major impact.`,
    Rifo: `Rifo is a master of naps and sarcasm. Getting out of bed is his
    biggest victory, but when he shows up, he shows up big. Coffee is his
    best friend, sleep is his hobby.`,
    Cefi: `The flirtatious romantic of the group. Equal parts charm and
    mischief, Cefi flirts with life but always loves harder. He believes that
    a good joke and a warm smile are the best accessories.`,
  };

  /**
   * Converts an image at a relative path into a Data URI using an offscreen
   * canvas. This circumvents cross‑origin issues that arise when Three.js
   * attempts to load local files via the file:// protocol. Returns a
   * promise that resolves with the Data URI.
   *
   * @param {string} path Relative path to the image
   * @returns {Promise<string>} Promise resolving to Data URI
   */
  function toDataURI(path) {
    // Use fetch + FileReader to read local files and convert to data URI.
    return fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response.blob();
      })
      .then((blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(blob);
        });
      });
  }

  /**
   * Initializes the 3D scene, loads the image as a texture (via Data URI) and
   * renders a rotating cube.
   * @param {string} imagePath Relative path to the image used as texture.
   */
  async function initViewer(imagePath, originalPath = imagePath) {
    // Clean up any existing renderer
    if (renderer) {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      // forceContextLoss is not available in older Three.js releases; guard check
      if (typeof renderer.forceContextLoss === 'function') {
        renderer.forceContextLoss();
      }
      renderer.domElement = null;
      renderer = null;
    }
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    // Create camera
    const aspect = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 0, 3);
    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
    // Load image and convert to Data URI
    try {
      let textureSource;
      // If the provided path is already a Data URI (starts with data:), skip conversion
      if (typeof imagePath === 'string' && imagePath.startsWith('data:')) {
        textureSource = imagePath;
      } else {
        textureSource = await toDataURI(imagePath);
      }
      // Hide the fallback image when starting to load the texture
      fallbackImg.style.display = 'none';
      const loader = new THREE.TextureLoader();
      loader.load(
        textureSource,
        (texture) => {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshStandardMaterial({ map: texture });
          cube = new THREE.Mesh(geometry, material);
          scene.add(cube);
          animate();
        },
        undefined,
        (err) => {
          // If texture fails, show fallback static image
          fallbackImg.src = originalPath;
          fallbackImg.style.display = 'block';
          canvas.style.display = 'none';
        }
      );
    } catch (error) {
      // Show fallback image if conversion fails
      fallbackImg.src = originalPath;
      fallbackImg.style.display = 'block';
      canvas.style.display = 'none';
    }
    // OrbitControls for interactive rotation
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
    // Handle resizing
    window.addEventListener('resize', onWindowResize);
  }

  /**
   * Animation loop. Rotates the cube slightly on each frame.
   */
  function animate() {
    animationId = requestAnimationFrame(animate);
    if (cube) {
      cube.rotation.y += 0.01;
      cube.rotation.x += 0.005;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  /**
   * Handles resizing of the viewer when the modal window changes size.
   */
  function onWindowResize() {
    if (!renderer) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  /**
   * Opens the viewer modal and initializes the scene with the given texture.
   * @param {string} imgPath Relative path to image
   */
  function openViewer(imgPath, card) {
    // Show the modal first so that the canvas has dimensions when we initialize
    modal.classList.remove('hidden');
    // Reset displays: show fallback image until WebGL is ready
    fallbackImg.src = imgPath;
    fallbackImg.style.display = 'block';
    canvas.style.display = 'block';
    // Defer initialization slightly to ensure layout has computed sizes
    setTimeout(() => {
      // Determine the character's name from the passed card element
      const name = card ? card.getAttribute('data-name') : '';
      // Set the story text if available
      const storyArea = document.getElementById('story-area');
      if (storyArea) {
        storyArea.textContent = STORY_MAP[name] || '';
      }
      // If a Data URI mapping exists (preloaded in data_uris.js), use it for 3D texture
      const realPath = (window.DATA_URIS && window.DATA_URIS[imgPath]) ? window.DATA_URIS[imgPath] : imgPath;
      initViewer(realPath, imgPath);
    }, 50);
  }

  /**
   * Closes the viewer modal and cleans up the 3D scene to free resources.
   */
  function closeViewer() {
    modal.classList.add('hidden');
    // Dispose of three.js objects
    if (cube) {
      cube.geometry.dispose();
      if (Array.isArray(cube.material)) {
        cube.material.forEach((m) => m.dispose());
      } else {
        cube.material.dispose();
      }
      cube = null;
    }
    if (controls) controls.dispose();
    if (renderer) {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (typeof renderer.forceContextLoss === 'function') {
        renderer.forceContextLoss();
      }
      renderer.domElement = null;
      renderer = null;
    }
    window.removeEventListener('resize', onWindowResize);

    // Clear story text when closing
    const storyArea = document.getElementById('story-area');
    if (storyArea) storyArea.textContent = '';
  }

  // Attach click handlers to all view buttons
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      const imagePath = card.getAttribute('data-image');
      openViewer(imagePath, card);
    });
  });

  // Close modal when clicking the close button
  closeBtn.addEventListener('click', () => {
    closeViewer();
  });

  // Also close modal when clicking outside of the viewer content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeViewer();
    }
  });
});