(function(root) {
  'use strict';

  var CHANGE_EVENT = "TASK_STORE_CHANGE_EVENT";
  var CREATE_TASK_OK = "CREATE_TASK_OK";
  var ASSIGN_TASK_WORKER_OK = "ASSIGN_TASK_WORKER_OK";
  var ASSIGN_TASK_OPEN_OK = "ASSIGN_TASK_WORKER_OK";
  var _tasks = [];

  var _resetTasks = function(tasks) {
    _tasks = tasks;
    TaskStore.emit(CHANGE_EVENT);
  };

  var _createTask = function(createdTask) {
    _tasks.push(createdTask);
    TaskStore.emit(CHANGE_EVENT);
    TaskStore.emit(CREATE_TASK_OK);
  };

  var _deleteTask = function(createdTask) {
    var taskIdx = _tasks.indexOf(createdTask);
    _tasks.splice(taskIdx, 1);
    TaskStore.emit(CHANGE_EVENT);
  };

  var sortTasksByAttribute = function(isAscending, attr1, attr2) {
    return function(task1, task2) {
      if (typeof attr2 === "undefined") {
        if (task1[attr1] < task2[attr1]) {
          return isAscending ? -1 : 1 ;
        } else if (task1[attr1] > task2[attr1]) {
          return isAscending ? 1 : -1 ;
        } else {
          return 0;
        }
      } else {
        if (task1[attr1][attr2] < task2[attr1][attr2]) {
          return isAscending ? -1 : 1 ;
        } else if (task1[attr1][attr2] > task2[attr1][attr2]) {
          return isAscending ? 1 : -1 ;
        } else {
          return 0;
        }
      }
    };
  };

  var TaskStore = root.TaskStore = $.extend({}, EventEmitter.prototype, {
    all: function() {
      return _tasks.slice();
    },

    allComplete: function() {
      return _tasks.filter(function(task) {
        if (typeof task.review !== "undefined") { return task; }
      });
    },

    allIncomplete: function() {
      return _tasks.filter(function(task) {
        if (typeof task.review === "undefined") { return task; }
      });
    },

    allIncompleteUnassigned: function() {
      return this.allIncomplete().filter(function(task) {
        if (typeof task.worker === "undefined") { return task; }
      });
    },

    allIncompleteAssigned: function() {
      return this.allIncomplete().filter(function(task) {
        if (typeof task.worker !== "undefined") { return task; }
      });
    },

    sortTasksByAttribute: function(isAscending, attr1, attr2) {
      return function(task1, task2) {
        if (typeof attr2 === "undefined") {
          if (task1[attr1] < task2[attr1]) {
            return isAscending ? -1 : 1 ;
          } else if (task1[attr1] > task2[attr1]) {
            return isAscending ? 1 : -1 ;
          } else {
            return 0;
          }
        } else {
          if (task1[attr1][attr2] < task2[attr1][attr2]) {
            return isAscending ? -1 : 1 ;
          } else if (task1[attr1][attr2] > task2[attr1][attr2]) {
            return isAscending ? 1 : -1 ;
          } else {
            return 0;
          }

        }
      };
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    addCreateTaskOKListener: function(callback) {
      this.on(CREATE_TASK_OK, callback);
    },

    removeCreateTaskOKListener: function(callback) {
      this.removeListener(CREATE_TASK_OK, callback);
    },

    addAssignTaskWorkerOKListener: function(callback) {
      this.on(ASSIGN_TASK_WORKER_OK, callback);
    },

    removeAssignTaskWorkerOKListener: function(callback) {
      this.removeListener(ASSIGN_TASK_WORKER_OK, callback);
    },

    addAssignTaskOpenOKListener: function(callback) {
      this.on(ASSIGN_TASK_OPEN_OK, callback);
    },

    removeAssignTaskOpenOKListener: function(callback) {
      this.removeListener(ASSIGN_TASK_OPEN_OK, callback);
    },

    dispatcherID: AppDispatcher.register(function(payload) {
      switch (payload.actionType) {
        case TaskConstants.TASKS_RECEIVED:
          _resetTasks(payload.action);
          break;
        case TaskConstants.CREATE_TASK:
          _createTask(payload.action);
          break;
        case TaskConstants.DELETE_TASK:
          _deleteTask(payload.action);
          break;
        case TaskConstants.ASSIGN_TASK_WORKER_OK:
          TaskStore.emit(ASSIGN_TASK_WORKER_OK);
          break;
        case TaskConstants.ASSIGN_TASK_OPEN_OK:
          TaskStore.emit(ASSIGN_TASK_OPEN_OK);
          break;
      }
    })
  });

  TaskStore.setMaxListeners(0);
}(this));
