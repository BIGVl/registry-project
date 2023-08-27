import './TopSection.scss';
import { ReactComponent as Back } from '../../../../../assets/arrow-left.svg';
import deleteImg from '../../../../../assets/delete.png';
import { useState } from 'react';
import DeleteModal from '../DeleteModal/DeleteModal';
import { EntryDetails } from '../../../../../globalInterfaces';

interface Props {
  setIsMounted: (value: boolean) => void;
  setOpenDetails: (value: boolean) => void;
  entryDetails: EntryDetails;
  updateModalOpen: (value: boolean) => void;
}

export default function TopSection({ setIsMounted, setOpenDetails, entryDetails, updateModalOpen }: Props) {
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
      {openDeleteModal && (
        <DeleteModal entryDetails={entryDetails} deleteModalOpen={setOpenDeleteModal} updateModalOpen={updateModalOpen} />
      )}
      <button className="delete-reservation" onClick={() => setOpenDeleteModal(true)}>
        <img className="delete-reservation-img" src={deleteImg} alt="delete reservation" />
      </button>
    </div>
  );
}
