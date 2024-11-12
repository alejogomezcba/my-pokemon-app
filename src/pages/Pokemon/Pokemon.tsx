import { useState, useEffect } from "react";
import './style.css';

import successImage from '../../images/Correcto.png';
import questionImage from '../../images/question-mark.png';
import reloadImage from '../../images/reload.png';

type Form = HTMLFormElement & {
  pokemon: HTMLInputElement;
}

const Pokemon = () => {
  const [hasWon, setHasWon] = useState(false);
  const [pokemonList, setPokemonList] = useState<string[] | null>(null);
  const [matchIndex, setMatchIndex] = useState<number | null>(null);
  const [pokemonName, setPokemonName] = useState<string | null>(null);

  async function fetchAllPokemonNames() {
    const limit = 100;
    let offset = 0;
    let allPokemonNames: string[] = [];
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      const names = data.results.map((pokemon: { name: string }) => pokemon.name);
      allPokemonNames = allPokemonNames.concat(names);

      offset += limit;
      hasMore = data.next !== null;
    }

    return allPokemonNames;
  }

  useEffect(() => {
    if (!pokemonList) {
      fetchAllPokemonNames().then(names => {
        setPokemonList(names);
        setMatchIndex(Math.floor(Math.random() * names.length)); // Configura el índice aleatorio solo después de cargar los nombres
      });
    }
  }, [pokemonList]);

  const handleSubmit = (event: React.FormEvent<Form>) => {
    event.preventDefault();
    const { pokemon } = event.currentTarget;

    setPokemonName(pokemon.value.toLowerCase())

    if (pokemonList && matchIndex !== null && pokemon.value.toLowerCase() === pokemonList[matchIndex]) {
      setHasWon(true);
    } else {
      alert('Sigue intentando')
    }
  }

  return (
    <div>
      {hasWon && <img className="success-img" src={successImage} alt="imagen confirmacion" />}
      <div className="container-search">
        {pokemonList && matchIndex !== null ? (
          <>
            <img
              className="search-img" 
              style={{
                filter: hasWon ? '' : "brightness(0)"
              }}
              src={`https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${matchIndex + 1}.png?raw=true`}
              alt="pokemon"
            />
            {!hasWon && <img className="confirmacion-img" src={questionImage} alt="imagen pregunta" />}
          </>
        ) : (
          <div className="modal-cargando">
            <p className="texto-modal">Cargando Pokemon...</p>
          </div>
        )}

        {hasWon && (
          <>
            <p className="pokemon-name-pre">es</p>
            <p className="pokemon-name">{pokemonName}!</p>
            <p className="name-before-pre">es</p>
            <p className="name-before">{pokemonName}!</p>
          </>
        )}
      </div>

      {hasWon ? (
        <button onClick={() => location.reload()}>Adivinar Otro</button>
      ) : (
        <form onSubmit={handleSubmit} className="submit-form">
          <input type="text" name="pokemon" autoFocus/>
          <button type="submit">Adivinar</button>
          <img className="reload-img" src={reloadImage} alt="imagen reload" onClick={() => location.reload()} />
        </form>
      )}
    </div>
  );
}

export default Pokemon;
