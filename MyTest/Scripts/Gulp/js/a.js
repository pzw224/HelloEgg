function Person(name,sex,age){
	this.name=name;
	this.sex=sex;
	this.age=age;
}

var baseOBJ={};
baseOBJ.extend(Person.prototype);
baseOBJ.name="Payne";
baseOBJ.sex="男";
baseOBJ.age=21;
Person.prototype=baseOBJ;