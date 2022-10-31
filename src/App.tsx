import './App.css';
import PropertyContext from './Contexts/PopertyContext';
import TablePage from './Pages/Table/TablePage';

const App = () => {
  const property = 'sura';

  return (
    <div className="App">
      <main>
        <PropertyContext.Provider value={property}>
          <TablePage rooms={10} />
        </PropertyContext.Provider>
      </main>
    </div>
  );
};

export default App;
