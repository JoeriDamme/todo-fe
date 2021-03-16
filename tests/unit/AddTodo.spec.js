import { shallowMount } from '@vue/test-utils'
import AddTodo from '@/components/AddTodo.vue'

describe('AddTodo.vue', () => {
  it('should enable add button if text is in input field', async() => {
    const wrapper = shallowMount(AddTodo, {
      global: {
        $http: {
          patch: () => 'bar'
        }
      }
    });
    const input = wrapper.find('input');
    input.setValue('x');
    await input.trigger('change');
    expect(wrapper.find('button').element.disabled).toBe(false);
  });
})
