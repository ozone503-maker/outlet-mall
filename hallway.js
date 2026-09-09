// Fruity Puppy Outlet Mall — data-driven hallway + navigation
(() => {
  const STORE_DATA_URL = '/data/stores.json';

  const mallNav = {
    units: [],
    ready: null,
    getUnit(id) {
      return this.units.find((u) => u.id === id) || null;
    },
    getIndex(id) {
      return this.units.findIndex((u) => u.id === id);
    },
    getNext(id) {
      const idx = this.getIndex(id);
      return idx >= 0 && idx < this.units.length - 1 ? this.units[idx + 1] : null;
    },
    getPrev(id) {
      const idx = this.getIndex(id);
      return idx > 0 ? this.units[idx - 1] : null;
    }
  };

  window.mallNav = mallNav;

  function renderStorefronts(stores) {
    const container = document.querySelector('.storefronts');
    if (!container) return;

    container.replaceChildren();

    stores.forEach((store, index) => {
      const link = document.createElement('a');
      link.className = `storefront${store.status === 'construction' ? ' under-construction' : ''}`;
      link.href = store.path;
      link.dataset.unit = store.id;
      link.dataset.index = String(index);

      const image = document.createElement('img');
      image.className = 'storefront__door';
      image.src = store.image;
      image.alt = store.name;
      image.loading = index > 2 ? 'lazy' : 'eager';
      image.decoding = 'async';

      const text = document.createElement('div');
      text.className = 'storefront__text';

      const heading = document.createElement('h2');
      heading.textContent = store.name;

      const description = document.createElement('p');
      description.textContent = store.description || '';

      text.append(heading, description);
      link.append(image, text);
      container.append(link);
    });
  }

  mallNav.ready = fetch(STORE_DATA_URL, { cache: 'no-cache' })
    .then((response) => {
      if (!response.ok) throw new Error(`Store registry failed: ${response.status}`);
      return response.json();
    })
    .then((stores) => {
      mallNav.units = stores;
      renderStorefronts(stores);
      window.dispatchEvent(new CustomEvent('mall:stores-ready', { detail: stores }));
      return stores;
    })
    .catch((error) => {
      console.error('[OutletMall] Could not load store registry.', error);
      const container = document.querySelector('.storefronts');
      if (container && !container.children.length) {
        container.innerHTML = '<p role="alert">The mall directory could not load. Please refresh.</p>';
      }
      return [];
    });
})();
