import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Card,
  CardHeader,
  CardImg,
  CardBody,
  CardText,
  Button,
  FormGroup,
} from 'reactstrap';
import axios from 'axios';
import Base from '../components/layout/Base';
import Confirmation from '../components/Confirmation';

interface User {
  id: string;
  name: string;
  number: string;
  profilePic: string;
  role?: string;
}

function User() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/users/${id}`)
      .then((response) => setUser(response.data))
      .catch(() => setUser(null));
  }, []);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:8080/users/${id}`)
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  const updateRole = (newRole: string | null) => {
    axios
      .put(`http://localhost:8080/users/${id}`, {
        ...user,
        role: newRole,
      })
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  if (user === null) {
    return (
      <Base>
        <h4 className="text-muted text-center">&lt;Usuário não existe /&gt;</h4>
      </Base>
    );
  }

  return (
    <Base>
      <Confirmation visible={showDeleteDialog} onConfirm={handleDelete} />
      {user && (
        <>
          <h1>{user.name}</h1>

          <Card style={{ maxWidth: 400 }}>
            <CardHeader>
              <div className="text-center">
                <CardImg
                  src={user.profilePic || '/assets/img/user.png'}
                  alt={user.name}
                  style={{ maxHeight: '50vh', width: 'auto' }}
                ></CardImg>
              </div>
              <CardBody>
                <h4>Telefone:</h4>
                <CardText>+{user.number}</CardText>

                <h4>Cargo:</h4>
                <CardText>{user.role || 'Nenhum'}</CardText>

                <FormGroup>
                  {user.role !== 'admin' && user.role !== 'moderator' && (
                    <Button
                      color="primary"
                      className="mr-2 mb-2"
                      onClick={() => updateRole('moderator')}
                    >
                      <i className="fas fa-user-shield"></i> Tornar Moderador
                    </Button>
                  )}

                  {user.role !== 'admin' && (
                    <Button
                      color="primary"
                      className="mr-2 mb-2"
                      onClick={() => updateRole('admin')}
                    >
                      <i className="fas fa-user-shield"></i> Tornar Admin do
                      Sistema
                    </Button>
                  )}

                  {user.role && (
                    <Button
                      color="warning"
                      className="mr-2 mb-2"
                      onClick={() => updateRole(null)}
                    >
                      Remover Cargos
                    </Button>
                  )}
                  <Button
                    color="danger"
                    className="mr-2 mb-2"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <i className="fa fa-trash"></i> Excluir
                  </Button>
                </FormGroup>
              </CardBody>
            </CardHeader>
          </Card>
        </>
      )}
    </Base>
  );
}

export default User;
