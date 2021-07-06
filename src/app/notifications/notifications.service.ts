import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';


interface Command {
  id: number,
  type: 'success' | 'error' | 'clear',
  text?: string
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  messages: Subject<Command>;

  constructor() { 
    this.messages = new Subject<Command>().pipe(
      scan((acc, val) => {
        if(val.type === "clear") {
          return acc.filter(mess => mess.id !== val.id)
        } else {
          return [...acc, val]
        }
      }, [])
    )
   }

  addSuccess(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'success'
    });
  }
  
  addError(message: string) {
    this.messages.next({
      id: this.randomId(),
      text: message,
      type: 'error'
    });
  }

  clearMessage(id: number) {
    this.messages.next({
      id: id,
      type: 'clear'
    });
  }

  private randomId() {
    return Math.round(Math.random() * 100_000)
  }
}
