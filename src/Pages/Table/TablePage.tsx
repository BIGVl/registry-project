import { useContext } from 'react';
import './TablePage.scss';
import { LocationContext } from '../../Contexts';
import TableContainer from '../../components/TablePage/TableContainer/TableContainer';

interface Props {
  rooms: number;
}

const TablePage = ({ rooms }: Props) => {
  const locationName = useContext(LocationContext);

  return (
    <div className="table-page">
      <div className="header">
        <div className="table-header">
          <h1> {locationName} </h1>
        </div>
        {/* We pass openForm just to add it in the dependency array of the useEffect in calendar that makes requests for data, in order to avoid constant requests
    and also outdated calendar shown, we add it so everytime a new entry is made the useEffect will be run and data will pe up to date without the costly 
    infinitely query otherwise */}
      </div>
      <div className="calendar-container">
        <TableContainer rows={rooms} />
      </div>
    </div>
  );
};

export default TablePage;
