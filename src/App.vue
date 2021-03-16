<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-10">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">My Todo List</h5>
            <AddTodo @add-todo="addTodo" />
            <hr />
            <!-- move to component -->
            <div class="loader text-center" v-if="loading">
              <div class="spinner-border text-secondary" role="status"></div>
            </div>

            <!-- move to component -->
            <div class="alert alert-danger alert-dismissible show" role="alert" v-if="errorMessage !== ''">
              <strong>Oops!</strong> {{ errorMessage }}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div class="list-todo-items">
              <ul  class="list-group">
                <TodoListItem
                  v-for="todo in todos" 
                  :key="todo.id" 
                  v-bind:todoItem="todo" 
                  @remove-todo="removeTodo"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddTodo from './components/AddTodo';
import TodoListItem from './components/TodoListItem';

export default {
  name: 'App',
  data() {
    return {
      todos: [],
      loading: true,
      errorMessage: '',
    }
  },
  components: {
    AddTodo,
    TodoListItem,
  },
  async mounted() {
    try {
      const result = await this.$http.get(`/todos`);
      this.todos = result.data.resources;
    } catch (error) {
      this.errorMessage = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    removeTodo(id) {
      console.log(`Removing todo ${id}`);
      this.todos = this.todos.filter(todo => todo.id !== id);
    },
    addTodo(todo) {
      console.log(`Adding todo ${todo.id}`);
      console.log(todo);
      this.todos.push(todo);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.add-button {
  margin-left: 0.5rem;
}

.strike {
  text-decoration: line-through;
}
</style>
