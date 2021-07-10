import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'reactstrap';
import Base from '../components/layout/Base';

interface User {
  id: string;
  name: string;
  number: string;
  profilePic: string;
}

function HistoryPage() {
  const [users, setUsers] = useState([] as User[]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/users')
      .then((response) => setUsers(response.data));
  }, []);

  return (
    <Base>
      <h1 className="mb-4">Usuários</h1>
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>Foto</th>
            <th>Nome</th>
            <th>Número</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr>
              <th>{user.id}</th>
              <th scope="row">
                <div className="text-center" style={{ maxWidth: 80 }}>
                  <Link to={`/user/${user.id}`}>
                    <img
                      src={user.profilePic || '/assets/img/user.png'}
                      alt={user.name}
                      className="img-thumbnail"
                    />
                  </Link>
                </div>
              </th>
              <td>{user.name}</td>
              <td>{user.number}</td>
              <td>
                <Link to={`/user/${user.id}`}>
                  <Button color="primary">
                    <i className="far fa-eye"></i> Ver mais
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Base>
  );
}

export default HistoryPage;
