<template>
  <div class="add-todo-item d-flex">
    <input
      type="text"
      class="form-control"
      placeholder="Do not forget this!"
      v-model="addTodoInput"
      maxlength="120"
      :disabled="saving"
      @keyup.enter="postTodo"
    />
    <button v-if="!saving" @click="postTodo" :disabled="isDisabled" class="btn btn-sm btn-primary add-button">
      <i class="bi-calendar-plus"></i>
    </button>
    <button v-else class="btn btn-sm btn-secundary" disabled>
      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script>
import { todoPostSchema } from "../helpers/validation-schemas/todo-post-schema";

export default {
  name: 'AddTodo',
  data() {
    return {
      addTodoInput: '',
      saving: false
    }
  },
  emits: ['add-todo'],
  methods: {
    async postTodo() {
      this.saving = true;
      let result;
      try {
        result = await this.$http.post(`/todos`, {
          description: this.addTodoInput
        });
      } catch (error) {
        // handle error
      } finally {
        // for interaction purposes, show spinner a little but longer.
        setTimeout(() => {
          this.addTodoInput = '';
          if (result) {
            this.$emit('add-todo', result.data);
          }
          this.saving = false;
        }, 500)
      }
    }
  },
  computed: {
    isDisabled() {
      const result = todoPostSchema.validate({
        description: this.addTodoInput,
      });
      return !!result.error;
    }
  }
}
</script>
