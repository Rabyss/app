

import {EventEmitter} from "events";

export class _ErrorStore extends EventEmitter {
  public type: string;

  register() {
    // window.onerror = this.onGlobalError.bind(this);
    Promise.onPossiblyUnhandledRejection(this.onPromiseError.bind(this));
  }

  emitTurnError(error) {
    this.emit('error', {
      type: 'Turn',
      error: error
    });
  }

  emitError(error) {
    this.emit('error', {
      type: 'Generic',
      error: error
    });
  }

  onGlobalError(msg, url, line, col, error) {
    this.emitError(error);
  }

  onPromiseError(error) {
    this.emit('error', {
      type: 'Network',
      error: error
    });
  }
  
  off(event: string, listener: Function): EventEmitter {
    console.error("Not implemented yet");
    return this;
  }

}

export const ErrorStore = new _ErrorStore();