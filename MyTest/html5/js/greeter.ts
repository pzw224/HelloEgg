class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
	}
}

interface Person {
    firstName: string;
    lastName: string;
	fullName:string;
}

function greeter(person : Person) {
    return "Hello, " +person.fullName;
}

var user = new Student("Jane", "M.", "User");

document.getElementById("sp_typeDom").innerHTML = greeter(user);