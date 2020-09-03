/** @license MIT */
/**
 * This is a side effect that won't get removed due to dead code elimination.
 */
class TestClass {
  constructor() {
    this.hello = 'hello';
    this.world = 'world';
  }
}
console.log('Welcome to gnv!');
const myTest = new TestClass();
console.log(myTest.hello, myTest.world);
