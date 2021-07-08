import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface Command {
  id: number;
  type: 'success' | 'error' | 'clear';
  text?: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  messagesInput: Subject<Command>;
  messagesOutput: Observable<Command[]>

  constructor() {
    this.messagesInput = new Subject<Command>();
    this.messagesOutput = this.messagesInput.pipe(
      scan((acc: Command[], val: Command) => {
        if (val.type === 'clear') {
          return acc.filter((mess) => mess.id !== val.id);
        } else {
          return [...acc, val];
        }
      }, [])
    );
  }


  addSuccess(message: string) {
    const id = this.randomId()
    this.messagesInput.next({
      id: id,
      text: message,
      type: 'success',
    });

    setTimeout(() => {
      this.clearMessage(id)
    }, 5000);
  }

  addError(message: string) {
    const id = this.randomId()
    this.messagesInput.next({
      id: id,
      text: message,
      type: 'error',
    });

    setTimeout(() => {
      this.clearMessage(id)
    }, 5000);
  }

  clearMessage(id: number) {
    this.messagesInput.next({
      id: id,
      type: 'clear',
    });
  }

  private randomId() {
    return Math.round(Math.random() * 100_000);
  }
}
