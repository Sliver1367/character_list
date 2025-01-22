import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import Filters from "../Filters/Filters";
import SpellCard from "../SpellCard/SpellCard";
import SelectedSpells from "../SelectedSpells/SelectedSpells";
import "./AllSpells.css";

const classMapping = {
  classWizard: "Волшебник",
  classSorcerer: "Чародей",
  classWarlock: "Колдун",
  classCleric: "Жрец",
  classDruid: "Друид",
  classPaladin: "Паладин",
  classRanger: "Следопыт",
  classBard: "Бард",
  classBarbarian: "Варвар",
  classFighter: "Боец",
  classMonk: "Монах",
  classRogue: "Плут",
};

const AllSpells = ({ preSelectedSpells = [] }) => {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);
  const [selectedSpells, setSelectedSpells] = useState(preSelectedSpells);
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    const fetchSpells = async () => {
      const querySnapshot = await getDocs(collection(db, "spells"));
      const spellsData = querySnapshot.docs.map((doc) => doc.data());
      setSpells(spellsData);
      setFilteredSpells(spellsData);

      const uniqueLevels = [
        ...new Set(spellsData.map((spell) => spell.level)),
      ].sort();

      const uniqueCastingTimes = [
        ...new Set(spellsData.map((spell) => spell.castingTimeRus)),
      ].sort();

      const uniqueDurations = [
        ...new Set(spellsData.map((spell) => spell.durationRus)),
      ].sort();

      const uniqueSchools = [
        ...new Set(spellsData.map((spell) => spell.schoolRus || spell.school)),
      ].sort();

      const uniqueRanges = [
        ...new Set(spellsData.map((spell) => spell.rangeFt)),
      ].sort();

      const uniqueClasses = [
        ...new Set(
          spellsData.flatMap((spell) =>
            Object.keys(spell).filter(
              (key) => key.startsWith("class") && spell[key] === "TRUE"
            )
          )
        ),
      ]
        .sort()
        .map((cls) => classMapping[cls] || cls);

      // Уникальные компоненты (componentV, componentS, componentM)
      const uniqueComponents = {
        componentV: spellsData.some(
          (spell) => spell.componentV === true),
        componentS: spellsData.some(
          (spell) => spell.componentS === true),
        componentM: spellsData.some(
          (spell) => spell.componentM && spell.componentM.trim() !== ""
        ),
      };

      setFilterOptions({
        levels: uniqueLevels,
        castingTimes: uniqueCastingTimes,
        durations: uniqueDurations,
        schools: uniqueSchools,
        ranges: uniqueRanges,
        classes: uniqueClasses,
        components: uniqueComponents, // добавляем сюда
      });
    };

    fetchSpells();
  }, []);

  useEffect(() => {
    setSelectedSpells(preSelectedSpells);
  }, [preSelectedSpells]);

  const applyFilters = (newFilters) => {
    const filtered = spells.filter((spell) => {
      const isRitual = spell.ritual === "TRUE";
      const isConcentration = spell.concentration === "TRUE";

      const passesComponentV =
        !newFilters.componentV || spell.componentV === true;
      const passesComponentS =
        !newFilters.componentS || spell.componentS === true;
      const passesComponentM =
        !newFilters.componentM ||
        (spell.componentM && spell.componentM.trim() !== "");

      return (
        (!newFilters.name ||
          spell.titleRus
            ?.toLowerCase()
            .includes(newFilters.name.toLowerCase())) &&
        (!newFilters.level || spell.level === parseInt(newFilters.level, 10)) &&
        (!newFilters.ritual || isRitual === newFilters.ritual) &&
        (!newFilters.castingTime ||
          spell.castingTimeRus === newFilters.castingTime) &&
        (!newFilters.rangeFt || spell.rangeFt === newFilters.rangeFt) &&
        (!newFilters.duration || spell.durationRus === newFilters.duration) &&
        (!newFilters.school ||
          spell.schoolRus === newFilters.school ||
          spell.school === newFilters.school) &&
        passesComponentV && 
        passesComponentS &&
        passesComponentM &&
        (!newFilters.concentration ||
          isConcentration === newFilters.concentration)
      );
    });

    setFilteredSpells(filtered);
  };

  const toggleSelectSpell = (spell) => {
    setSelectedSpells((prevSelected) => {
      if (prevSelected.some((s) => s.titleRus === spell.titleRus)) {
        return prevSelected.filter((s) => s.titleRus !== spell.titleRus);
      }
      return [...prevSelected, spell];
    });
  };

  const removeSpell = (spellToRemove) => {
    setSelectedSpells((prevSelected) =>
      prevSelected.filter((spell) => spell.titleRus !== spellToRemove.titleRus)
    );
  };

  const resetSelectedSpells = () => {
    setSelectedSpells([]);
  };

  return (
    <div className="all-spells-container">
      <div className="filters-container">
        <Filters filterOptions={filterOptions} onApplyFilters={applyFilters} />
      </div>

      <div className="cards-container">
        {filteredSpells
          .sort((a, b) => a.titleRus.localeCompare(b.titleRus))
          .map((spell, index) => (
            <SpellCard
              key={index}
              spell={spell}
              isSelected={selectedSpells.some(
                (s) => s.titleRus === spell.titleRus
              )}
              onSelect={() => toggleSelectSpell(spell)}
            />
          ))}
      </div>

      <div className="selected-spells-container">
        <SelectedSpells
          selectedSpells={selectedSpells}
          onResetSpells={resetSelectedSpells}
          onRemoveSpell={removeSpell}
        />
      </div>
    </div>
  );
};

export default AllSpells;
