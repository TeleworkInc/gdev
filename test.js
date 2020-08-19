/**
 * @typedef {string}
 */
let AnimalName;

/**
 * @enum {string}
 */
const AnimalSize = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * @typedef {{
 *  name: AnimalName,
 *  size: AnimalSize,
 * }} Animal
 * An animal type.
 */
let Animal;

// type AnimalName string;
// enum AnimalSize {
//   SMALL: 'small',
//   MEDIUM: 'medium',
//   LARGE: 'large'
// };
// type Animal {
//   AnimalName name: The name of this animal,
//   AnimalSize size: The size of this animal
// };

// const Animal myCat = new Cat();

/**
 * @type {Animal}
 */
const myCat = {
  name: 'Mittens',
  size: AnimalSize.MEDIUM,
};

console.log(myCat);
