import React, { useState } from "react";
import cities from "../lib/city.list.json";
import Link from "next/link";

const Searchbox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { value } = e.target;
    setQuery(value);

    let matchingCities = [];

    if (value.length > 3) {
      for (let city of cities) {
        if (matchingCities.length >= 5) {
          break;
        }
        const match = city.name.toLowerCase().startsWith(value.toLowerCase());
        if (match) {
          const cityData = {
            ...city,
            slug: `${city.name.toLowerCase().replace(/ /g,"-")}-${city.id}`,
          }
          matchingCities.push(cityData);
        }
      }
    }
    return setResults(matchingCities);
  };

  return (
    <div className='search'>
      <input type='type' value={query} onChange={handleChange} />

      {query.length > 3 && (
        <ul className=''>
          {results.length > 0 ? (
            results.map((city) => (
              <li key={city.slug}>
                <Link href={`location/${city.slug}`}>
                  {city.name}
                  {city.state ? `, ${city.state}` : ""}
                  <span>({city.country})</span>
                </Link>
              </li>
            ))
          ) : (
            <li className='search__no-results'>No Data Found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Searchbox;
