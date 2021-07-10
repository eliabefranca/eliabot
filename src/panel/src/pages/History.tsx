import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'reactstrap';
import { reverse } from 'lodash';

import Base from '../components/layout/Base';

interface User {
  id: string;
  name: string;
  number: string;
  profilePic: string;
}

interface History {
  user: User;
  message: string;
  created_at: string;
  updated_at: string;
  chat: { id: string; name: string; isGroup: boolean };
}

function HistoryPage() {
  const [history, setHistory] = useState([] as History[]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/history')
      .then((response) => setHistory(reverse(response.data)));
  }, []);

  return (
    <Base>
      <h1 className="mb-4">Histórico</h1>
      <Table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Mensagem</th>
            <th>Chat</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.created_at + item.user.id}>
              <th scope="row">
                <div className="text-center" style={{ maxWidth: 80 }}>
                  <Link to={`/user/${item.user.id}`}>
                    <img
                      src={item.user.profilePic || '/assets/img/user.png'}
                      alt={item.user.name}
                      className="img-thumbnail"
                    />
                    <small>{item.user.name}</small>
                  </Link>
                </div>
              </th>

              <td>{item.message}</td>
              <td>
                {item.chat.isGroup ? (
                  <Link to={`/groups/${item.chat.id}`}>
                    <p>{item.chat.name}</p>
                  </Link>
                ) : (
                  <p>{item.chat.name}</p>
                )}
              </td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Base>
  );
}

export default HistoryPage;
