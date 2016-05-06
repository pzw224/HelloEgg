function son(name,sex,age){
	this.name=name;
	this.sex=sex;
	this.age=age;
}
son.prototype.extend(Person.prototype);