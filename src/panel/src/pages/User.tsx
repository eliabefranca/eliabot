import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardHeader, CardImg, CardBody, CardText } from 'reactstrap';
import axios from 'axios';
import Base from '../components/layout/Base';

interface User {
  id: string;
  name: string;
  number: string;
  profilePic: string;
}

function User() {
  const [user, setUser] = useState<User | null>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/${id}`)
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  if (user === null) {
    return (
      <Base>
        <h4 className="text-muted text-center">&lt;Usuário não existe /&gt;</h4>
      </Base>
    );
  }

  return (
    <Base>
      {user && (
        <>
          <h1>{user.name}</h1>

          <Card style={{ maxWidth: 400 }}>
            <CardHeader>
              <CardImg
                src={user.profilePic}
                alt={user.name}
                style={{ maxHeight: '50vh', width: 'auto' }}
              ></CardImg>
              <CardBody>
                <h4>Telefone:</h4>
                <CardText>+{user.number}</CardText>
                <div className="divider"></div>
              </CardBody>
            </CardHeader>
          </Card>
        </>
      )}
    </Base>
  );
}

export default User;
