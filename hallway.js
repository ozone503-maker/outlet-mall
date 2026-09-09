// Mall hallway navigation
const units = [
  {id:'arcade', name:'The Arcade', path:'/units/arcade/'},
  {id:'fruity-puppy-skincare', name:'Fruity Puppy Skincare', path:'/units/fruity-puppy-skincare/'},
  {id:'fish-store', name:'Wet Pets', path:'/units/fish-store/'},
  {id:'burger-shack', name:'Burger Shack', path:'/units/burger-shack/'},
  {id:'fitting-room', name:'The Rack', path:'/units/fitting-room/'},
  {id:'restaurant', name:'Italian Restaurant', path:'/units/restaurant/'},
  {id:'comic-shop', name:'Bad Habitats + Good Habits', path:'/units/comic-shop/'},
  {id:'fruity-puppy-merch', name:'Fruity Puppy Merch', path:'/units/fruity-puppy-merch/'},
  {id:'brobots-retail', name:'BroBots Space Factory', path:'/units/brobots-retail/'},
  {id:'brobots-multimedia', name:'BroBots Multimedia Studios', path:'/units/brobots-multimedia/'},
  {id:'thorny-toad', name:'Thorny Toad Toner Warehouse', path:'/units/thorny-toad/'},
  {id:'lava-guava', name:'LavaGuava Bomb Balm', path:'/units/lava-guava/'},
  {id:'fpx-boutique', name:'FPX Boutique', path:'/units/fpx-boutique/'},
  {id:'seven-eleven', name:'7-Eleven', path:'/units/seven-eleven/'},
  {id:'dairy-queen', name:'Dairy Queen', path:'/units/dairy-queen/'},
  {id:'museum', name:'Museum', path:'/units/museum/'},
  {id:'theater', name:'Theater', path:'/units/theater/'},
  {id:'shoe-store', name:'Shoe Station', path:'/units/shoe-store/'},
  {id:'meadows', name:'Kudoken Meadows', path:'/meadows/'}
];

window.mallNav = {
  units,
  getUnit(id) {
    return units.find(u => u.id === id);
  },
  getIndex(id) {
    return units.findIndex(u => u.id === id);
  },
  getNext(id) {
    const idx = this.getIndex(id);
    return idx < units.length - 1 ? units[idx + 1] : null;
  },
  getPrev(id) {
    const idx = this.getIndex(id);
    return idx > 0 ? units[idx - 1] : null;
  }
};
