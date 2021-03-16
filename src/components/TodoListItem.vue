<template>
  <li class="list-group-item">
    <div class="row">
      <div class="col-md-1 col-1 align-self-center">
        <input type="checkbox" v-model="currentTodo.completed" @change="patchTodo" />
      </div>
      <div class="col-md-9 col-8">
        <span
          :class="{ strike: currentTodo.completed }" 
          @click="showEditForm" 
          v-show="!editForm" >{{ currentTodo.description }}<br></span>

        <span class="text-muted" v-if="currentTodo.completed && !editForm">
          <small>Completed at {{ formatCompletedDate }}
          </small></span>

        <input
          type="text"
          class="form-control edit-description"
          v-model="currentTodo.description"
          ref="editDescription"
          @keyup.enter="patchTodo"
          :disabled="saving"
          v-show="editForm" />
      </div>
      <div class="col-md-2 col-2 align-self-center">
        <button
          @click="deleteTodo"
          v-show="!editForm"
          class="btn btn-danger btn-sm remove-todo"><i class="bi-x-circle"></i></button>
      
        <button
          @click="patchTodo"
          v-show="editForm"
          :disabled="isDisabled"
          class="btn btn-primary btn-sm">
          <span v-if="!saving"><i class="bi-check2-circle"></i></span>
          <span v-else class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import dayjs from 'dayjs';
import { todoPostSchema } from "../helpers/validation-schemas/todo-post-schema";

export default {
  name: 'TodoListItem',
  data() {
    // props are immutable
    return {
      currentTodo: this.todoItem,
      editForm: false,
      saving: false,
      tempDescription: '',
    }
  },
  props: {
    todoItem: Object,
  },
  emits: ['remove-todo'],
  methods: {
    async deleteTodo() {
      try {
        await this.$http.delete(`/todos/${this.todoItem.id}`);
      } catch (error) {
        // handle error
      }
      
      // remove from list of all todos
      this.$emit('remove-todo', this.todoItem.id);
    },
    async patchTodo() {
      this.saving = true;
      try {
        const result = await this.$http.patch(`/todos/${this.todoItem.id}`, {
          completed: this.currentTodo.completed,
          description: this.currentTodo.description,
        });
        this.currentTodo = result.data;
      } catch (error) {
        // handle error
      } finally {
        // timeout to show interaction
        setTimeout(() => {
          this.saving = false;
          this.editForm = false;
        }, 500);
      }

    },
    showEditForm() {
      this.editForm = !this.editForm;
      // Refs are non-reactive. We need to wait for next tick for setting focus.
      this.$nextTick(() => this.$refs.editDescription.focus());
    },
  },
  computed: {
    isDisabled() {
      const result = todoPostSchema.validate({
        description: this.currentTodo.description,
      });
      return !!result.error;
    },
    formatCompletedDate() {
      let result = null;
      if (this.currentTodo.completedAt) {
        result = dayjs(this.currentTodo.completedAt).format('MM/DD/YYYY hh:mm');
      }
      return result;
    }
  }
}
</script>

<style scoped>
.list-group-item span {
  padding: 0.4rem 0 0 0.4rem; 
}

.edit-description {
  margin: 0 0.4rem 0 0.4rem;
}
</style>
