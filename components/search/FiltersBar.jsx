import { useState, useEffect } from "react";
import FiltersIcon from "../../assets/icons/filters.svg";
import { Accordion } from "../elements/Accordion";
import { CheckBox } from "../elements/CheckBox";
import { CATEGORIES, COLORS, GENDERS, PRICE_RANGE } from "../../data/filters";
import { useRouter } from 'next/router';
import { Radio } from "../elements/Radio";
import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";

export const FiltersBar = () => {
    const [selectedFilters, setSelectedFilters] = useState({});

    const router = useRouter()
    const { categories, colors, gender, price } = router.query;

    useEffect(() => {
            setSelectedFilters({ 
                categories: JSON.parse(categories || '[]'),
                colors: JSON.parse(colors || '[]'),
                gender: JSON.parse(gender || '[]'),
                price: JSON.parse(price || '[]')
            })
    }, [categories, colors, gender, price])

    const handleCheckboxChange = (category, value, name) => {
        let updatedFilters;
        switch(category) {
            case "categories": 
                let categories = updateFilter(selectedFilters.categories, name, value);
                updatedFilters = { ...selectedFilters, categories };
                updateQueryParams(updatedFilters);
                break;
            case "colors":
                let colors = updateFilter(selectedFilters.colors, name, value);
                updatedFilters = { ...selectedFilters, colors};
                updateQueryParams(updatedFilters)
                break;
            default:
                break;
        }
    }

    const updateFilter = (list, item, value) => {
        let updatedList = list || [];
        if (value == true) {
            updatedList.push(item);
        } else {
            updatedList = updatedList.filter(el => el != item);
        }
        return updatedList;
    }

    const updateQueryParams = (updatedFilters) => {
        router.push({
            pathname: '/search',
            query: { 
                categories : JSON.stringify(updatedFilters.categories),
                colors: JSON.stringify(updatedFilters.colors),
                gender: JSON.stringify(updatedFilters.gender),
                price: JSON.stringify(updatedFilters.price)
            },
            shallow: true
        });
    }

    const handleRadioSelect = (value) => {
        updateQueryParams({ ...selectedFilters, gender: value})
    }

    const onSliderChange = (value) => {
        updateQueryParams({...selectedFilters, price: value})
    }

    const clearFilters = () => {
        updateQueryParams({});
    }

    return (
        <div className="space-y-4">
            <div className="flex pb-3 justify-between items-center border-b border-neutral-200">
                <div className="flex items-center gap-2">
                    <FiltersIcon />
                    <span className="font-black text-sm uppercase tracking-wider text-black">Filters</span>
                </div>
                <button 
                    type="button" 
                    className="text-xs font-bold text-black hover:underline transition" 
                    onClick={clearFilters}
                >
                    Clear All
                </button>
            </div>
            <div className="border-b border-neutral-200 pb-2">
                <Accordion label="Categories">
                    {
                        CATEGORIES.map((category, index) => {
                            return (
                                <CheckBox 
                                    key={index} 
                                    checked={(selectedFilters.categories || []).includes(category.name)}
                                    label={category.name} 
                                    onChange={(e) => handleCheckboxChange("categories", e.target.checked, category.name)}
                                />
                            );
                        })
                    }
                </Accordion>
            </div>
            <div className="border-b border-neutral-200 pb-2">
                <Accordion label="Colors">
                    {
                        COLORS.map((category, index) => {
                            return (
                                <CheckBox 
                                    key={index} 
                                    checked={(selectedFilters.colors || []).includes(category.name)}
                                    label={category.name} 
                                    onChange={(e) => handleCheckboxChange("colors", e.target.checked, category.name)} 
                                />
                            );
                        })
                    }
                </Accordion>
            </div>
            <div className="border-b border-neutral-200 pb-2">
                <Accordion label="Price Range">
                    <div className="pt-2 px-1">
                        <Slider 
                            range
                            min={PRICE_RANGE[0]}
                            max={PRICE_RANGE[1]}
                            value={selectedFilters.price && selectedFilters.price.length ? selectedFilters.price : PRICE_RANGE}
                            onChange={onSliderChange}
                            handleStyle={{
                                borderColor: "#0a0a0a",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                            }}
                            trackStyle={[{
                                background: "#0a0a0a"
                            }]}
                        />
                        <div className="flex justify-between items-center text-xs font-black text-black pt-2">
                            <span>₹{selectedFilters.price?.[0] || PRICE_RANGE[0]}</span>
                            <span>₹{selectedFilters.price?.[1] || PRICE_RANGE[1]}</span>
                        </div>
                    </div>
                </Accordion>
            </div>
            <div className="border-b border-neutral-200 pb-2">
                <Accordion label="Gender">
                    {
                        GENDERS.map((gender, index) => {
                            return (
                                <Radio 
                                    key={index} 
                                    checked={selectedFilters.gender === gender.name}
                                    label={gender.name} 
                                    name="gender" 
                                    onChange={(e) => handleRadioSelect(e.target.value)} 
                                />
                            );
                        })
                    }
                </Accordion>
            </div>
        </div>
    );
};