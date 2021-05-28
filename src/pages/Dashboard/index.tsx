import Header from '../../components/Header';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';
import { useFoods } from '../../hooks/useFoods';

function Dashboard () {

  const { foods } = useFoods();

  return (
      <>
        <Header />
        <ModalAddFood />
        <ModalEditFood />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;