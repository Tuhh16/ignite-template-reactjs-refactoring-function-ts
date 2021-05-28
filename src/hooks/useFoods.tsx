import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import api from '../services/api';

import { FoodType, FoodAddType } from '../utils/Types';

interface FoodsContextData {
    foods: FoodType[];
    handleAddFood: (food: FoodAddType) => Promise<void>;
    handleUpdateFood: (food: FoodType) => Promise<void>;
    handleDeleteFood: (id: number) => Promise<void>;
    handleEditFood: (food: FoodType) => void;
    toggleModal: () => void;
    toggleEditModal: () => void;
    modalOpen: boolean;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
    editingFood: FoodType;
    editModalOpen: boolean;
}

const FoodsContext = createContext({} as FoodsContextData);

interface FoodsProviderProps {
    children: ReactNode;
}

export function FoodsProvider({ children }: FoodsProviderProps) {
    const [foods, setFoods] = useState<FoodType[]>([]);
    const [editingFood, setEditingFood] = useState({} as FoodType);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

    useEffect(() => {
        async function getFoods() {
            const response = await api.get('/foods');
            setFoods(response.data); 
        }
        getFoods();
    }, []);

    console.log('context', foods);

    async function handleAddFood(food: FoodAddType) {
        try {
            const response = await api.post('/foods', {
            ...food,
            available: true,
            });

            setFoods([...foods, response.data]);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdateFood (food: FoodType) {
        try {
            const foodUpdated = await api.put(
            `/foods/${editingFood.id}`,
            { ...editingFood, ...food },
            );

            const foodsUpdated = foods.map(f =>
            f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );

            setFoods(foodsUpdated);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteFood (id: number) {
        await api.delete(`/foods/${id}`);

        const foodsFiltered = foods.filter(food => food.id !== id);

        setFoods(foodsFiltered);
    }

    function handleEditFood (food: FoodType) {
        setEditingFood(food);
        setEditModalOpen(true);
    }

    function toggleModal () {
        setModalOpen(!modalOpen);
    }

    function toggleEditModal () {
        setEditModalOpen(!editModalOpen);
    }

    return (
        <FoodsContext.Provider
            value={{
                foods,
                handleAddFood,
                handleUpdateFood,
                handleDeleteFood,
                handleEditFood,
                toggleModal,
                toggleEditModal,
                modalOpen,
                setModalOpen,
                editingFood,
                editModalOpen
            }}
        >
            {children}
        </FoodsContext.Provider>
    )
}

export function useFoods() {
    const context = useContext(FoodsContext);

    return context;
}