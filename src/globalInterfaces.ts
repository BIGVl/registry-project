import { DocumentData } from 'firebase/firestore';

export interface UserInfo {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

export interface FormData extends DocumentData {
  adults: string;
  advance: number;
  entryDate: string;
  leaveDate: string;
  name: string;
  phone: string;
  discount: number;
  rooms: number[];
  prices: { [key: number]: any };
  total: number;
  balance: number;
  kids: string;
}

export interface FormDataIded extends FormData {
  id: string;
}
