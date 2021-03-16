import { shallowMount } from '@vue/test-utils'
import TodoListItem from '@/components/TodoListItem.vue'

describe('AddTodo.vue', () => {
  it('should strike text when clicking checkbox as marked', async() => {
    const wrapper = shallowMount(TodoListItem, {
      global: {
        mocks: {
          $http: {
            patch: () => Promise.resolve(),
          }
        }
      },
      props: {
        todoItem: {
          completed: false,
          description: 'Hello world!',
          createdAt: '2021-03-15T13:36:52.257Z',
          updatedAt: '2021-03-15T13:36:52.257Z',
        }
      }
    });
    const checkbox = wrapper.find('input[type=checkbox]');
    await checkbox.trigger('click');
    const span = wrapper.find('span');
    expect(span.classes()).toContain('strike');
  });

  it('should show input field and hide span when clicking on description', async() => {
    const wrapper = shallowMount(TodoListItem, {
      props: {
        todoItem: {
          completed: false,
          description: 'Edit me',
          createdAt: '2021-03-15T13:36:52.257Z',
          updatedAt: '2021-03-15T13:36:52.257Z',
        }
      }
    });

    const span = wrapper.find('span');
    await span.trigger('click');
    const input = wrapper.find('input[type=text]');
    expect(input.element.value).toBe('Edit me');
  });
})
