// progress.js
import { loadTasks } from './storage.js';

export function initProgress() {
  const progressSummary = document.getElementById('progressSummary');
  const progressChart = document.getElementById('progressChart');
  if (!progressSummary || !progressChart) return;

  const tasks = loadTasks();
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.length - completed;

  progressSummary.textContent = `Completed: ${completed} | Pending: ${pending}`;

  const ctx = progressChart.getContext('2d');
  const total = completed + pending || 1;

  ctx.clearRect(0, 0, progressChart.width, progressChart.height);

  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(50, 50, (completed / total) * 200, 30);

  ctx.fillStyle = '#f44336';
  ctx.fillRect(50 + (completed / total) * 200, 50, (pending / total) * 200, 30);

  ctx.strokeStyle = '#004080';
  ctx.strokeRect(50, 50, 200, 30);
}
