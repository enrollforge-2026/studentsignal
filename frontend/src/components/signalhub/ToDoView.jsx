import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Circle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'sonner';
import DatePicker from '../forms/DatePicker';

const ToDoView = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    due_date: '',
    color_theme: 'yellow'
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get('/api/todos');
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error('Failed to load todos:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      await api.post('/api/todos', newTodo);
      toast.success('Task added!');
      setShowAddModal(false);
      setNewTodo({ title: '', description: '', due_date: '', color_theme: 'yellow' });
      fetchTodos();
    } catch (error) {
      console.error('Failed to add todo:', error);
      toast.error('Failed to add task');
    }
  };

  const handleUpdateStatus = async (todoId, newStatus) => {
    try {
      await api.put(`/api/todos/${todoId}`, { status: newStatus });
      setTodos(todos.map(t => t.id === todoId ? { ...t, status: newStatus } : t));
      toast.success('Status updated!');
    } catch (error) {
      console.error('Failed to update todo:', error);
      toast.error('Failed to update task');
    }
  };

  const handleUpdateColor = async (todoId, newColor) => {
    try {
      await api.put(`/api/todos/${todoId}`, { color_theme: newColor });
      setTodos(todos.map(t => t.id === todoId ? { ...t, color_theme: newColor } : t));
    } catch (error) {
      console.error('Failed to update color:', error);
      toast.error('Failed to update color');
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await api.delete(`/api/todos/${todoId}`);
      setTodos(todos.filter(t => t.id !== todoId));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      toast.error('Failed to delete task');
    }
  };

  const getColorClass = (color) => {
    const colors = {
      yellow: 'bg-yellow-100 border-yellow-300',
      blue: 'bg-blue-100 border-blue-300',
      green: 'bg-green-100 border-green-300',
      pink: 'bg-pink-100 border-pink-300',
      purple: 'bg-purple-100 border-purple-300'
    };
    return colors[color] || colors.yellow;
  };

  const isPastDue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const pastDueTodos = todos.filter(t => t.status !== 'Completed' && isPastDue(t.due_date));
  const upcomingTodos = todos.filter(t => t.status !== 'Completed' && !isPastDue(t.due_date));
  const completedTodos = todos.filter(t => t.status === 'Completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A535C]"></div>
      </div>
    );
  }

  const ToDoCard = ({ todo }) => (
    <div className={`${getColorClass(todo.color_theme)} border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative`}>
      {/* Color picker */}
      <div className="absolute top-2 right-2 flex gap-1">
        {['yellow', 'blue', 'green', 'pink', 'purple'].map(color => (
          <button
            key={color}
            onClick={() => handleUpdateColor(todo.id, color)}
            className={`w-4 h-4 rounded-full ${getColorClass(color)} border border-gray-300 hover:scale-110 transition-transform`}
            title={color}
          />
        ))}
      </div>

      <h3 className="font-bold text-gray-900 mb-2 pr-24">{todo.title}</h3>
      {todo.description && (
        <p className="text-sm text-gray-600 mb-3">{todo.description}</p>
      )}

      {todo.due_date && (
        <div className={`flex items-center gap-1 text-xs mb-3 ${isPastDue(todo.due_date) && todo.status !== 'Completed' ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
          <Clock size={14} />
          <span>Due: {new Date(todo.due_date).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <select
          value={todo.status}
          onChange={(e) => handleUpdateStatus(todo.id, e.target.value)}
          className="text-xs px-2 py-1 rounded border border-gray-300 bg-white focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          onClick={() => handleDeleteTodo(todo.id)}
          className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your To-Do List</h1>
          {pastDueTodos.length > 0 && (
            <span className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {pastDueTodos.length} overdue task{pastDueTodos.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Past Due + Upcoming */}
        <div className="space-y-6">
          {/* Past Due */}
          {pastDueTodos.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <Circle className="fill-red-600" size={20} />
                Past Due
              </h2>
              <div className="space-y-3">
                {pastDueTodos.map(todo => (
                  <ToDoCard key={todo.id} todo={todo} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={20} />
              Upcoming
            </h2>
            {upcomingTodos.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                No upcoming tasks
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingTodos.map(todo => (
                  <ToDoCard key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Completed */}
        <div>
          <h2 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} />
            Completed
          </h2>
          {completedTodos.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
              No completed tasks yet
            </div>
          ) : (
            <div className="space-y-3">
              {completedTodos.map(todo => (
                <ToDoCard key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  placeholder="e.g., Complete college application"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A535C] focus:border-transparent"
                  rows="3"
                  placeholder="Additional details..."
                />
              </div>

              <DatePicker
                value={newTodo.due_date}
                onChange={(value) => setNewTodo({ ...newTodo, due_date: value })}
                label="Due Date"
                placeholder="Select due date"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme</label>
                <div className="flex gap-2">
                  {['yellow', 'blue', 'green', 'pink', 'purple'].map(color => (
                    <button
                      key={color}
                      onClick={() => setNewTodo({ ...newTodo, color_theme: color })}
                      className={`w-10 h-10 rounded-lg ${getColorClass(color)} border-2 ${newTodo.color_theme === color ? 'border-gray-800' : 'border-gray-300'} hover:scale-110 transition-transform`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddTodo}
                  className="flex-1 bg-gradient-to-r from-[#1A535C] to-[#2d8659] text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToDoView;
