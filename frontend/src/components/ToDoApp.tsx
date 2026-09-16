import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchToDos, createToDo, toggleToDo, deleteToDo } from '../store/todoSlice';
import type { ToDoItem } from '../types';

export const ToDoApp: React.FC = () => {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.todos);
  const { user } = useAppSelector((state) => state.auth);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  useEffect(() => {
    dispatch(fetchToDos());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(createToDo({ title }));
    setTitle('');
  };

// Group tasks by User for Admin view
const groupedToDos = items.reduce<Record<string, ToDoItem[]>>((acc, todo: any) => {
  const owner =
    todo.username ||
    'Unassigned Tasks';

  if (!acc[owner]) acc[owner] = [];
  acc[owner].push(todo);
  return acc;
}, {});

  const renderTaskList = (taskList: ToDoItem[]) => (
    <ul className="list-group list-group-flush">
      {taskList.map((todo) => (
        <li
          key={todo.id}
          className="list-group-item d-flex align-items-center justify-content-between py-3 border-bottom"
        >
          <div className="form-check d-flex align-items-center gap-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              checked={todo.isComplete}
              onChange={() => dispatch(toggleToDo(todo))}
              id={`todo-${todo.id}`}
            />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`form-check-label fs-5 mb-0 ${
                todo.isComplete ? 'text-decoration-line-through text-muted' : ''
              }`}
            >
              {todo.title}
            </label>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(deleteToDo(todo.id))}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="row justify-content-center">
      <div className="col-md-9">
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <h3 className="card-title mb-4 fw-bold">
              {isAdmin ? 'Admin Dashboard - All User Tasks' : 'My Tasks'}
            </h3>

            {/* Create Task Form */}
            <form onSubmit={handleSubmit} className="input-group mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button className="btn btn-primary px-4" type="submit">
                Add Task
              </button>
            </form>

            {loading && <div className="text-center py-3">Loading tasks...</div>}

            {/* Admin View: Grouped Cards per User | Regular View: Single Task List */}
            {!loading && isAdmin ? (
              Object.keys(groupedToDos).length > 0 ? (
                Object.entries(groupedToDos).map(([ownerName, userTasks]) => (
                  <div key={ownerName} className="card mb-4 border shadow-sm">
                    <div className="card-header bg-dark text-white fw-semibold d-flex justify-content-between align-items-center">
                      <span>Owner: {ownerName}</span>
                      <span className="badge bg-light text-dark">{userTasks.length} Tasks</span>
                    </div>
                    <div className="card-body p-2">{renderTaskList(userTasks)}</div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted py-4">No user tasks found.</p>
              )
            ) : (
              !loading &&
              (items.length > 0 ? (
                renderTaskList(items)
              ) : (
                <p className="text-center text-muted py-4">No tasks found. Add one above!</p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};