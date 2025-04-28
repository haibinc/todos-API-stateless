
document.getElementById('displayTodos').addEventListener('click', async () => {
  const response = await fetch('/todos');
  const todos = await response.json();
  document.getElementById('todoDisplay').textContent = JSON.stringify(todos, null, 2);
});

document.getElementById('submitTodo').addEventListener('click', async () => {
  const nameInput = document.getElementById('todoName');
  const priorityInput = document.getElementById('todoPriority');
  const isFunInput = document.getElementById('todoIsFun');

  const name = nameInput.value;
  const priority = priorityInput.value || 'low';
  const isFun = isFunInput.value || 'true';

  const todo = { name, priority, isFun };

  const response = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });

  const result = await response.json();
  alert(`Todo added: ${JSON.stringify(result)}`);

  nameInput.value = '';
  priorityInput.value = '';
  isFunInput.value = '';
});


document.getElementById('deleteTodo').addEventListener('click', async () => {
  const id = document.getElementById('todoIdToDelete').value;
  const response = await fetch(`/todos/${id}`, { method: 'DELETE' });
  const result = await response.json();
  alert(result.message);
});