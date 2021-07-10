import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardHeader, CardImg, CardBody, CardText } from 'reactstrap';
import axios from 'axios';
import Base from '../components/layout/Base';

interface Group {
  id: string;
  name: string;
  thumb: string;
}

function User() {
  const [group, setGroup] = useState<Group | null>();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/${id}`)
      .then((response) => setGroup(response.data))
      .catch(() => setGroup(null));
  }, []);

  if (group === null) {
    return (
      <Base>
        <h4 className="text-muted text-center">&lt;Usuário não existe /&gt;</h4>
      </Base>
    );
  }

  return (
    <Base>
      {group && (
        <>
          <h1>{group.name}</h1>

          <Card style={{ maxWidth: 400 }}>
            <CardHeader>
              <div className="text-center">
                <CardImg
                  src={group.thumb || '/assets/img/user.png'}
                  alt={group.name}
                  style={{ maxHeight: '50vh', width: 'auto' }}
                ></CardImg>
              </div>
              <CardBody>
                <h4>Id:</h4>
                <CardText>+{group.id}</CardText>
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
