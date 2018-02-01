var todo = [];
var done = [];
var todoTemplate = document.querySelector("#todo-template").innerHTML;
var doneTemplate = document.querySelector("#done-template").innerHTML;

var page = {
	todo: document.querySelector('#todo-ol'),
	done: document.querySelector('#done-ul'),
	input: document.querySelector('#input'),
	add: document.querySelector('#add') 
};

var handle = {

	pressEnter: function (keypress, callback) {
		return function(keypress) {
			if(keypress.which === 13) {
				callback.call(this);
			}
		}
	},

	add: function () {
		var task = input.value;
		if(task) {
			todo.push(task);
			view.render();
		}
	},

	edit: function () {
		var task = this.parentElement;
		var edit = task.querySelector('.edit');
		task.classList.add('editing');
		edit.addEventListener('blur', handle.update);
		edit.addEventListener('keypress', handle.pressEnter(event, handle.update));
		edit.focus();
		edit.setSelectionRange(0, edit.value.length);
	},

	update: function () {
		var task = this.parentElement;
		var index = task.getAttribute('data-index');
		todo[index] = this.value;
		task.classList.remove('edit');
		view.render();
	},

	complete: function () {
		var task = this.parentElement.getAttribute('data-index');
		done.push(todo[task]);
		todo.splice(task, 1);
		view.render();
	},

	undo: function () {
		var task = this.parentElement.getAttribute('data-index');
		todo.splice(0, 0, done[task]);
		done.splice(task, 1);
		view.render();
	},

	remove: function () {
		var task = this.parentElement.getAttribute('data-index');
		if(task) {
			todo.splice(task, 1);
			view.render();
		}
	},

	clear: function() {
		done = [];
		view.render();
	}

};

var view = {

	listen: function () {
		var list = page.todo.querySelectorAll('.task-name');
		var completeButtons = page.todo.querySelectorAll('.complete');
		var deleteButtons = page.todo.querySelectorAll('.delete');
		var undoButtons = page.done.querySelectorAll('.undo');

		list.forEach(function(item) {item.addEventListener('click', handle.edit)});
		completeButtons.forEach(function(button) {button.addEventListener('click', handle.complete)})
		deleteButtons.forEach(function(button) {button.addEventListener('click', handle.remove)});
		undoButtons.forEach(function(button) {button.addEventListener('click', handle.undo)});
	},

	render: function () {
		var todoHTML = '';
		var doneHTML = '';

		if(todo.length > 0) {
			todo.forEach(function(task, index) {
				todoHTML += todoTemplate.replace(/{{task-name}}/g, task).replace(/{{index}}/, index);
			});
			page.todo.innerHTML = todoHTML;
		} else {
			page.todo.innerHTML = '';
		}

		if(done.length > 0) {
			page.done.classList.remove('no-tasks-yet');
			doneHTML += '<li><strong>done:</strong><button id="clear">clear</button></li>';
			done.forEach(function(task, index) {
				doneHTML += doneTemplate.replace(/{{task-name}}/g, task).replace(/{{index}}/, index);
			});
			page.done.innerHTML = doneHTML;
			var clear = page.done.querySelector("#clear");
			clear.addEventListener('click', handle.clear);
		} else {
			page.done.innerHTML = '';
			page.done.classList.add('no-tasks-yet');
		}
		page.input.value = '';
		this.listen();
	}

};

view.render();
page.input.addEventListener('keypress', handle.pressEnter(event, handle.add));
page.add.addEventListener('click', handle.add);

