import { Container } from "../index"
import logo from "../../img/logo.png"

import "./style.sass"

const Header = () => {
    return (
        <header className="header">
            <Container className="container">
                <img src={logo} alt="logo"/>
            </Container>
        </header>
    );
};

export default Header;