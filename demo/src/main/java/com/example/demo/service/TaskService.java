package com.example.demo.service;

import com.example.demo.entity.Task;
import com.example.demo.repo.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks(boolean isCompleted) {
        return taskRepository.findByIsCompleted(isCompleted);
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public Optional<Task> updateTask(String id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setCompleted(updatedTask.isCompleted());
            return taskRepository.save(task);
        });
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
}
