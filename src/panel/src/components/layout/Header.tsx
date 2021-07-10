import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarTogglerProps,
  NavbarBrand,
  Nav,
  NavItem,
} from 'reactstrap';

const Header = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleNavbar = () => setCollapsed(!collapsed);

  return (
    <div>
      <Navbar color="faded" dark style={{ backgroundColor: '#333' }}>
        <NavbarBrand href="/" className="ml-1 mr-auto">
          <Container>Eliabot's Panel</Container>
        </NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar>
            <NavItem>
              <Link className="nav-link" to="users">
                Usuários
              </Link>
            </NavItem>
            <NavItem>
              <Link className="nav-link" to="history">
                Histórico
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};
export default Header;
