'strict';

let colorIndex = 0;
let colors = ['dark','light','gold','offwhite','tan','blue','coral','grey','red','olive','desert',]

let items = {
  rope: {
    name: 'Rope',
    desc: 'Used to rope things'
  }
}

let level = function () {
  console.log(levelData)
  let dimensions = {x: 9, y: 9};
  let floorIndex = 0;
  let floor = levelData[floorIndex];
  console.log('floor', floor);
  let defaultLevel = floor;
  console.log('default', defaultLevel)

  let map = defaultLevel.map;

  let container = document.getElementById('game');

  function setDefault() {
    renderLevel(defaultLevel.map);
  }

  function renderLevel() {
    let stringified = '';
    for (let y = 0; y < map.length; y++) {
      if (y !== 0) { stringified += '\n' }
      for (let x = 0; x < map[y].length; x++) {
        let cell = map[y][x];
        stringified += cell;
      }
    }

    container.textContent = stringified;
  }

  function getPosition({x, y}) {
    return map[y][x];
  }

  function setMapCell(x, y, char) {
    map[y][x] = char;
    renderLevel();
  }

  function findItem(char) {
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === char) {
          console.log('found', char, 'at', x, y);
          return {x: x, y: y};
        }
      }
    }
  }

  function moveFloor(amount) {
    floorIndex += amount;
    if (!levelData[floorIndex]) {
      console.error('floor not found!', floorIndex, levelData[floor], levelData);
      return;
    }
    floor = levelData[floorIndex];
    map = floor.map;
    renderLevel();
    character.setPosition(findItem('@'));
  }

  function dialogue() {
    return floor.dialogue;
  }

  function getFloor() {
    return floor;
  }

  return {
    floor: getFloor,
    setDefault,
    map,
    getPosition,
    dimensions,
    setMapCell,
    moveFloor,
    dialogue
  }

}();

window.addEventListener('load', start);
function start() {
  console.log('start game');
  level.setDefault();
  character.displayStatus();
}

window.addEventListener('keydown', keyAction);
function keyAction(e) {
  // console.log(e);
  switch (e.keyCode) {
    case 72: // H
    case 65: // A
    case 37: // ←
      character.move({x: -1});
      break;
    case 74: // J
    case 83: // S
    case 40: // ↓
      character.move({y: 1});
      break;
    case 75: // K
    case 87: // W
    case 38: // ↑
      character.move({y: -1});
      break;
    case 76: // L
    case 68: // D
    case 39: // →
      character.move({x: 1});
      break;

    case 67: // C
      document.body.classList.remove(colors[colorIndex]);
      colorIndex++;
      if (colorIndex >= colors.length) { colorIndex = 0; }
      document.body.classList.add(colors[colorIndex]);
      break;


  }
}

let character = function () {

  let position = {x: 1, y: 1};
  let inventory = [];

  let statusElem = document.getElementById('status');
  let status = [
    'HP:10',
    'MP:05',
    'LV:01',
  ]

  function move ({x, y}) {
    if (!x) { x = 0; }
    if (!y) { y = 0; }
    x = x + position.x;
    y = y + position.y;
    // console.log('moving to', x, y);
    switch (level.getPosition({x, y})) {
      case ' ':
        // move to an empty space
        dialogue.reset();
        level.setMapCell(position.x, position.y, ' ');
        level.setMapCell(x, y, '@');
        position = {x, y};
        break;
      case '/':
        // move up a floor
        dialogue.reset();
        level.moveFloor(1);
        break;
      case '\\':
        // move down a floor
        dialogue.reset();
        level.moveFloor(-1);
        break;
      case '*':
        // interact with thing
        dialogue.display(level.dialogue());
        break;
      case '%':
        // pick up item
        let item;
        let levelItems = level.floor().items;
        if (levelItems) {
          item = levelItems[getRandomInt(levelItems.length)];
        } else {
          item = items[getRandomInt(items.length)].name;
        }
        character.addItemToInventory(item);
        break;
      default:
        break;
    }
  }

  function setPosition({x, y}) {
    position = {x: x, y: y};
  }

  function displayStatus() {
    let string = '';
    for (var i = 0; i < status.length; i++) {
      string += status[i] + '\n';
    }
    statusElem.textContent = string;
  }

  function addItemToInventory(item) {
    console.log('adding', item)
    if (!item) { return; }
    inventory.push(Object.assign({}, items[item]));
    console.log(inventory);
    dialogue.display('picked up ' + items[item].name);
  }

  return {
    move,
    setPosition,
    displayStatus,
    addItemToInventory,

    status,
  }
}();

let dialogue = function () {
  let outputElem = document.getElementById('output');
  let outputIndex = 0;

  function display(text) {
    outputElem.textContent = text;
  }

  function reset() {
    outputElem.textContent = '';
  }

  return {
    display,
    reset
  }
}();



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}