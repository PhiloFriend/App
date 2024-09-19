export type PhilosophyType = {
  id: string;
  name: string;
  explanation: string;
  relevance: string;
  application: string;
};

export type ChoosePhilosophyResultType = {
  primary: PhilosophyType;
  complementary: Array<PhilosophyType>;
};
