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
  id: string; // Unique identifier for the question
  type: "question";
  title: string; // Main question text
  description: string; // Additional details or instructions
  image?: Image; // Optional image
  options: Option[]; // List of selectable options
  parentId?: string; // ID of the parent question (if any)
  repeatable: boolean; // Indicates if the question can be repeated
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
