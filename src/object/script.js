class level {
  constructor() {
    this.doors = [];
  }
  addDoor(door) {
    this.doors.push(door);
  }
}

window.setInterval(() => {
  let newlevel = new level();
  newlevel.addDoor("test");
  console.log(newlevel);
}, 500);
