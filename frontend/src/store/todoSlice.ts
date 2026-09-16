import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import type { ToDoItem } from '../types';

interface TodoState {
  items: ToDoItem[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchToDos = createAsyncThunk<ToDoItem[]>(
  'todos/fetchToDos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/todos');
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks.');
    }
  }
);

export const createToDo = createAsyncThunk<ToDoItem, { title: string }>(
  'todos/createToDo',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/todos', payload);
      return response.data?.data || response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task.');
    }
  }
);

// Persists task toggling directly to the server
export const toggleToDo = createAsyncThunk<ToDoItem, ToDoItem>(
  'todos/toggleToDo',
  async (todo, { rejectWithValue }) => {
    try {
      const updatedStatus = !todo.isComplete;
      
      // Explicit payload matching C# DTO properties
      const payload = {
        id: todo.id,
        title: todo.title,
        isComplete: updatedStatus,
      };

      // Sends PUT request to backend endpoint
      const response = await api.put(`/todos/${todo.id}`, payload);
      const data = response.data?.data || response.data;

      return data || { ...todo, isComplete: updatedStatus };
    } catch (err: any) {
      console.error('Toggle update failed:', err);
      return rejectWithValue(err.response?.data?.message || 'Failed to persist status change.');
    }
  }
);

export const deleteToDo = createAsyncThunk<number | string, number | string>(
  'todos/deleteToDo',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/todos/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task.');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch ToDos
      .addCase(fetchToDos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchToDos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchToDos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create ToDo
      .addCase(createToDo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Toggle ToDo (Persisted)
      .addCase(toggleToDo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete ToDo
      .addCase(deleteToDo.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

export default todoSlice.reducer;