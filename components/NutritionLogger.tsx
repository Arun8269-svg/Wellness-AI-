import React, { useState } from 'react';
import { analyzeMeal, generateRecipes, generateGroceryList } from '../services/geminiService';
import { Meal, Recipe } from '../types';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';

interface NutritionLoggerProps {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
}

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => (
    <div className="bg-base-200 p-5 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
        <h3 className="font-bold text-lg text-neutral capitalize">{meal.description}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-center">
            <div>
                <p className="text-xs text-neutral/60">Calories</p>
                <p className="font-semibold text-lg text-primary">{meal.calories.toFixed(0)}</p>
            </div>
            <div>
                <p className="text-xs text-neutral/60">Protein</p>
                <p className="font-semibold text-lg text-primary">{meal.protein.toFixed(1)}g</p>
            </div>
            <div>
                <p className="text-xs text-neutral/60">Carbs</p>
                <p className="font-semibold text-lg text-primary">{meal.carbs.toFixed(1)}g</p>
            </div>
            <div>
                <p className="text-xs text-neutral/60">Fat</p>
                <p className="font-semibold text-lg text-primary">{meal.fat.toFixed(1)}g</p>
            </div>
        </div>
    </div>
);

const RecipeSuggester: React.FC = () => {
    const [ingredients, setIngredients] = useState('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuggest = async () => {
        if (!ingredients.trim()) return;
        setIsLoading(true);
        setError(null);
        setRecipes([]);
        try {
            const result = await generateRecipes(ingredients);
            setRecipes(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-base-200 p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold text-neutral mb-4">AI Recipe Suggester</h2>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder="e.g., tomatoes, basil, chicken"
                    className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                    disabled={isLoading}
                />
                <button onClick={handleSuggest} disabled={isLoading || !ingredients.trim()} className="flex items-center justify-center bg-secondary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 disabled:bg-secondary/50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                    {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    <span>Suggest Recipes</span>
                </button>
            </div>
            {error && <p className="text-error mt-4 text-sm">{error}</p>}
            {recipes.length > 0 && (
                <div className="mt-6 space-y-4">
                    {recipes.map(recipe => (
                        <div key={recipe.recipeName} className="bg-base-100 p-4 rounded-lg">
                           <h3 className="font-bold text-lg text-primary">{recipe.recipeName}</h3>
                           <h4 className="font-semibold mt-2">Ingredients:</h4>
                           <ul className="list-disc list-inside text-sm">
                               {recipe.ingredients.map(ing => <li key={ing}>{ing}</li>)}
                           </ul>
                           <h4 className="font-semibold mt-2">Instructions:</h4>
                           <ol className="list-decimal list-inside text-sm space-y-1">
                               {recipe.instructions.map(inst => <li key={inst}>{inst}</li>)}
                           </ol>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const GroceryListGenerator: React.FC<{meals: Meal[]}> = ({meals}) => {
    const [list, setList] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setList([]);
        try {
            const result = await generateGroceryList(meals);
            setList(result);
        } catch(err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }
    
    return (
         <div className="bg-base-200 p-6 rounded-2xl shadow-md">
             <h2 className="text-2xl font-bold text-neutral mb-4">Grocery List</h2>
             <button onClick={handleGenerate} disabled={isLoading || meals.length === 0} className="w-full flex items-center justify-center bg-accent text-neutral font-bold px-6 py-3 rounded-lg shadow-sm hover:opacity-90 disabled:bg-accent/50 disabled:cursor-not-allowed transition-colors">
                 {isLoading ? <Spinner/> : <SparklesIcon className="w-5 h-5 mr-2"/>}
                 <span>Generate from Today's Meals</span>
             </button>
             {error && <p className="text-error mt-4 text-sm">{error}</p>}
             {list.length > 0 && (
                 <div className="mt-4 bg-base-100 p-4 rounded-lg">
                    <ul className="list-disc list-inside space-y-1">
                        {list.map(item => <li key={item}>{item}</li>)}
                    </ul>
                 </div>
             )}
         </div>
    )
}

const NutritionLogger: React.FC<NutritionLoggerProps> = ({ meals, addMeal }) => {
  const [mealDescription, setMealDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDescription.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const analysis = await analyzeMeal(mealDescription);
      addMeal({
        id: new Date().toISOString(),
        description: mealDescription,
        ...analysis,
      });
      setMealDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-neutral">Nutrition Tracker</h1>
        <p className="text-neutral/60 mt-2">Log your meals and get an instant AI-powered nutritional breakdown.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-2xl shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={mealDescription}
            onChange={(e) => setMealDescription(e.target.value)}
            placeholder="e.g., Chicken salad with avocado"
            className="w-full px-4 py-3 bg-base-100 border border-base-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-primary text-primary-content font-bold px-6 py-3 rounded-lg shadow-sm hover:bg-primary-focus disabled:bg-primary/50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            disabled={isLoading || !mealDescription.trim()}
          >
            {isLoading ? <Spinner /> : <SparklesIcon className="w-5 h-5 mr-2"/>}
            <span>{isLoading ? 'Analyzing...' : 'Analyze Meal'}</span>
          </button>
        </div>
        {error && <p className="text-error mt-4 text-sm">{error}</p>}
      </form>

      <div>
        <h2 className="text-2xl font-bold text-neutral mb-4">Today's Log</h2>
        {meals.length > 0 ? (
          <div className="space-y-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-base-200 rounded-2xl">
            <p className="text-neutral/60">No meals logged yet today.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecipeSuggester />
        <GroceryListGenerator meals={meals} />
      </div>

    </div>
  );
};

export default NutritionLogger;