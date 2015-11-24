'use strict';

class Animal{
	constructor(type){
		this.type = type;
	}

	print(){
		console.log('This is an animal of type ' + this.type);
	}
}

class Dog extends Animal{
	constructor(name){
		super('dog');
		this.name = name;
	}

	print(){
		super.print();
		console.log('bark bark ' + this.name);
		console.log('type: ' + this.type);
	}
}

var animal = new Animal('moufa');
animal.print();

var dog = new Dog('hermes');
dog.print();