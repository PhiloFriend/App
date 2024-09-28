import { BehaviorSubject } from "rxjs";
import {
  Question,
  Option,
  HistoryNode,
  QuestionHistoryNode,
  OptionHistoryNode,
} from "./types";

export class QuizService {
  private questionsMap: Map<string, Question>;
  private currentNode: HistoryNode | null;
  private rootNode: QuestionHistoryNode;

  public readonly historySubject: BehaviorSubject<HistoryNode>;
  public readonly canGoBack$: BehaviorSubject<boolean>;

  constructor(questions: Question[]) {
    this.questionsMap = new Map<string, Question>(
      questions.map((q) => [q.id, q])
    );

    const rootQuestion = this.questionsMap.get("root");
    if (!rootQuestion) {
      throw new Error('Root question with id "root" not found.');
    }

    this.rootNode = {
      id: "node_0",
      type: "question",
      question: rootQuestion,
      children: [],
    };
    this.currentNode = this.rootNode;

    this.historySubject = new BehaviorSubject<HistoryNode>(this.rootNode);
    this.canGoBack$ = new BehaviorSubject<boolean>(false);
  }

  // Get the current question
  getCurrentQuestion(): Question | null {
    return this.currentNode && this.currentNode.type === "question"
      ? this.currentNode.question
      : null;
  }

  // Answer the current question
  answerCurrentQuestion(option: Option): void {
    if (!this.currentNode || this.currentNode.type !== "question") {
      console.error("No current question to answer.");
      return;
    }

    // Create an option node for the selected option
    const optionNode: OptionHistoryNode = {
      id: `node_${Date.now()}`, // Use timestamp for unique IDs
      type: "option",
      selectedOption: option,
      parent: this.currentNode,
      children: [],
    };
    this.currentNode.children.push(optionNode);

    if (option.nextQuestionId) {
      const nextQuestion = this.questionsMap.get(option.nextQuestionId);
      if (nextQuestion) {
        const nextQuestionNode: QuestionHistoryNode = {
          id: `node_${Date.now()}`,
          type: "question",
          question: nextQuestion,
          parent: optionNode,
          children: [],
        };
        optionNode.children.push(nextQuestionNode);
        this.currentNode = nextQuestionNode;
      } else {
        console.error(`Question with ID ${option.nextQuestionId} not found.`);
        this.currentNode = null;
      }
    } else {
      // End of quiz branch
      this.currentNode = null;
    }

    // After updating the current node
    this.updateCanGoBack();

    // Emit the updated history tree
    this.historySubject.next(this.rootNode);
  }

  // Go back to the previous question
  goBack(): void {
    if (
      this.currentNode &&
      this.currentNode.parent &&
      this.currentNode.parent.parent
    ) {
      // Remove the last option node and question node
      const optionNode = this.currentNode.parent as OptionHistoryNode;
      const questionNode = optionNode.parent as QuestionHistoryNode;

      // Remove the option node from the question node's children
      questionNode.children = questionNode.children.filter(
        (child) => child !== optionNode
      );

      // Update the current node
      this.currentNode = questionNode;
    } else {
      console.warn("Cannot go back from the root question.");
    }

    // After updating the current node
    this.updateCanGoBack();

    // Emit the updated history tree
    this.historySubject.next(this.rootNode);
  }

  private updateCanGoBack() {
    const canGoBack = !!(
      this.currentNode &&
      this.currentNode.parent &&
      this.currentNode.parent.parent
    );
    this.canGoBack$.next(canGoBack);
  }

  public getAnswerArray(): string {
    const answerArray = this.traverseHistoryTree(this.rootNode);
    return answerArray.join(", ");
  }

  private traverseHistoryTree(node: HistoryNode): string[] {
    const result: string[] = [];
    if (node.type === "question") {
      const questionNode = node as QuestionHistoryNode;
      if (questionNode.children.length > 0) {
        const optionNode = questionNode.children[0] as OptionHistoryNode;
        result.push(
          `${questionNode.question.title} ${optionNode.selectedOption.title}`
        );
        if (optionNode.children.length > 0) {
          result.push(...this.traverseHistoryTree(optionNode.children[0]));
        }
      }
    }
    return result;
  }
}
