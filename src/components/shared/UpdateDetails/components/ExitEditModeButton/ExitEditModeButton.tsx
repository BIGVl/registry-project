import { MouseEvent } from 'react';
import './ExitEditModeButton.scss';
import { EditSection } from '../../UpdateDetails';

interface Props {
  setEditSection: (value: EditSection) => void;
}

export default function ExitEditModeButton({ setEditSection }: Props) {
  function exitEditMode(e: MouseEvent<HTMLElement>) {
    e.preventDefault();
    setEditSection('');
  }

  return (
    <button onClick={exitEditMode} className="close-edit-mode">
      Inchide
    </button>
  );
}
