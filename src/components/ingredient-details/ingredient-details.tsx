import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientsState } from '../../services/slices/ingredients/ingredients';
import { useSelector } from '../../services/store/store';
import { useParams } from 'react-router-dom';

type TIngredientDetails = {
  showHeader: boolean;
};

export const IngredientDetails: FC<TIngredientDetails> = ({ showHeader }) => {
  const { ingredients } = useSelector(getIngredientsState);
  const { id } = useParams();

  const ingredientData = ingredients.find(
    (ingredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      showHeader={showHeader}
    />
  );
};
