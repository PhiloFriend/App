import { BehaviorSubject } from "rxjs";
import { Option } from "./types";


export class QuizHistoryService {
  private answers = new BehaviorSubject<{ [questionId: string]: Option }>({});

  recordAnswer(questionId: string, option: Option) {
    const currentAnswers = this.answers.value;
    this.answers.next({
      ...currentAnswers,
      [questionId]: option,
    });
  }

  getAnswers$() {
    return this.answers.asObservable();
  }
}
