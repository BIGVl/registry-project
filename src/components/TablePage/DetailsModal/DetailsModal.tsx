import './DetailsModal.scss';
import { ReactComponent as Cancel } from '../../../assets/cancel.svg';

interface Props {
  setOpenDetails: (value: boolean) => void;
  setOpenUpdateDelete: (value: boolean) => void;
  setOpenDelete: (value: boolean) => void;
}

const DetailsModal = ({ setOpenUpdateDelete, setOpenDetails, setOpenDelete }: Props) => {
  return (
    <div className="bubble-update-delete">
      <Cancel
        onClick={() => {
          setOpenUpdateDelete(false);
        }}
      />

      <div className="buttons">
        <button
          className="open-update"
          onClick={() => {
            setOpenDetails(true);

            setOpenUpdateDelete(false);
          }}
        >
          Detalii
        </button>

        <button
          className="open-delete"
          onClick={() => {
            setOpenDelete(true);

            setOpenUpdateDelete(false);
          }}
        >
          Sterge
        </button>
      </div>
    </div>
  );
};

export default DetailsModal;
