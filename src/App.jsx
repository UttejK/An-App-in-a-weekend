function App() {
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="/logo.png" alt="Today I Learned - Logo" />
          <h1>Today I Learned!</h1>
        </div>
        <button className="btn btn-large btn-open" type="button">
          Share a fact
        </button>
      </header>
      <NewFactForm />
      <CategoryFilter />
    </>
  );
}

function NewFactForm() {
  return (
    <form action="" className="fact-form">
      fact form
    </form>
  );
}

function CategoryFilter() {
  return <aside>Category filter</aside>;
}

function FactList() {
  return <section>facts list</section>;
}

export default App;
