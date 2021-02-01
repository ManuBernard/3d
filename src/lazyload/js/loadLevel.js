export default function loadLevel(level) {
  import("../levels/" + level).then((module) => {
    const level = module.default;
    new level();
  });
}
