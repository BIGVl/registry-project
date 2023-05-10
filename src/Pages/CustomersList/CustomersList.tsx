import { useContext, useEffect, useState } from 'react';
import './CustomersList.scss';
import { LocationContext, UserIDContext } from '../../Contexts';
import getCustomersList from '../../helpers/getCustomersList';
import { FormDataIded } from '../../globalInterfaces';
import CustomerCard from '../../Components/CustomersList/CustomerCard';
import Search from '../../Components/CustomersList/Search';

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
      <Search />
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
