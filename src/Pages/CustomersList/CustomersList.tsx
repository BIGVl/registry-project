import { useContext, useEffect, useState } from 'react';
import './CustomersList.scss';
import { LocationContext, UserIDContext } from '../../Contexts';
import getCustomersList from '../../helpers/getCustomersList';
import { FormDataIded } from '../../globalInterfaces';
import CustomerCard from '../../Components/CustomersList/CustomerCard';
import SearchForm from '../../Components/CustomersList/SearchForm';

export default function CustomersList() {
  const location = useContext(LocationContext);
  const userId = useContext(UserIDContext);
  const [customers, setCustomers] = useState<FormDataIded[]>([]);

  useEffect(() => {
    const unsubscribe = getCustomersList(location, userId, 2023, setCustomers);
    return () => unsubscribe();
  }, []);

  return (
    <div className="customer-list-container">
      <h1> Clientii din {location}</h1>
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
