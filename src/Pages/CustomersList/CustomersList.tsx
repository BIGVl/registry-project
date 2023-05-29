import { useContext, useEffect, useState } from 'react';
import './CustomersList.scss';
import { LocationContext, UserIDContext } from '../../Contexts';
import getCustomersList from '../../helpers/getCustomersList';
import { FormDataIded } from '../../globalInterfaces';
import CustomerCard from '../../Components/CustomersList/CustomerCard/CustomerCard';
import SearchForm from '../../Components/CustomersList/SearchForm/SearchForm';

export default function CustomersList() {
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const [customers, setCustomers] = useState<FormDataIded[]>([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const unsubscribe = getCustomersList(location, userId, currentYear, setCustomers);
    return () => unsubscribe();
  }, []);

  return (
    <div className="customer-list-container">
      <h1 className="title">{location}</h1>
      <SearchForm setCustomers={setCustomers} />
      <section className="customers-list">
        <ul className="customer-cards-container">
          {customers.map((cx, i) => {
            return <CustomerCard key={i} data={cx} />;
          })}
        </ul>
      </section>
    </div>
  );
}
