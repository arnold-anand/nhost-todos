import { useEffect, useState } from "react";
import { NhostProvider } from "@nhost/react";
import { nhost } from "./lib/nhost";

const getTodos = `
query {
  todos {
    id
    created_at
    name
    completed
  }
}
`;

const insertTodo = `
mutation InsertTodo($name: String!) {
  insert_todos(objects: {name: $name}) {
    returning {
      id
      name
      created_at
      completed
    }
  }
}
`;

const updateTodo = `
mutation UpdateTodo($id: uuid!, $completed: Boolean!) {
  update_todos_by_pk(pk_columns: {id: $id}, _set: {completed: $completed}) {
    id
    completed
  }
}
`;

const deleteTodo = `
mutation DeleteTodo($id: uuid!) {
  delete_todos_by_pk(id: $id) {
    id
  }
}
`;

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <Home />
    </NhostProvider>
  );
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      setLoading(true);
      const { data, error } = await nhost.graphql.request(getTodos);
      setTodos(data.todos);
      setLoading(false);
    }

    fetchTodos();
  }, []);

  const handleNewTodoChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    const variables = { name: newTodo };
    const { data, error } = await nhost.graphql.request(insertTodo, variables);
    if (data) {
      setTodos([...todos, ...data.insert_todos.returning]);
      setNewTodo("");
    }
  };

  const handleToggleTodo = async (id, completed) => {
    const variables = { id, completed: !completed };
    const { data, error } = await nhost.graphql.request(updateTodo, variables);
    if (data) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        )
      );
    }
    else{
      console.log(error)
    }
  };

  const handleDeleteTodo = async (id) => {
    const variables = { id };
    const { data, error } = await nhost.graphql.request(deleteTodo, variables);
    if (data) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
    else{
      console.log(error)
    }
  };

  return (
    <div>
      <input value={newTodo} onChange={handleNewTodoChange} />
      <button onClick={handleAddTodo}>Add Todo</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <tbody>
            {todos.map((todo, index) => (
              <tr key={index}>
                <td>{todo.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                  />
                </td>
                <td>
                  <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
