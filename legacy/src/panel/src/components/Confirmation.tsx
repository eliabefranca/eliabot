import { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface Props {
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  visible: boolean;
}

function Confirmation({
  title = 'Mensagem de Confirmação',
  message = 'Tem certeza de que deseja executar esta ação?',
  visible,
  onConfirm,
  onCancel,
}: Props) {
  const [show, setShow] = useState(visible);

  const handleClose = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    handleClose();
  };

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    handleClose();
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  return (
    <Modal isOpen={show} onClose={handleClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <p>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="primary" onClick={handleConfirm}>
          Sim
        </Button>
        <Button type="button" color="secondary" onClick={handleCancel}>
          Não
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default Confirmation;
