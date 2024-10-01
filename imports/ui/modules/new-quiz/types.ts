// models.ts

export interface Image {
  hash: string;
  url: string;
  mini: string;
}

export interface Option {
  type: "option";
  title: string;
  description: string;
  image?: Image; // Optional image
  nextQuestionId?: string; // ID of the next question
}

export interface Question {
  title: string;
  description?: string;
  type: "options" | "text";
  options?: Option[];
  placeholder?: string;
}

export type NodeType = "question" | "option";

export interface BaseHistoryNode {
  id: string;
  type: NodeType;
  parent?: HistoryNode;
  children: HistoryNode[];
}

export interface QuestionHistoryNode extends BaseHistoryNode {
  type: "question";
  question: Question;
}

export interface OptionHistoryNode extends BaseHistoryNode {
  type: "option";
  selectedOption: Option;
}

export type HistoryNode = QuestionHistoryNode | OptionHistoryNode;
