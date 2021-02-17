import React, { useState, useReducer, useEffect, useCallback } from "react";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
import ErrorModal from "./../UI/ErrorModal";

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "POST":
      return [...currentIngredients, action.ingredients];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there");
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return{
        loading:true,
        error:null
      }
    case "RESPONSE":
      return{
        ...currentHttpState,
        loading:false
      }
    case "ERROR":
      return{
        loading:false,
        error:action.errorData
      };
    case 'CLEAR':
      return{
        ...currentHttpState,
        error:null
      }
    default:
      throw new Error("should not happen");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer,{loading:false, error:null});
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();

  useEffect(() => {
    fetch(
      "https://react-hooks-5bbb1-default-rtdb.firebaseio.com/ingredients.json"
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        console.log("useeffect get call");
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        // setUserIngredients(loadedIngredients);
        dispatch({ type: "SET", ingredients: loadedIngredients });
      });
  }, []);

  useEffect(() => {
    console.log(
      "-----------------rendering ingredients-------------------------------"
    );
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredient = (ingredients) => {
    // setIsLoading(true);
    dispatchHttp({type:"SEND"});
    fetch(
      "https://react-hooks-5bbb1-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredients),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatchHttp({type:"RESPONSE"});
        return response.json();
      })
      .then((responseData) => {
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   {
        //     id: responseData.name,
        //     ...ingredients,
        //   },
        // ]);
        dispatch({
          type: "POST",
          ingredients: { id: responseData.name, ...ingredients },
        });
      });
  };

  const clearError = () => {
    // setError(null);
    dispatchHttp({type:"CLEAR"});
  };

  const removeIngredient = (ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({type:"SEND"});
    fetch(
      `https://react-hooks-5bbb1-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        dispatchHttp({type:"RESPONSE"});
        // setIsLoading(false);
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
        dispatch({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        // setError("Something went wrong");
        // setIsLoading(false);
        dispatchHttp({type:"ERROR", errorData:'something went wrong'});
      });
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredients={addIngredient} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredient}
        />
      </section>
    </div>
  );
};

export default Ingredients;
