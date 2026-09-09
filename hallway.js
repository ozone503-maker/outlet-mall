// Mall hallway navigation
const units = [
  {id:'arcade', name:'The Arcade', path:'/outletmall/units/arcade/'},
  {id:'fruity-puppy-skincare', name:'Fruity Puppy Skincare', path:'/outletmall/units/fruity-puppy-skincare/'},
  {id:'fish-store', name:'Wet Pets', path:'/outletmall/units/fish-store/'},
  {id:'burger-shack', name:'Burger Shack', path:'/outletmall/units/burger-shack/'},
  {id:'fitting-room', name:'The Rack', path:'/outletmall/units/fitting-room/'},
  {id:'restaurant', name:'Italian Restaurant', path:'/outletmall/units/restaurant/'},
  {id:'comic-shop', name:'Bad Habitats + Good Habits', path:'/outletmall/units/comic-shop/'},
  {id:'fruity-puppy-merch', name:'Fruity Puppy Merch', path:'/outletmall/units/fruity-puppy-merch/'},
  {id:'brobots-retail', name:'BroBots Space Factory', path:'/outletmall/units/brobots-retail/'},
  {id:'brobots-multimedia', name:'BroBots Multimedia Studios', path:'/outletmall/units/brobots-multimedia/'},
  {id:'thorny-toad', name:'Thorny Toad Toner Warehouse', path:'/outletmall/units/thorny-toad/'},
  {id:'lava-guava', name:'LavaGuava Bomb Balm', path:'/outletmall/units/lava-guava/'},
  {id:'fpx-boutique', name:'FPX Boutique', path:'/outletmall/units/fpx-boutique/'},
  {id:'seven-eleven', name:'7-Eleven', path:'/outletmall/units/seven-eleven/'},
  {id:'dairy-queen', name:'Dairy Queen', path:'/outletmall/units/dairy-queen/'},
  {id:'museum', name:'Museum', path:'/outletmall/units/museum/'},
  {id:'theater', name:'Theater', path:'/outletmall/units/theater/'},
  {id:'shoe-store', name:'Shoe Station', path:'/outletmall/units/shoe-store/'},
  {id:'meadows', name:'Kudoken Meadows', path:'/outletmall/meadows/'}
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
