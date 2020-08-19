/**
 * @typedef {{
 *  name: string,
 *  size: string,
 * }} Animal
 * An animal type.
 */
let Animal;

// const cat {Animal: my favorite} = new Cat();

/**
 * @type {Animal}
 */
const myCat = {
  name: 'Mittens',
  size: 4,
};

console.log(myCat);
