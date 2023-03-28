import '../../../../Pages/Table/TablePage.scss';

interface PropTypes {
  rows: number;
}

const Rooms = ({ rows }: PropTypes) => {
  const rooms: any[] = [];

  for (let i = 1; i <= rows; i++) {
    rooms.push(
      <tr key={i}>
        <th className="room">{i}</th>
      </tr>
    );
  }

  return (
    <table id="rooms">
      <colgroup span={31}></colgroup>
      <thead>
        <tr>
          <th id="rooms-header">Camere</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((th: any) => {
          return th;
        })}
      </tbody>
    </table>
  );
};

export default Rooms;
