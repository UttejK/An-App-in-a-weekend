import { useEffect, useState } from "react";
import supabase from "./supabase";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>
      <button className="btn btn-large" onClick={() => setCount((c) => c + 1)}>
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("Facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: Facts, error } = await query
          .order("votesInteresting", { ascending: false })
          .limit(500);
        if (!error) setFacts(Facts);
        else {
          alert("There was a problem loading the data, come back later...");
          console.log("the error is as follow:\t" + error);
        }

        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const AppTitle = "Today I Learned!";

  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" alt="Today I Learned - Logo" />
        <h1>{AppTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        type="button"
        onClick={() => setShowForm((show) => !showForm)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];
function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  async function handleSubmit(e) {
    // 1. prevent the browser reload
    e.preventDefault();
    // 2. check if the data is valid & if so create a new fact
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
    }
    // 3. Create a new fact object
    /*const newFact = {
      id: Math.round(Math.random() * 1000),
      text,
      source,
      category,
      votesInteresting: 11,
      votesMindblowing: 2,
      votesFalse: 0,
      createdIn: new Date().getFullYear(),
    };*/

    // 3. Upload a new fact to supabase
    setIsUploading(true);
    const { data: newFact, error } = await supabase
      .from("Facts")
      .insert([{ text, source, category }])
      .select();
    setIsUploading(false);

    // 4. Add the new fact to the UI: add the fact to the state
    if (!error) setFacts((facts) => [newFact[0], ...facts]);
    // 5. Reset the input fields
    setText("");
    setSource("");
    setCategory("");
    // 6. Close the form
    setShowForm(false);
  }

  return (
    <form action="" className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span className="char__count">{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trust worth source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" type="submit" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            ALL
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        No facts for this category yet! Create the first one!!!
      </p>
    );
  }

  // Temporary list

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in this DataBase</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleVote(columnName) {
    setIsUpdating(true);
    const isDisputed =
      fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
    const { data: updatedFact, error } = await supabase
      .from("Facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);
    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }
  return (
    <li className="fact">
      <p>
        {/* {isDisputed ? <span className="disputed">[DISPUTED] </span> : null} */}
        {fact.text}
        <a className="source" rel="noopener" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
