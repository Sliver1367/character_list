import React from "react";
import AllSpells from "../AllSpells/AllSpells";

// Добавляем обработку подкатегорий
const SubcategoryContent = ({ activeSubcategory }) => {
  const subcategoryComponents = {
    "Расы": <div>Контент для "Расы"</div>,
    "Классы": <div>Контент для "Классы"</div>,
    "Предыстории": <div>Контент для "Предыстории"</div>,
    "Черты": <div>Контент для "Черты"</div>,
    "Инвентарь": <div>Контент для "Инвентарь"</div>,
    "Правила": <div>Контент для "Правила"</div>,
    "Магические предметы": <div>Контент для "Магические предметы"</div>,
    "Бастионы": <div>Контент для "Бастионы"</div>,
    "Сокровища": <div>Контент для "Сокровища"</div>,
  };

  return subcategoryComponents[activeSubcategory] || <div>Подкатегория не выбрана</div>;
};

const Workscreen = ({ activeCategory, activeSubcategory }) => {
  const categoryComponents = {
    "Заклинания": <AllSpells />,
    "Персонажи": <div>Контент для "Персонажи"</div>,
    "Бестиарий": <div>Контент для "Бестиарий"</div>,
    "Инструменты мастера":<div>Контент для "Инструменты мастера"</div>,
  };

  return (
    <div>
      {activeSubcategory ? (
        <SubcategoryContent activeSubcategory={activeSubcategory} />
      ) : (
        categoryComponents[activeCategory] || <div>Выберите категорию и подкатегорию</div>
      )}
    </div>
  );
};

export default Workscreen;