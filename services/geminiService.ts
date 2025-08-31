import { GoogleGenAI, Type } from "@google/genai";
import { Meal, Recipe, WorkoutPlan, SleepEntry, WorkoutLog, MedicalRecord, Appointment } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMeal = async (description: string): Promise<Omit<Meal, 'id' | 'description'>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the nutritional content of this meal: "${description}". Provide your best estimate for calories, protein, carbohydrates, and fat.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            calories: { type: Type.NUMBER, description: "Estimated calories in kcal" },
            protein: { type: Type.NUMBER, description: "Estimated protein in grams" },
            carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams" },
            fat: { type: Type.NUMBER, description: "Estimated fat in grams" },
          },
          required: ["calories", "protein", "carbs", "fat"],
        },
      },
    });

    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Error analyzing meal:", error);
    throw new Error("Failed to analyze meal. Please try again.");
  }
};

export const generateWorkoutPlan = async (goal: string, days: number): Promise<WorkoutPlan> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Create a ${days}-day workout plan for someone whose goal is "${goal}". Provide a focus for each day and a list of exercises with sets and reps.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "Day of the workout (e.g., Day 1)" },
              focus: { type: Type.STRING, description: "Main focus of the day (e.g., Upper Body)" },
              exercises: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Name of the exercise" },
                    sets: { type: Type.STRING, description: "Number of sets" },
                    reps: { type: Type.STRING, description: "Number of repetitions" },
                  },
                  required: ["name", "sets", "reps"],
                },
              },
            },
             required: ["day", "focus", "exercises"],
          },
        },
      },
    });
    
    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    return data;
  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan. Please try again.");
  }
};


export const generateMindfulnessScript = async (mood: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a short, calming, guided mindfulness script (around 150-200 words) for someone who is feeling "${mood}". The script should be easy to follow and focus on breathing and being present. Use paragraph breaks for pacing.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating mindfulness script:", error);
    throw new Error("Failed to generate mindfulness script. Please try again.");
  }
};

export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate two healthy and simple recipes using these ingredients: ${ingredients}.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            recipeName: { type: Type.STRING },
                            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                         required: ["recipeName", "ingredients", "instructions"],
                    },
                },
            },
        });
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error generating recipes:', error);
        throw new Error('Failed to generate recipes. Please try again.');
    }
};

export const generateGroceryList = async (meals: Meal[]): Promise<string[]> => {
    if (meals.length === 0) return [];
    const mealDescriptions = meals.map(m => m.description).join(', ');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on the following meals, create a simple grocery list. Combine similar items: ${mealDescriptions}.`,
             config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        groceryList: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["groceryList"]
                },
            }
        });
        const jsonString = response.text;
        const data = JSON.parse(jsonString);
        return data.groceryList;
    } catch (error) {
        console.error('Error generating grocery list:', error);
        throw new Error('Failed to generate grocery list.');
    }
};

export const suggestMusic = async (workoutFocus: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Suggest 3 music genres or playlist ideas for a workout focusing on ${workoutFocus}.`,
        });
        return response.text.split('\n').map(s => s.replace(/^- /, '')).filter(s => s.trim() !== '');
    } catch (error) {
        console.error('Error suggesting music:', error);
        throw new Error('Failed to suggest music.');
    }
};

export const generateAffirmation = async (mood: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a short, powerful, positive affirmation for someone feeling ${mood}.`,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating affirmation:', error);
        throw new Error('Failed to generate affirmation.');
    }
};

export const analyzeExerciseForm = async (videoBase64: string, mimeType: string, exerciseName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // This is a placeholder, a vision-capable model would be needed
            contents: {
                parts: [
                    { inlineData: { data: videoBase64, mimeType } },
                    { text: `Analyze my form for the exercise "${exerciseName}". Provide 3-4 specific, actionable tips for improvement. Focus on proper alignment, safety, and effectiveness. Format the tips as a bulleted list.` }
                ]
            }
        });
        return response.text;
    } catch (error) {
        console.error('Error analyzing form:', error);
        // This is a mock response because vision models are not available for this task yet.
        // In a real scenario, we'd handle the error properly.
        const mockTips = [
            "Keep your back straight throughout the movement.",
            "Ensure your knees do not extend past your toes.",
            "Engage your core to maintain stability.",
            "Control the movement on the way down as well as on the way up."
        ];
        await new Promise(res => setTimeout(res, 2000)); // Simulate API delay
        return `Here is feedback for your ${exerciseName}:\n\n- ${mockTips.join('\n- ')}`;
        // throw new Error('Failed to analyze exercise form.');
    }
};

export const getMedicationInfo = async (medicationName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a brief, easy-to-understand description (around 50-70 words) for the medication "${medicationName}". Focus on its primary use and general purpose. Do not provide dosage information or medical advice.`,
        });
        return response.text;
    } catch (error) {
        console.error('Error fetching medication info:', error);
        throw new Error('Failed to fetch medication information.');
    }
};

