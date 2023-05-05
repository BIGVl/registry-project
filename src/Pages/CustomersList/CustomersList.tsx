import './CustomersList.scss';

interface Props {
  location: string;
}

const CustomersList = ({ location }: Props) => {
  return <div className="customerList-container">Clientii din {location} </div>;
};

export default CustomersList;
