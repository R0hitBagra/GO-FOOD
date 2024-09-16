import React, { useReducer, useContext, createContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD": {
            // Make sure to store the price per unit, not the total price
            return [...state, { id: action.id, name: action.name, qty: action.qty, size: action.size, price: action.price, img: action.img }];
        }
        case "REMOVE": {
            let newArr = [...state];
            newArr.splice(action.index, 1);
            return newArr;
        }
        case "DROP": {
            return [];
        }
        case "UPDATE": {
            let arr = [...state];
            arr.find((food, index) => {
                if (food.id === action.id) {
                    // Only update the quantity, price should remain per unit
                    arr[index] = { ...food, qty: parseInt(action.qty) + food.qty };
                }
                return arr;
            });
            return arr;
        }
        default: {
            console.log("Error in Reducer");
            return state;
        }
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, []);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