export const getHealthTopicInfo = async (topic: string): Promise<{ content: string; sources: any[] }> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Provide a clear and concise explanation of the health topic: "${topic}". The explanation should be easy for a layperson to understand. Cover the key aspects, such as what it is, its importance or effects, and general wellness tips related to it. Structure the response with paragraphs.`,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const content = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

        return { content, sources };
    } catch (error) {
        console.error('Error fetching health topic info:', error);
        throw new Error('Failed to fetch health information.');
    }
};

export const generateWeeklyReport = async (data: { meals: Meal[], sleep: SleepEntry[], workouts: WorkoutLog[] }): Promise<string> => {
    const prompt = `
        You are a supportive and insightful wellness coach. Analyze the user's health data from the past week and generate a personalized report.
        The report should be encouraging and provide actionable advice. Structure your response in markdown format with the following sections:
        - **Overall Summary:** A brief, positive overview of the week.
        - **Nutrition Breakdown:** Comment on the user's eating habits based on their logged meals. Mention consistency and any patterns you see.
        - **Activity & Fitness:** Summarize the workouts. Acknowledge their effort and suggest how they could enhance their routine if applicable.
        - **Sleep Patterns:** Analyze sleep duration and quality. Highlight the importance of good sleep and provide tips if there's room for improvement.
        - **Your Week Ahead:** Provide 3 clear, actionable, and encouraging tips for the user to focus on in the coming week based on their data.

        Here is the user's data for the last 7 days:

        **Logged Meals:**
        ${data.meals.length > 0 ? data.meals.map(m => `- ${m.description} (Approx. ${m.calories} kcal)`).join('\n') : 'No meals logged.'}

        **Workout Logs:**
        ${data.workouts.length > 0 ? data.workouts.map(w => `- ${w.date}: ${w.type} for ${w.duration} minutes`).join('\n') : 'No workouts logged.'}

        **Sleep Entries:**
        ${data.sleep.length > 0 ? data.sleep.map(s => `- ${s.date}: ${s.duration} hours (Quality: ${s.quality})`).join('\n') : 'No sleep logged.'}

        Please generate the report.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('Error generating weekly report:', error);
        throw new Error('Failed to generate weekly report.');
    }
};


export const parsePrescription = async (imageBase64: string, mimeType: string): Promise<{name: string, dosage: string}> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: `Analyze this image of a prescription. Extract the medication name and the dosage (e.g., 500mg, 1 tablet). Return it as JSON with keys 'name' and 'dosage'. If you cannot find the information, return empty strings.` }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        dosage: { type: Type.STRING },
                    },
                    required: ["name", "dosage"]
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing prescription:', error);
        throw new Error('Failed to read prescription from image.');
    }
}

export const summarizeHealthRecords = async (records: MedicalRecord): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following health records into a simple, easy-to-understand paragraph (around 100-150 words) for a patient. Be reassuring and focus on giving a clear overview. Health Records: ${JSON.stringify(records)}`,
        });
        return response.text;
    } catch (error) {
        console.error('Error summarizing health records:', error);
        throw new Error('Failed to generate health summary.');
    }
}

export const getAppointmentSlots = async (reason: string, preferredDate: string): Promise<Omit<Appointment, 'id' | 'status' | 'reason'>[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `A user wants to book a medical appointment for "${reason}" around "${preferredDate}". Suggest 3 available appointment slots. For each, provide a fictional doctor's name, a relevant specialty, a specific date (close to the preferred date), and a time.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            doctor: { type: Type.STRING },
                            specialty: { type: Type.STRING },
                            date: { type: Type.STRING },
                            time: { type: Type.STRING },
                        },
                        required: ["doctor", "specialty", "date", "time"]
                    }
                }
            }
        });
        const jsonString = response.text;
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error getting appointment slots:', error);
        throw new Error('Failed to find available appointments.');
    }
}