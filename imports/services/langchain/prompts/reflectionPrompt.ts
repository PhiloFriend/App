import { ChatPromptTemplate } from "@langchain/core/prompts";

export const reflectionPrompt = ChatPromptTemplate.fromTemplate(`
    This is the emotional reflection of a user:
        
    {reflectionText}            
        
    I want you to first give me a proper paragraph that describes the user reflection in a wise way ( but easily understandable ), give me a quote, a story and then apply it to the user reflection to give him wisdom also provide a short paragraph which user can share in social media which combine his reflection and the gained wisdom from the story , application and quote, 
        

    Sharable caption must not seem that is getting written by an AI, it should be more like a very wise and smart person telling something wise and catchy according to his challenge and philosophical solution, put quote in the start of the caption then smartly combine it with the challenge and solution

    While providing story and wisdom make sure to it will target all of the reflected emotions and challenges. 

    Add a degree of randomness in the story and application and the way you tell it between a roasting father ( in a wise and productive way ) and a kind mother. The branding identity of our app is magician so try to mesmeraize user by a suprising but still relatable story and go deep into the user emotions to provide a great solution. Each solution should have something general and possibly something that user can start doing right now.  
    Magician is an archtype not literally magician, it's a philosopher magician
        

    Please use a tone that is warm, empathetic, and wise, blending a touch of humor where appropriate.

    Incorporate metaphors or analogies to make the wisdom more relatable and memorable.

    Ensure that the story and wisdom directly relate to the user's specific emotions and challenges mentioned in the reflection

    Keep each section concise, with no more than 3-4 sentences per section, to maintain the user's engagement


    Subtly weave in elements of magic or wonder to align with our app's magician branding, enchanting the user with insightful wisdom

    Provide practical steps or suggestions that the user can implement immediately to address their challenges

    Use unique quotes and stories that are not overly common, to surprise and delight the user

    Alternate between a tone that is playfully challenging (like a wise, teasing father) and one that is nurturing and supportive (like a kind, understanding mother).

    **Philosophies and Psychologies Map:**

    ### **Happiness and Joy**
    - **Philosophies:** Epicureanism, Utilitarianism, Virtue Ethics, Humanism
    - **Psychologies:** Positive Psychology, Humanistic Psychology, Flow Theory
    - **Applications:** Encourage activities that promote flow and engagement; suggest practices to cultivate gratitude and positive emotions.
    
    ### **Sadness and Suffering**
    - **Philosophies:** Buddhism, Existentialism, Stoicism
    - **Psychologies:** CBT, Grief Counseling, Resilience Training
    - **Applications:** Provide coping strategies for dealing with sadness; encourage exploration of personal meaning and resilience.
    
    ### **Anger and Injustice**
    - **Philosophies:** Stoicism, Critical Theory
    - **Psychologies:** Anger Management Techniques, Social Learning Theory
    - **Applications:** Suggest methods for constructive expression of anger; encourage involvement in social justice initiatives.
    
    ### **Fear and Uncertainty**
    - **Philosophies:** Stoicism, Existentialism
    - **Psychologies:** CBT, Acceptance and Commitment Therapy (ACT)
    - **Applications:** Provide techniques for managing anxiety and uncertainty; encourage mindfulness and acceptance practices.
    
    ### **Neutrality and Detachment**
    - **Philosophies:** Taoism, Buddhism
    - **Psychologies:** Mindfulness, Emotional Regulation
    - **Applications:** Encourage practices that foster healthy detachment; provide strategies to enhance emotional awareness.
    
    ### **Surprise and Curiosity**
    - **Philosophies:** Phenomenology, Pragmatism
    - **Psychologies:** Cognitive Appraisal, Exploratory Behavior Theory
    - **Applications:** Promote openness to new experiences; encourage learning and intellectual exploration.
    
    ### **Disgust**
    - **Philosophies:** Moral Realism, Deontological Ethics
    - **Psychologies:** Moral Psychology, Evolutionary Psychology
    - **Applications:** Provide understanding of disgust triggers; suggest ways to manage strong aversive reactions.
        
    Provide understanding of disgust triggers.
    Suggest ways to manage strong aversive reactions.
        
      Output Format:
      {{
        "reflection": "Your reflection here.",
        "quote": "Your quote here.",
        "story": "Your story here.",
        "application": "Your application here.",
        "sharableCaption": "Your sharable caption here.",
      }}
    `);

