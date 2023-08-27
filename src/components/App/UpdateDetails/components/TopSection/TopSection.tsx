import './TopSection.scss';
import { ReactComponent as Back } from '../../../../../assets/arrow-left.svg';
import deleteImg from '../../../../../assets/delete.png';
import { useState } from 'react';

interface Props {
  setIsMounted: (value: boolean) => void;
  setOpenDetails: (value: boolean) => void;
}

export default function TopSection({ setIsMounted, setOpenDetails }: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  return (
    <div className="top-section">
      <Back
        className="close-update-form"
        onClick={() => {
          setIsMounted(false);
          setTimeout(() => {
            setOpenDetails(false);
          }, 400);
        }}
      />
      <button className="delete-reservation" onClick={() => setOpenDeleteModal(true)}>
        <img className="delete-reservation-img" src={deleteImg} alt="delete reservation" />
      </button>
    </div>
  );
}
